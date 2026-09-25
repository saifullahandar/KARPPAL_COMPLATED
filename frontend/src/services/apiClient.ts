import axios, { type InternalAxiosRequestConfig } from "axios";

import i18n from "../i18n";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// The staff dashboard is a server-rendered Django app on the backend's own origin with
// its own session login, so "Login" links go there rather than to a React page.
export const DASHBOARD_URL = `${baseURL.replace(/\/api\/v1\/?$/, "")}/dashboard/`;

const apiClient = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
    },
});

// Used only to call the refresh endpoint, so it can't recurse into the
// interceptors below.
const refreshClient = axios.create({ baseURL, headers: { Accept: "application/json" } });

apiClient.interceptors.request.use((config) => {
    // Every request carries the active UI language, so dashboard-managed content
    // (products, gallery, research, ...) comes back in English / Dari / Pashto.
    config.params = { lang: i18n.language, ...config.params };

    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshInFlight: Promise<string | null> | null = null;

/** Exchanges the stored refresh token for a new access token (one call at a time). */
function refreshAccessToken(): Promise<string | null> {
    if (!refreshInFlight) {
        const refresh = localStorage.getItem("refreshToken");
        refreshInFlight = (
            refresh
                ? refreshClient
                    .post<{ access: string; refresh?: string }>("/auth/refresh/", { refresh })
                    .then((res) => {
                        localStorage.setItem("accessToken", res.data.access);
                        // The API rotates refresh tokens, so keep the new one.
                        if (res.data.refresh) localStorage.setItem("refreshToken", res.data.refresh);
                        return res.data.access;
                    })
                    .catch(() => null)
                : Promise.resolve(null)
        ).finally(() => {
            refreshInFlight = null;
        });
    }
    return refreshInFlight;
}

type RetriableConfig = InternalAxiosRequestConfig & { _authRetried?: boolean };

// A 401 on a request that carried a token means that token is expired/invalid.
// Public content must never depend on it: renew the session if we still can,
// otherwise drop the dead tokens and repeat the request as a normal anonymous
// visitor (public endpoints are readable without login; protected ones simply
// answer 401 again). Without this, one stale token in localStorage made every
// public page (products, gallery, ...) fail for a visitor who had logged in earlier.
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config as RetriableConfig | undefined;
        if (error.response?.status !== 401 || !original || original._authRetried || !original.headers?.Authorization) {
            return Promise.reject(error);
        }
        original._authRetried = true;

        const sentToken = String(original.headers.Authorization).replace(/^Bearer /, "");
        let newToken = await refreshAccessToken();
        if (!newToken) {
            // Another tab may already have renewed the session while we were failing.
            const current = localStorage.getItem("accessToken");
            if (current && current !== sentToken) {
                newToken = current;
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }

        if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
        } else {
            delete original.headers.Authorization;
        }
        return apiClient(original);
    },
);

export default apiClient;
