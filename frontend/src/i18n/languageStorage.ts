const STORAGE_KEY = "karppal_lang";
const SUPPORTED_LANGUAGES = ["en", "fa", "ps"] as const;
export const DEFAULT_LANGUAGE = "ps";

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
    return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/** Reads the persisted language choice. Never throws — localStorage can be
 * unavailable (private browsing, blocked site data), in which case the site
 * just falls back to the default language instead of breaking. */
export function getStoredLanguage(): SupportedLanguage {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
    } catch {
        return DEFAULT_LANGUAGE;
    }
}

/** Persists the user's language choice so it survives reloads/new tabs. */
export function setStoredLanguage(lang: string): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
        // Storage unavailable — the language still applies for this session,
        // it just won't be remembered next time. Not a fatal condition.
    }
}
