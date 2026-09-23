import apiClient from "./apiClient";
import type { GalleryItem, PaginatedResponse } from "./types";

export const getGalleryItems = (params: { category?: string } = {}) =>
    apiClient.get<PaginatedResponse<GalleryItem>>("/gallery/", { params: { page_size: 24, ...params } }).then((r) => r.data.results);
