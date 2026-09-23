import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useFetch } from "../../../hooks/useFetch";
import { getResearchArticles } from "../../../services/research";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const DATE_LOCALES: Record<string, string> = {
    en: "en-US",
    fa: "fa-IR",
    ps: "ps-AF",
};

export default function Research() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("research.title")} — ${t("footer.company")}`);
    const { data, loading, error } = useFetch(() => getResearchArticles({}), []);
    const articles = data?.results ?? [];
    const [featured, ...rest] = articles;
    const dateLocale = DATE_LOCALES[i18n.language] ?? "en-US";

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-25">
                <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 p-6 text-white shadow-lg shadow-green-200 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="mb-2 text-sm font-medium text-green-100">{t("research.eyebrow")}</p>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("research.title")}</h1>
                        </div>
                    </div>
                    <p className="max-w-2xl text-sm text-green-100 sm:text-base">
                        {t("research.subtitle")}
                    </p>
                </header>

                {loading && <LoadingState label={t("research.loading")} />}
                {error && <ErrorState message={t("research.error")} />}
                {!loading && !error && articles.length === 0 && <EmptyState message={t("research.empty")} />}

                {!loading && !error && featured && (
                    <section className="mb-8 overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-200">
                        <div className="grid gap-0 md:grid-cols-2">
                            <div className="relative min-h-[280px] bg-gradient-to-br from-green-600 via-emerald-700 to-teal-900 p-6 text-white">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]" />
                                <div className="relative z-10 flex h-full flex-col justify-between">
                                    <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                                        {t("research.featuredBadge")}
                                    </span>
                                    <div>
                                        <p className="mb-3 text-sm text-green-100">
                                            {new Date(featured.published_at).toLocaleDateString(dateLocale)}
                                        </p>
                                        <h2 className="text-2xl font-bold leading-relaxed sm:text-3xl">
                                            {featured.title}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between p-6 sm:p-8">
                                <div>
                                    <p className="mb-3 text-sm font-medium text-green-700">
                                        {featured.category_name || t("research.categoryFallback")}
                                    </p>
                                    <p className="text-base leading-8 text-slate-600">
                                        {featured.excerpt}
                                    </p>
                                </div>
                                <Link
                                    to={`/research/${featured.slug}`}
                                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                                >
                                    {t("research.readMore")}
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {!loading && !error && rest.length > 0 && (
                    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {rest.map((article) => (
                            <article key={article.id} className="overflow-hidden rounded-3xl bg-white shadow-md shadow-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                                {article.featured_image ? (
                                    <img src={article.featured_image} alt={article.title} className="h-48 w-full object-cover" />
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700" />
                                )}
                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                                        <span>{article.category_name || t("research.categoryFallback")}</span>
                                        <span>{new Date(article.published_at).toLocaleDateString(dateLocale)}</span>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold leading-8 text-slate-900">
                                        {article.title}
                                    </h3>
                                    <p className="mb-4 text-sm leading-7 text-slate-600">
                                        {article.excerpt}
                                    </p>
                                    <Link
                                        to={`/research/${article.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
                                    >
                                        {t("research.readMore")}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}
