// ═══════════════════════════════════════════
//  KARIN — Contact Service
// ═══════════════════════════════════════════

import { get, post, patch, del } from "./api.js";

/** Submit contact form (public) */
export const submitContact = (data) => post("/api/contact", data);

/** Get all messages (admin only) */
export const getMessages = (page = 1, limit = 20) =>
  get(`/api/contact?page=${page}&limit=${limit}`);

/** Get dashboard stats (admin only) */
export const getMessageStats = () => get("/api/contact/stats");

/** Mark a message as read (admin only) */
export const markRead = (id) => patch(`/api/contact/${id}/read`, {});

/** Delete a message (admin only) */
export const deleteMessage = (id) => del(`/api/contact/${id}`);
