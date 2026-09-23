import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { useFetch } from "../../../hooks/useFetch";
import { getResearchArticleBySlug } from "../../../services/research";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const DATE_LOCALES: Record<string, string> = {
    en: "en-US",
    fa: "fa-IR",
    ps: "ps-AF",
};

export default function ResearchDetail() {
    const { t, i18n } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const { data: article, loading, error } = useFetch(() => getResearchArticleBySlug(slug ?? ""), [slug]);
    useDocumentTitle(article ? `${article.title} — ${t("footer.company")}` : `${t("research.title")} — ${t("footer.company")}`);
    const dateLocale = DATE_LOCALES[i18n.language] ?? "en-US";

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 mt-25">
                <Link
                    to="/research"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
                >
                    {t("research.backToList")}
                </Link>

                {loading && <LoadingState label={t("research.loading")} />}
                {error && <ErrorState message={t("research.error")} />}
                {!loading && !error && !article && <EmptyState message={t("research.notFound")} />}

                {!loading && !error && article && (
                    <article className="overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-200">
                        {article.featured_image ? (
                            <img src={article.featured_image} alt={article.title} className="h-72 w-full object-cover sm:h-96" />
                        ) : (
                            <div className="h-72 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700 sm:h-96" />
                        )}
                        <div className="p-6 sm:p-10">
                            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                                    {article.category?.name || t("research.categoryFallback")}
                                </span>
                                <span>{new Date(article.published_at).toLocaleDateString(dateLocale)}</span>
                                {article.author_name && (
                                    <span>{t("research.byAuthor", { author: article.author_name })}</span>
                                )}
                            </div>
                            <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                                {article.title}
                            </h1>
                            <div className="whitespace-pre-line text-base leading-8 text-slate-700">
                                {article.content}
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
}
