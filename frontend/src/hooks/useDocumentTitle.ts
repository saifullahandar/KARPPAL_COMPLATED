import { useEffect } from "react";

// Sets document.title for the current route. Each page computes its own
// translated string (via t()) and passes it in, so the tab title stays in
// sync with both the active route and the active language without needing
// a routing/head-management library.
export function useDocumentTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
