# Shopify Integration Guide

## Overview
The Purlema SaaS platform integrates with Shopify stores to sync **products** and **blog posts** for social media content creation.

## Architecture

### Database
- **Table**: `shopify_integrations`
- **Columns**: 
  - `userId`: Reference to the user connecting the store
  - `shopUrl`: The Shopify store domain (e.g., `my-store.myshopify.com`)
  - `accessToken`: OAuth access token (securely stored)
  - `scope`: Permissions granted by the store
  - `createdAt`, `updatedAt`: Timestamps

### OAuth Flow

#### 1. User Initiates Connection (Settings Page)
```typescript
// User enters shop URL: "my-store.myshopify.com"
// Clicks "Connect Shopify" button
```

#### 2. Authorization Request
```
GET /api/shopify/auth?shop=my-store.myshopify.com
  ↓ redirects to
https://my-store.myshopify.com/admin/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &scope=read_products,read_content
  &redirect_uri=http://localhost:3000/api/shopify/callback
```

#### 3. User Approves in Shopify Admin
- Shopify shows a permission screen
- User clicks "Install app"
- Shopify redirects back to `/api/shopify/callback` with `code` and `shop` params

#### 4. Token Exchange
```typescript
// POST to Shopify with code
// Receive access_token back
// Store in database
```

#### 5. Connected Status
- User sees "Connected to [shop-url]" in Settings
- The app can now fetch products and blogs

## API Functions

### `getShopifyIntegration(userId: number)`
Returns the user's Shopify integration record or `null` if not connected.

### `getShopifyProducts(userId: number)`
Fetches all products from the connected Shopify store.
```typescript
const products = await getShopifyProducts(user.id);
// Returns: [{ id, title, handle, images, ... }]
```

### `getShopifyBlogs(userId: number)`
Fetches all blogs from the connected Shopify store.
```typescript
const blogs = await getShopifyBlogs(user.id);
// Returns: [{ id, title, handle, articles_count, ... }]
```

## Configuration

### Shopify Partner Dashboard Setup

1. **Create App**
   - Go to [partners.shopify.com](https://partners.shopify.com)
   - Apps → Create App → Create app manually
   - Name: "Purlema SaaS"

2. **Configuration**
   - **App URL**: `http://localhost:3000` (or production URL)
   - **Allowed redirection URL(s)**: `http://localhost:3000/api/shopify/callback`

3. **API Credentials**
   - Note the **Client ID** and **Client secret**
   - Set Webhook API Version to **2025-10**

4. **Scopes**
   - Required: `read_products`, `read_content`

### Environment Variables
```env
SHOPIFY_API_KEY=your_client_id
SHOPIFY_API_SECRET=your_client_secret
SHOPIFY_APP_URL=http://localhost:3000
SHOPIFY_SCOPES=read_products,read_content
```

## Testing

### With a Development Store
1. Create a development store in Partner Dashboard
2. In Settings, enter: `my-test-store.myshopify.com`
3. Click "Connect Shopify"
4. Approve the permissions in Shopify
5. Should see "Connected" status

### Debugging
- Check `shopify_integrations` table in database
- Verify access token is stored correctly
- Check browser console for any redirect errors
- Verify `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` are set correctly

## Future Enhancements
- Add ability to disconnect/reconnect store
- Cache products/blogs to avoid repeated API calls
- Add webhook support for real-time store updates
- Support multiple Shopify stores per user
- Sync product images for content preview
