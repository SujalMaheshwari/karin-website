// ═══════════════════════════════════════════
//  KARIN — API Service Base
//  All HTTP requests go through here
// ═══════════════════════════════════════════

const fallbackApiUrl = import.meta.env.DEV ? "http://localhost:5000" : "";

export const API_URL = import.meta.env.VITE_API_URL || fallbackApiUrl;

/**
 * Base fetch wrapper
 * - Adds Content-Type and Auth headers automatically
 * - Throws on non-2xx responses with the server's message
 */
export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("karin_admin_token");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res  = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export const get   = (url, opts)       => request(url, { method: "GET",    ...opts });
export const post  = (url, body, opts) => request(url, { method: "POST",   body: JSON.stringify(body), ...opts });
export const patch = (url, body, opts) => request(url, { method: "PATCH",  body: JSON.stringify(body), ...opts });
export const del   = (url, opts)       => request(url, { method: "DELETE", ...opts });
