import apiClient from "./apiClient";
import type { Category, PaginatedResponse, Product } from "./types";

export interface ProductListParams {
    page?: number;
    page_size?: number;
    search?: string;
    category?: string;
    featured?: boolean;
}

export const getProducts = (params: ProductListParams = {}) =>
    apiClient.get<PaginatedResponse<Product>>("/products/", { params }).then((r) => r.data);

export const getProduct = (slug: string) => apiClient.get<Product>(`/products/${slug}/`).then((r) => r.data);

export const getCategories = () =>
    apiClient.get<PaginatedResponse<Category>>("/products/categories/", { params: { page_size: 50 } }).then((r) => r.data.results);
