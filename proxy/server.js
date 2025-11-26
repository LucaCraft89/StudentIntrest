// Simple Node.js proxy server for Docker deployment
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// API Configuration
const API_BASE_URL = "https://web.spaggiari.eu/rest/v1";
const API_KEY = process.env.API_KEY || "Tg1NWEwNGIgIC0K";
const USER_AGENT = "CVVS/std/4.1.7 Android/10";

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Z-Auth-Token"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy all requests to Spaggiari API
app.all("*", async (req, res) => {
  const endpoint = req.path;
  const targetUrl = `${API_BASE_URL}${endpoint}`;

  console.log(`${req.method} ${endpoint} -> ${targetUrl}`);

  const headers = {
    "Content-Type": "application/json",
    "Z-Dev-ApiKey": API_KEY,
    "User-Agent": USER_AGENT,
  };

  // Forward auth token if present
  const authToken = req.headers["z-auth-token"];
  if (authToken) {
    headers["Z-Auth-Token"] = authToken;
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📡 Proxying to: ${API_BASE_URL}`);
  console.log(`🌍 CORS origin: ${corsOptions.origin}`);
});
