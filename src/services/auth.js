// ═══════════════════════════════════════════
//  KARIN — Auth Service
// ═══════════════════════════════════════════

import { get, post } from "./api.js";

/** Login and get JWT token */
export const login = (username, password) =>
  post("/api/auth/login", { username, password });

/** Verify current token and get admin info */
export const getMe = () => get("/api/auth/me");

/** Clear token from localStorage */
export const logout = () =>
  localStorage.removeItem("karin_admin_token");

/** Check if user is logged in */
export const isLoggedIn = () =>
  Boolean(localStorage.getItem("karin_admin_token"));
