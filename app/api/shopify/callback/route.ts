import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, saveShopifyIntegration } from '@/lib/shopify/service';
import { getUser } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const searchParams = req.nextUrl.searchParams;
  const shop = searchParams.get('shop');
  const code = searchParams.get('code');
  // const state = searchParams.get('state'); // Verify state in production

  if (!shop || !code) {
    return NextResponse.json({ error: 'Missing shop or code' }, { status: 400 });
  }

  try {
    const { access_token, scope } = await exchangeCodeForToken(shop, code);
    
    await saveShopifyIntegration(user.id, shop, access_token, scope);
    
    // Redirect back to settings with success message
    return NextResponse.redirect(new URL('/settings?shopify=connected', req.url));
  } catch (error) {
    console.error('Shopify callback error:', error);
    return NextResponse.redirect(new URL('/settings?shopify=error', req.url));
  }
}
