import { useTranslation } from "react-i18next";
import { useFetch } from "../../../hooks/useFetch";
import { getServices } from "../../../services/services";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const CARD_STYLES = [
    { bg: "bg-emerald-100", shadow: "shadow-emerald-200/70" },
    { bg: "bg-green-100", shadow: "shadow-green-200/70" },
    { bg: "bg-lime-100", shadow: "shadow-lime-200/70" },
    { bg: "bg-teal-100", shadow: "shadow-teal-200/70" },
    { bg: "bg-rose-100", shadow: "shadow-rose-200/70" },
    { bg: "bg-cyan-100", shadow: "shadow-cyan-200/70" },
];

export default function ServicesPage() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("services.title")} — ${t("footer.company")}`);
    const { data: services, loading, error } = useFetch(() => getServices(), []);

    return (
        <div
            dir={i18n.dir()}
            lang={i18n.language === "en" ? "en" : `${i18n.language}-AF`}
            className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 text-slate-800"
        >
            <section className="mx-auto mt-20 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-14 text-center">

                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-5 py-2 text-sm font-bold tracking-[0.08em] text-emerald-700 shadow-sm">
                        {t("services.badge")}
                    </span>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                        {t("services.title")}
                    </h1>

                    <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                        {t("services.description")}
                    </p>

                </div>

                {/* Services */}
                {loading && <LoadingState label={t("services.loading")} />}
                {error && <ErrorState message={t("services.error")} />}
                {!loading && !error && (services?.length ?? 0) === 0 && <EmptyState message={t("services.empty")} />}

                {!loading && !error && services && services.length > 0 && (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                        {services.map((service, index) => {
                            const style = CARD_STYLES[index % CARD_STYLES.length];
                            return (
                                <div
                                    key={service.id}
                                    className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-[0_18px_45px_rgba(16,185,129,0.16)]"
                                >

                                    <div
                                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-inner ${style.bg} ${style.shadow}`}
                                    >
                                        {service.icon}
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {service.name}
                                    </h2>

                                    <p className="mt-3 text-base leading-7 text-slate-600">
                                        {service.short_description || service.description}
                                    </p>

                                </div>
                            );
                        })}

                    </div>
                )}

                {/* CTA */}
                <div className="mt-14 rounded-[2rem] bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-6 py-10 text-center text-white shadow-[0_25px_50px_rgba(16,185,129,0.35)] sm:px-10">

                    <h2 className="text-3xl font-extrabold sm:text-4xl">
                        {t("services.cta.title")}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-emerald-50 sm:text-lg">
                        {t("services.cta.description")}
                    </p>

                    <a
                        href="/contact"
                        className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-emerald-700 shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                    >
                        {t("services.cta.button")}
                    </a>

                </div>

            </section>
        </div>
    );
}
