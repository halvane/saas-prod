import 'server-only';

const UPLOAD_POST_API_URL = 'https://api.upload-post.com/api/uploadposts/users';

export async function createUserProfile(username: string) {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  if (!apiKey) {
    throw new Error('UPLOAD_POST_API_KEY is not defined');
  }

  const response = await fetch(UPLOAD_POST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${apiKey}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.text();
    // If user already exists, we can consider it a success or handle it gracefully
    // Note: The API might return a specific error code or message for duplicates.
    // We'll assume 400 or 409 with a message.
    // For now, let's log and throw, but the caller can handle "already exists".
    console.error('Upload-Post Create User Error:', error);
    throw new Error(`Failed to create Upload-Post profile: ${error}`);
  }

  return response.json();
}

export async function generateJwt(username: string) {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  if (!apiKey) {
    throw new Error('UPLOAD_POST_API_KEY is not defined');
  }

  const response = await fetch(`${UPLOAD_POST_API_URL}/generate-jwt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${apiKey}`,
    },
    body: JSON.stringify({ 
        username,
        connect_title: 'Connect Social Media',
        show_calendar: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Upload-Post Generate JWT Error:', error);
    throw new Error(`Failed to generate Upload-Post JWT: ${error}`);
  }

  return response.json(); // Returns { access_url: string }
}

export async function getUserProfile(username: string) {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  if (!apiKey) {
    throw new Error('UPLOAD_POST_API_KEY is not defined');
  }

  // Fetch all users and filter by username
  // Note: Ideally the API would support filtering by username query param
  const response = await fetch(UPLOAD_POST_API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${apiKey}`,
    },
    next: { revalidate: 0 } // Disable cache to get latest status
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Upload-Post Get Users Error:', error);
    throw new Error(`Failed to fetch Upload-Post users: ${error}`);
  }

  const data = await response.json();
  
  // The API returns { profiles: [...] }
  if (data && Array.isArray(data.profiles)) {
    const user = data.profiles.find((u: any) => u.username === username);
    return user;
  }
  
  return null;
}
