import apiClient from "./apiClient";
import type { PaginatedResponse, ResearchArticle, ResearchArticleDetail } from "./types";

export const getResearchArticles = (params: { page?: number; featured?: boolean; category?: string; search?: string } = {}) =>
    apiClient.get<PaginatedResponse<ResearchArticle>>("/research/", { params }).then((r) => r.data);

export const getResearchArticleBySlug = (slug: string) =>
    apiClient.get<ResearchArticleDetail>(`/research/${slug}/`).then((r) => r.data);
