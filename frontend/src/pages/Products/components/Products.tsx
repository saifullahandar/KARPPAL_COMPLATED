import { useTranslation } from "react-i18next";
import { useFetch } from "../../../hooks/useFetch";
import { getProducts } from "../../../services/products";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

function Products() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("products.title")} — ${t("footer.company")}`);

    const { data, loading, error } = useFetch(() => getProducts({ page_size: 8 }), []);
    const products = data?.results ?? [];

    const stats = [
        { label: t("products.stats.products"), value: data ? `${data.count}+` : "—" },
        { label: t("products.stats.customers"), value: t("products.stats.customerRate") },
        { label: t("products.stats.delivery"), value: t("products.stats.deliveryTime") },
    ];

    return (
        <div
            dir={i18n.dir()}
            lang={i18n.language === "en" ? "en" : `${i18n.language}-AF`}
            className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#f6fff9,_#ebfdf5_18%,_#f8fafc_58%,_#f0fdf4_100%)] text-slate-800"
        >
            <div className="mx-auto mt-25 max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

                {/* Header */}
                <header className="relative mt-6 mb-8 overflow-hidden rounded-[36px] border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-6 text-white shadow-[0_30px_80px_rgba(22,163,74,0.28)] sm:p-8">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(187,247,208,0.18),_transparent_30%)]" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div className="w-full lg:max-w-2xl">

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.22em] text-green-50 backdrop-blur-sm">
                                <span className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(163,230,53,1)]" />
                                {t("products.store")}
                            </div>

                            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                {t("products.title")}
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-7 text-green-50/95 sm:text-base">
                                {t("products.description")}
                            </p>

                        </div>

                        <a
                            href="/contact"
                            className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-extrabold text-green-700 shadow-[0_20px_40px_rgba(255,255,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-[0_24px_50px_rgba(255,255,255,0.3)] sm:w-auto"
                        >
                            {t("products.quickOrder")}
                        </a>

                    </div>
                </header>

                {/* Stats */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-[24px] border border-green-100 bg-white/90 p-5 shadow-[0_18px_45px_rgba(22,163,74,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(22,163,74,0.12)]"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {item.label}
                            </p>

                            <p className="mt-3 text-3xl font-black text-green-700 sm:text-4xl">
                                {item.value}
                            </p>
                        </div>
                    ))}

                </section>

                {/* Products */}
                <section className="space-y-5">

                    {loading && <LoadingState label={t("products.loading")} />}
                    {error && <ErrorState message={t("products.error")} />}
                    {!loading && !error && products.length === 0 && <EmptyState message={t("products.empty")} />}

                    {!loading && !error && products.map((product) => (
                        <article
                            key={product.id}
                            id={product.slug}
                            className="group overflow-hidden rounded-[30px] border border-green-100 bg-white p-4 shadow-[0_20px_50px_rgba(15,118,110,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_65px_rgba(22,163,74,0.14)] sm:p-5"
                        >

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                                {/* Image */}
                                <div
                                    className="flex h-40 w-full items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-4 transition-all duration-500 group-hover:scale-[1.02] lg:h-52 lg:w-64"
                                >
                                    <div className="flex h-32 w-32 items-center justify-center rounded-[24px] bg-white p-2 shadow-[0_18px_35px_rgba(22,163,74,0.12)] ring-1 ring-green-100 transition-transform duration-300 group-hover:scale-105 sm:h-40 sm:w-40 lg:h-48 lg:w-48">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full rounded-[18px] object-cover"
                                        />

                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">

                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                                        <div className="flex flex-wrap gap-2">
                                            {product.tag1 && (
                                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                                    {product.tag1}
                                                </span>
                                            )}
                                            {product.tag2 && (
                                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                                    {product.tag2}
                                                </span>
                                            )}
                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
                                                {product.category_name}
                                            </span>
                                        </div>

                                    </div>

                                    <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                                        {product.name}
                                    </h2>

                                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                                        {product.short_description}
                                    </p>

                                    <div className="mt-5 flex flex-col gap-4 border-t border-green-50 pt-4 sm:flex-row sm:items-center sm:justify-between">

                                        <span className="text-2xl font-black text-green-700">
                                            {product.price ? `${product.price} ${product.currency}` : t("products.buy")}
                                        </span>

                                        <a
                                            href="/contact"
                                            className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_18px_35px_rgba(22,163,74,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:from-green-500 hover:to-emerald-500"
                                        >
                                            {t("products.buy")}
                                        </a>

                                    </div>

                                </div>

                            </div>

                        </article>
                    ))}

                    <a
                        href="/all"
                        className="block w-full rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-center text-sm font-extrabold text-white shadow-[0_20px_45px_rgba(22,163,74,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:from-green-500 hover:to-emerald-500 sm:text-base"
                    >
                        {t("products.viewAll")}
                    </a>

                </section>
            </div>
        </div>
    );
}

export default Products;
