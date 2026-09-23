import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Runs `fetcher` on mount (and whenever `deps` or the active UI language changes),
 * tracking loading/error/data. Re-running on a language change is what makes
 * database-driven content follow the language switcher without a page reload.
 * Guards against setting state after unmount so a slow request can't warn/crash
 * if the user has already navigated away.
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
    const { i18n } = useTranslation();
    const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });

    useEffect(() => {
        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        fetcher()
            .then((data) => {
                if (!cancelled) setState({ data, loading: false, error: null });
            })
            .catch(() => {
                if (!cancelled) {
                    setState({ data: null, loading: false, error: "Unable to load data. Please try again later." });
                }
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, i18n.language]);

    return state;
}
