import { createContext, useContext, type ReactNode } from "react";

import { getCompanyInfo } from "../services/core";
import type { CompanyInfo } from "../services/types";
import { useFetch } from "./useFetch";

const CompanyInfoContext = createContext<CompanyInfo | null>(null);

/**
 * Fetches the dashboard-managed company info once for the whole site (re-fetched
 * on a language change by useFetch) so the header, footer, About and Contact
 * pages all show what staff saved in the dashboard.
 */
export function CompanyInfoProvider({ children }: { children: ReactNode }) {
    const { data } = useFetch(getCompanyInfo);
    return <CompanyInfoContext.Provider value={data}>{children}</CompanyInfoContext.Provider>;
}

/** Company info from the API, or null while loading / if the request failed. */
export function useCompanyInfo(): CompanyInfo | null {
    return useContext(CompanyInfoContext);
}
