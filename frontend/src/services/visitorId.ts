const STORAGE_KEY = "karppal_visitor_id";

/** A random, anonymous per-browser identifier used only to deduplicate
 * visitor counts in analytics (see backend apps/analytics/models.py). It is
 * not derived from IP address or any device fingerprint, and carries no
 * personal information — it's simply a random UUID persisted in
 * localStorage. If storage is unavailable (private browsing, blocked site
 * data), a fresh one is generated per page load instead of breaking
 * tracking or falling back to something more identifying. */
export function getVisitorId(): string {
    try {
        let id = window.localStorage.getItem(STORAGE_KEY);
        if (!id) {
            id = crypto.randomUUID();
            window.localStorage.setItem(STORAGE_KEY, id);
        }
        return id;
    } catch {
        return crypto.randomUUID();
    }
}
