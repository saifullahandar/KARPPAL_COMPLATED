import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ExportPage() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("exportPage.title")} — ${t("footer.company")}`);

    const shipments = [
        { invoice: "EXP-2048", countryKey: "uae", amount: "120,000 USD", statusKey: "completed" },
        { invoice: "EXP-2041", countryKey: "germany", amount: "84,500 USD", statusKey: "shipping" },
        { invoice: "EXP-2037", countryKey: "canada", amount: "65,200 USD", statusKey: "pending" },
    ] as const;

    const statusClasses: Record<string, string> = {
        completed: "bg-green-100 text-green-700 ring-green-200",
        shipping: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        pending: "bg-amber-100 text-amber-700 ring-amber-200",
    };

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white px-3 py-5 text-slate-800 sm:px-4 sm:py-8">
            <div className="mx-auto max-w-6xl mt-25">
                <header className="mb-6 overflow-hidden rounded-[22px] border border-green-200 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 text-white shadow-[0_20px_50px_-18px_rgba(22,163,74,0.55)] sm:mb-8 sm:rounded-[28px] sm:p-6">
                    <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-green-50 backdrop-blur-sm sm:text-[11px]">
                                <span className="h-2 w-2 rounded-full bg-green-200" />
                                {t("exportPage.eyebrow")}
                            </div>
                            <h1 className="text-2xl font-black sm:text-3xl md:text-4xl">{t("exportPage.title")}</h1>
                        </div>

                        <a href="/contact" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/10 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto sm:px-5">
                            {t("exportPage.exportReportButton")}
                        </a>
                    </div>
                </header>

                <main className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
                    <section className="min-w-0 space-y-6">
                        <div className="rounded-[24px] bg-white p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-green-100 sm:rounded-[28px] sm:p-6">
                            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">{t("exportPage.liveMonitoring")}</p>
                                    <h2 className="mt-1 text-xl font-extrabold text-slate-800 sm:text-2xl">{t("exportPage.monitoringTitle")}</h2>
                                </div>
                                <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 ring-1 ring-green-200">
                                    {t("exportPage.activeBadge")}
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm">
                                    <p className="text-sm text-slate-500">{t("exportPage.stats.totalExports")}</p>
                                    <p className="mt-3 text-2xl font-black text-slate-800">$ 1.24M</p>
                                    <p className="mt-2 text-xs font-medium text-green-600">{t("exportPage.stats.totalExportsGrowth")}</p>
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
                                    <p className="text-sm text-slate-500">{t("exportPage.stats.completedOrders")}</p>
                                    <p className="mt-3 text-2xl font-black text-slate-800">486</p>
                                    <p className="mt-2 text-xs font-medium text-emerald-600">{t("exportPage.stats.completedOrdersGrowth")}</p>
                                </div>

                                <div className="rounded-2xl border border-lime-100 bg-gradient-to-br from-lime-50 to-green-50 p-4 shadow-sm sm:col-span-2 xl:col-span-1">
                                    <p className="text-sm text-slate-500">{t("exportPage.stats.pending")}</p>
                                    <p className="mt-3 text-2xl font-black text-slate-800">92</p>
                                    <p className="mt-2 text-xs font-medium text-amber-600">{t("exportPage.stats.pendingNote")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] bg-white p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-green-100 sm:rounded-[28px] sm:p-6">
                            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">{t("exportPage.recentListTitle")}</h2>
                                <a href="#" className="text-sm font-bold text-green-600 transition hover:text-green-700">
                                    {t("exportPage.viewAll")}
                                </a>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-green-100">
                                <table className="min-w-[640px] divide-y divide-green-100 text-start">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-bold text-green-700">{t("exportPage.table.invoice")}</th>
                                            <th className="px-4 py-3 text-sm font-bold text-green-700">{t("exportPage.table.country")}</th>
                                            <th className="px-4 py-3 text-sm font-bold text-green-700">{t("exportPage.table.amount")}</th>
                                            <th className="px-4 py-3 text-sm font-bold text-green-700">{t("exportPage.table.status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-green-100 bg-white">
                                        {shipments.map((row) => (
                                            <tr key={row.invoice} className="transition hover:bg-green-50/60">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.invoice}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{t(`exportPage.countries.${row.countryKey}`)}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{row.amount}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[row.statusKey]}`}>
                                                        {t(`exportPage.statuses.${row.statusKey}`)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-[24px] bg-white p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-green-100 sm:rounded-[28px] sm:p-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="text-lg font-extrabold text-slate-800 sm:text-xl">{t("exportPage.summaryTitle")}</h3>
                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">{t("exportPage.thisMonth")}</span>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-600">
                                        <span>{t("exportPage.summary.shipped")}</span>
                                        <span className="font-bold text-slate-800">78%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-green-100">
                                        <div className="h-full w-[78%] rounded-full bg-green-600" />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-600">
                                        <span>{t("exportPage.summary.onTime")}</span>
                                        <span className="font-bold text-slate-800">91%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-green-100">
                                        <div className="h-full w-[91%] rounded-full bg-emerald-600" />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-600">
                                        <span>{t("exportPage.summary.satisfaction")}</span>
                                        <span className="font-bold text-slate-800">96%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-green-100">
                                        <div className="h-full w-[96%] rounded-full bg-teal-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] bg-gradient-to-br from-green-700 via-emerald-700 to-teal-700 p-4 text-white shadow-[0_25px_50px_-16px_rgba(22,163,74,0.75)] sm:rounded-[28px] sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-green-100">{t("exportPage.recentNotes")}</p>
                                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-green-50">{t("exportPage.liveBadge")}</span>
                            </div>
                            <h3 className="mt-4 text-xl font-black sm:text-2xl">{t("exportPage.internationalShipping")}</h3>
                            <p className="mt-3 text-sm leading-7 text-green-50/90">
                                {t("exportPage.internationalShippingText")}
                            </p>
                            <button className="mt-5 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-50">
                                {t("exportPage.moreDetails")}
                            </button>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
