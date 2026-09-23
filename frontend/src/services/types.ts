export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    order: number;
    active: boolean;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    price: string | null;
    currency: string;
    image: string;
    tag1: string;
    tag2: string;
    featured: boolean;
    category: string;
    category_name: string;
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    icon: string;
    short_description: string;
    description: string;
    featured: boolean;
    active: boolean;
    order: number;
}

export interface GalleryCategory {
    id: number;
    name: string;
    slug: string;
    order: number;
    active: boolean;
}

export interface GalleryItem {
    id: number;
    title: string;
    description: string;
    image: string;
    category: GalleryCategory | null;
    featured: boolean;
    order: number;
    active: boolean;
    created_at: string;
}

export interface ResearchCategory {
    id: number;
    name: string;
    slug: string;
    order: number;
    active: boolean;
}

export interface ResearchArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string;
    category: string | null;
    category_name: string;
    author_name: string;
    featured: boolean;
    published_at: string;
}

export interface ResearchArticleDetail {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    category: ResearchCategory | null;
    author_name: string;
    featured: boolean;
    published: boolean;
    published_at: string;
    meta_title: string;
    meta_description: string;
    created_at: string;
    updated_at: string;
}

export interface JobPosting {
    id: number;
    title: string;
    slug: string;
    employment_type: "full_time" | "part_time" | "remote" | "contract";
    location: string;
    tags: string;
    tag_list: string[];
    description: string;
    requirements: string;
    status: "active" | "closed";
    featured: boolean;
    posted_at: string;
    closing_date: string | null;
}

export interface JobApplicationPayload {
    job?: number | null;
    first_name: string;
    last_name: string;
    country: string;
    phone: string;
    gender?: "male" | "female" | "";
    application_date?: string;
    description?: string;
}

export interface ContactMessagePayload {
    name: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
}

export interface CompanyInfo {
    name: string;
    tagline: string;
    description: string;
    mission: string;
    vision: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    whatsapp_url: string;
    map_url: string;
    logo: string | null;
    favicon: string | null;
    map_image: string | null;
    founded_year: number | null;
}

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    cta_text: string;
    cta_link: string;
    order: number;
}

export interface Statistic {
    id: number;
    icon: string;
    value: string;
    label: string;
    order: number;
}

export interface Feature {
    id: number;
    icon: string;
    title: string;
    text: string;
    order: number;
}
