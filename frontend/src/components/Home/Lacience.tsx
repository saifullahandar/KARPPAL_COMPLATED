import { useTranslation } from "react-i18next"
import { useFetch } from "../../hooks/useFetch"
import { getStatistics } from "../../services/core"

function Lacience() {
    const { t } = useTranslation()
    const { data: stats } = useFetch(() => getStatistics(), []);

    const fallbackStats = [
        { icon: "bi-trophy", value: t("lacience.numberOfExprience"), label: t("lacience.exprience") },
        { icon: "bi-box-seam", value: t("lacience.numberOfProducts"), label: t("lacience.products") },
        { icon: "bi-building-gear", value: t("lacience.numberOfcapacity"), label: t("lacience.capacityOfProduction") },
        { icon: "bi-people", value: t("lacience.numberOfEmployee"), label: t("lacience.specialistEmployee") },
        { icon: "bi-globe", value: t("lacience.numberOfCountry"), label: t("lacience.CountryForExpertation") },
        { icon: "bi-emoji-smile", value: t("lacience.numberOfCustomers"), label: t("lacience.happyCustomers") },
    ];

    const items = stats && stats.length > 0 ? stats : fallbackStats;

    return (
        <section className="relative overflow-hidden border border-emerald-300/40 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 px-4 py-8 text-white shadow-[0_30px_90px_rgba(16,85,43,0.45)] ring-1 ring-white/10 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_32%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.03))]" />
            <div className="absolute left-8 top-6 h-20 w-20 rounded-full bg-white/10 blur-3xl sm:h-24 sm:w-24" />
            <div className="absolute bottom-3 right-6 h-24 w-24 rounded-full bg-emerald-300/10 blur-3xl sm:right-10 sm:h-28 sm:w-28" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col items-center gap-2 text-center md:mb-8">
                    <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl md:text-4xl">
                        {t("lacience.ourAchevment")}
                    </h2>
                </div>

                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.1] hover:shadow-[0_22px_38px_rgba(0,0,0,0.18)] sm:rounded-[26px] sm:p-5"
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                            <div className="flex items-center justify-center gap-3 sm:justify-start sm:gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 group-hover:ring-white/20 sm:h-16 sm:w-16">
                                    <i className={`bi ${item.icon} text-3xl text-white`} />
                                </div>

                                <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-start">
                                    <p className="text-2xl font-black leading-none tracking-tight sm:text-[2.1rem]">{item.value}</p>
                                    <p className="text-sm font-medium text-emerald-50/90 sm:text-lg">{item.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Lacience
