import { useTranslation } from "react-i18next";

import { useFetch } from "../../../hooks/useFetch";
import { getGalleryItems } from "../../../services/gallery";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function Gallery() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("gallery.title")} — ${t("footer.company")}`);
    const { data: items, loading, error } = useFetch(() => getGalleryItems(), []);

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white text-slate-800">
            <main className="mx-auto mt-25 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <section className="relative mb-10 overflow-hidden rounded-[32px] border border-green-200/70 bg-gradient-to-r from-emerald-600 via-green-600 to-green-500 p-6 text-white shadow-[0_30px_80px_rgba(16,185,129,0.25)] sm:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_35%)]" />
                    <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-emerald-950/30 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="mb-3 text-sm font-medium uppercase tracking-[0.32em] text-emerald-100/90">
                                {t("gallery.eyebrow")}
                            </p>
                            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                                {t("gallery.title")}
                            </h1>
                        </div>
                    </div>
                </section>

                {loading && <LoadingState label={t("gallery.loading")} />}
                {error && <ErrorState message={t("gallery.error")} />}
                {!loading && !error && (items?.length ?? 0) === 0 && <EmptyState message={t("gallery.empty")} />}

                {!loading && !error && items && items.length > 0 && (
                    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => (
                            <article key={item.id} className="group overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_18px_40px_-18px_rgba(16,185,129,0.35)] transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-[0_25px_45px_-20px_rgba(16,185,129,0.45)]">
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                                </div>
                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        {item.category && (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                {item.category.name}
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="mb-2 text-xl font-bold text-slate-900">{item.title}</h2>
                                    {item.description && (
                                        <p className="text-sm leading-7 text-slate-600">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
