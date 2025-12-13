import { NextRequest, NextResponse } from 'next/server';
import { getShopifyAuthUrl } from '@/lib/shopify/service';
import { getUser } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const searchParams = req.nextUrl.searchParams;
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  // Basic validation of shop URL
  if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
     return NextResponse.json({ error: 'Invalid shop URL. Must be example.myshopify.com' }, { status: 400 });
  }

  // Generate a random state for CSRF protection (in a real app, store this in cookie/session)
  const state = Math.random().toString(36).substring(7);
  
  const authUrl = getAuthUrl(shop, state);
  
  return NextResponse.redirect(authUrl);
}

function getAuthUrl(shop: string, state: string) {
    return getShopifyAuthUrl(shop, state);
}
