# How to Test the Content Matrix System

## Prerequisites
1.  **Admin Access:** Ensure your user account has `role = 'admin'` in the database.
    *   You can check/set this via Drizzle Studio (`npm run db:studio`) or SQL.
2.  **Brand DNA Configured:** You must have a Brand DNA set up in the `/brand` page (Brand Name, Industry, etc.).
3.  **Images (Optional but Recommended):** Add a Logo and some Product images in the Brand DNA page to test image mapping.

## Testing Steps

1.  **Navigate to Brand DNA:**
    *   Go to `http://localhost:3000/brand` (or your deployed URL).

2.  **Trigger Generation:**
    *   Look for the **JSON Icon Button** (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>) in the top right header area.
    *   *Note: This button is only visible to Admins.*
    *   Click the button.

3.  **Observe Behavior:**
    *   **First Run:** It should take **3-10 seconds**. This is the AI generating the "Content Matrix" (headlines, quotes, etc.) for the first time.
    *   **Subsequent Runs:** Click it again. It should be **instant (< 1s)**. This confirms the caching is working and it's just doing local mapping.

4.  **Verify Output:**
    *   A modal will open displaying the generated JSON for ALL templates.
    *   **Check Text:** Look for `headline`, `cta`, `quote` variables. They should be filled with brand-relevant text (not generic placeholders).
    *   **Check Images:** Look for `image`, `bg`, `product` variables. They should contain URLs from your Brand DNA (or placeholders if you didn't add any).

5.  **Download JSON:**
    *   Click "Download JSON" in the modal to save the file for inspection.

## Troubleshooting

*   **Button not visible?** Check your user role in the `users` table.
*   **"No Brand DNA found"?** Go to the Brand page and click "Save Changes" to ensure a record exists.
*   **Generation failed?** Check the server console logs. Ensure `AI_GATEWAY_API_KEY` is set in `.env`.
