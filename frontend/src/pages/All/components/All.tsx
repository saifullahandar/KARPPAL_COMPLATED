import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../../hooks/useFetch";
import { getProducts } from "../../../services/products";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const ACCENTS = ["#16a34a", "#22c55e", "#65a30d", "#4ade80", "#15803d", "#84cc16"];

export default function All() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("all.title")} — ${t("footer.company")}`);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, loading, error } = useFetch(() => getProducts({ page, search: search || undefined }), [page, search]);
    const products = data?.results ?? [];
    const totalPages = data ? Math.max(1, Math.ceil(data.count / 12)) : 1;

    return (
        <main
            dir={i18n.dir()}
            className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.28),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.18),_transparent_22%),linear-gradient(135deg,_#021a0d_0%,_#052e16_26%,_#14532d_58%,_#0f172a_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8"
        >
            <div className="mx-auto mt-28 max-w-7xl">
                <header className="relative mb-10 overflow-hidden rounded-[32px] border border-green-500/25 bg-white/5 px-6 py-6 shadow-[0_30px_90px_rgba(22,163,74,0.18)] backdrop-blur-2xl sm:px-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(134,239,172,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.14),_transparent_22%)]" />
                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-300/40 bg-gradient-to-br from-green-400/30 via-green-500/20 to-lime-200/10 shadow-[0_18px_38px_rgba(22,163,74,0.24)]">
                                <span className="text-2xl">🌿</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-green-200/80">
                                    {t("all.eyebrow")}
                                </p>
                                <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
                                    {t("all.title")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <input
                                type="search"
                                aria-label={t("all.searchPlaceholder")}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder={t("all.searchPlaceholder")}
                                className="rounded-full border border-green-300/35 bg-green-600/10 px-4 py-2.5 text-sm text-white placeholder:text-green-200/60 outline-none focus:border-green-300"
                            />
                        </div>
                    </div>
                </header>

                {loading && <LoadingState label={t("all.loading")} />}
                {error && <ErrorState message={t("all.error")} />}
                {!loading && !error && products.length === 0 && <EmptyState message={t("all.empty")} />}

                {!loading && !error && products.length > 0 && (
                    <>
                        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                            {products.map((product, index) => {
                                const accent = ACCENTS[index % ACCENTS.length];
                                return (
                                    <article
                                        key={product.id}
                                        className="group relative overflow-hidden rounded-[28px] border border-green-500/15 bg-slate-950/60 shadow-[0_22px_70px_rgba(2,6,23,0.56)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-400/30 hover:shadow-[0_28px_80px_rgba(22,163,74,0.2)]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-200/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div
                                            className="relative flex h-[150px] items-center justify-center overflow-hidden p-4"
                                            style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)` }}
                                        >
                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-2xl" />
                                        </div>

                                        <div className="relative p-4 md:p-5">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <h2 className="text-[1.08rem] font-extrabold tracking-tight text-slate-50">
                                                    {product.name}
                                                </h2>
                                                <span className="inline-flex h-3 w-3 rounded-full bg-green-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
                                            </div>

                                            <p className="m-0 text-sm leading-6 text-slate-300/90">
                                                {product.short_description}
                                            </p>

                                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-green-500/20 pt-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-green-200/80">{t("all.categoryLabel")}</span>
                                                    <span className="text-sm font-black text-green-300">
                                                        {product.category_name}
                                                    </span>
                                                </div>
                                                <a
                                                    href="/contact"
                                                    className="rounded-full border border-green-400/30 bg-green-500/10 px-3 py-1.5 text-[11px] font-bold text-green-200 transition hover:bg-green-400/20"
                                                >
                                                    {t("all.orderButton")}
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-3">
                                <button
                                    disabled={!data?.previous}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="rounded-full border border-green-400/30 px-4 py-2 text-sm text-green-100 disabled:opacity-40"
                                >
                                    {t("all.previous")}
                                </button>
                                <span className="text-sm text-green-200">{t("all.pageOf", { page, totalPages })}</span>
                                <button
                                    disabled={!data?.next}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-full border border-green-400/30 px-4 py-2 text-sm text-green-100 disabled:opacity-40"
                                >
                                    {t("all.next")}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
