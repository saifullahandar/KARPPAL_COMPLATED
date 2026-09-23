import apiClient from "./apiClient";
import { getVisitorId } from "./visitorId";

/**
 * Fires a page-view beacon for analytics. This must never be able to break
 * the site: it's fire-and-forget (callers don't/shouldn't await it) and
 * every failure mode (network error, analytics API down, storage blocked)
 * is swallowed here rather than surfaced to the page.
 */
export function trackPageView(path: string): void {
    try {
        apiClient
            .post(
                "/analytics/track/",
                {
                    path,
                    referrer: document.referrer || "",
                    visitor_id: getVisitorId(),
                },
                { timeout: 5000 },
            )
            .catch(() => {
                // Analytics is best-effort only — never let a failed beacon
                // surface as an error anywhere in the app.
            });
    } catch {
        // Defensive: even a synchronous throw (e.g. crypto.randomUUID
        // unavailable) must not affect the page.
    }
}
