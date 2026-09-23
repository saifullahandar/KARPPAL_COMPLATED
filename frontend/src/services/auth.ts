import apiClient from "./apiClient";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
    full_name: string;
    role: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: AuthUser;
}

export const login = async (payload: LoginPayload) => {
    const { data } = await apiClient.post<LoginResponse>("/auth/login/", payload);
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
