// Cloudflare Worker to proxy Spaggiari API requests
// This bypasses CORS restrictions for the web version

const API_BASE_URL = "https://web.spaggiari.eu/rest/v1";
const API_KEY = "Tg1NWEwNGIgIC0K";
const USER_AGENT = "CVVS/std/4.1.7 Android/10";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to your domain in production
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Z-Auth-Token",
  "Access-Control-Max-Age": "86400",
};

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  const url = new URL(request.url);
  const endpoint = url.pathname;

  // Build the target URL
  const targetUrl = `${API_BASE_URL}${endpoint}`;

  // Get the request body if it exists
  const body = request.method !== "GET" ? await request.text() : null;

  // Build headers for Spaggiari API
  const headers = {
    "Content-Type": "application/json",
    "Z-Dev-ApiKey": API_KEY,
    "User-Agent": USER_AGENT,
  };

  // Add Z-Auth-Token if present in original request
  const authToken = request.headers.get("Z-Auth-Token");
  if (authToken) {
    headers["Z-Auth-Token"] = authToken;
  }

  try {
    // Make request to Spaggiari API
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
    });

    // Get response data
    const responseData = await apiResponse.text();

    // Return with CORS headers
    return new Response(responseData, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
}

// Export for Cloudflare Workers
export default {
  async fetch(request) {
    return handleRequest(request);
  },
};
