import apiClient from "./apiClient";
import type { PaginatedResponse, Service } from "./types";

export const getServices = () =>
    apiClient.get<PaginatedResponse<Service>>("/services/", { params: { page_size: 50 } }).then((r) => r.data.results);
