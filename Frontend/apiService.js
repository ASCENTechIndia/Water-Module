// src/services/apiService.js
import CryptoJS from "crypto-js";

const API_SECRET = "your-secret-key"; // Must match backend
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

const encryptParams = (params) => {
  const jsonString = JSON.stringify(params);
  return CryptoJS.AES.encrypt(jsonString, API_SECRET).toString();
};

const decryptResponse = (payload) => {
  try {
    if (!payload || typeof payload !== "string") {
      // If it's not a string (i.e., already JSON), return as-is
      return payload;
    }

    const bytes = CryptoJS.AES.decrypt(payload, API_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // Check if decryption succeeded
    if (!decrypted) throw new Error("Decryption returned empty string");

    return JSON.parse(decrypted);
  } catch (error) {
    console.warn(
      "⚠️ Skipping decryption. Response might be plain JSON:",
      payload
    );
    return payload; // Return raw if already JSON or decryption failed
  }
};

const resolveUrl = (endpoint) => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const base = (BASE_API_URL || "").replace(/\/+$/, "");
  const clean = endpoint.replace(/^\/+/, "");

  if (base.endsWith("/api")) {
    if (clean.startsWith("api/")) {
      return `${base}/${clean.slice(4)}`;
    }
    return `${base}/${clean}`;
  }

  if (clean.startsWith("api/")) {
    return `${base}/${clean}`;
  }
  return `${base}/api/${clean}`;
};

const apiService = {
  post: async (endpoint, data) => {
    const url = resolveUrl(endpoint);
    console.log(`📡 POST: ${url}`, data);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      console.log("backend response :", response);

      // Return { data: ... } for compatibility with component expectations
      return {
        data: response.data || response,
        ...response,
      };
    } catch (err) {
      console.error("API POST error:", err);
      throw err;
    }
  },

  get: async (endpoint, params = {}) => {
    const urlObj = new URL(resolveUrl(endpoint));
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        urlObj.searchParams.append(key, params[key]);
      }
    });

    console.log(`📡 GET: ${urlObj.toString()}`);

    try {
      const res = await fetch(urlObj.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
      });

      const response = await res.json();
      return {
        data: response.data || response,
        ...response,
      };
    } catch (err) {
      console.error("API GET error:", err);
      throw err;
    }
  },

  delete: async (endpoint, data = {}) => {
    const url = resolveUrl(endpoint);
    console.log(`📡 DELETE: ${url}`);

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      return {
        data: response.data || response,
        ...response,
      };
    } catch (err) {
      console.error("API DELETE error:", err);
      throw err;
    }
  },
  getRawFile: async (encodedPath) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/proxy/public-file/${encodedPath}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType =
        response.headers.get("content-type") || "application/octet-stream";
      return { arrayBuffer, contentType };
    } catch (err) {
      console.error("❌ Error fetching raw file:", err);
      throw err;
    }
  },
  getBlob: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${BASE_API_URL}/${endpoint}?${queryString}`;

    try {
      const response = await fetch(fullUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const contentType = response.headers.get("content-type");
      return { blob, contentType };
    } catch (error) {
      console.error("❌ Error in getBlob:", error);
      throw error;
    }
  },
};

export default apiService;
