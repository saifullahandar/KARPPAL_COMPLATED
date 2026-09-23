import apiClient from "./apiClient";
import type { CompanyInfo, Feature, HeroSlide, Statistic } from "./types";

export const getCompanyInfo = () => apiClient.get<CompanyInfo>("/core/company-info/").then((r) => r.data);

export const getHeroSlides = () => apiClient.get<HeroSlide[]>("/core/hero-slides/").then((r) => r.data);

export const getStatistics = () => apiClient.get<Statistic[]>("/core/statistics/").then((r) => r.data);

export const getFeatures = () => apiClient.get<Feature[]>("/core/features/").then((r) => r.data);
