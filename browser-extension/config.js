// Configuration that adapts to environment
const ENV = {
  isExtension:
    typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id,
  // Automatically detect proxy URL based on current location
  // Uses /api/ path which works through Cloudflare tunnel or nginx proxy
  proxyUrl:
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}/api`
      : "http://localhost:3000",
};

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://web.spaggiari.eu/rest/v1",
  API_KEY: "Tg1NWEwNGIgIC0K",
  USER_AGENT: "CVVS/std/4.1.7 Android/10",
};

// Get the appropriate fetch function based on environment
function getApiUrl(endpoint) {
  if (ENV.isExtension) {
    // Extension can call API directly (declarativeNetRequest handles headers)
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  } else {
    // Website must use proxy
    const url = `${ENV.proxyUrl}${endpoint}`;
    console.log("[API] Request URL:", url);
    return url;
  }
}

// Fetch wrapper that adapts to environment
async function apiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);

  // For extension, we need to add headers directly
  if (ENV.isExtension) {
    options.headers = {
      ...options.headers,
      "Z-Dev-ApiKey": API_CONFIG.API_KEY,
    };
  }
  // For website, proxy will handle headers

  return fetch(url, options);
}
