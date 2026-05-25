import { del, get, patch, post } from "./api.js";

export const getCmsContent = () => get("/api/cms");

export const getCmsResource = (resource) => get(`/api/cms/${resource}`);

export const createCmsItem = (resource, payload) =>
  post(`/api/cms/${resource}`, payload);

export const updateCmsItem = (resource, id, payload) =>
  patch(`/api/cms/${resource}/${id}`, payload);

export const deleteCmsItem = (resource, id) =>
  del(`/api/cms/${resource}/${id}`);
