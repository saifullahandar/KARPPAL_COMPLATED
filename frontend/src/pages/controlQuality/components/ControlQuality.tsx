import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ControlQuality() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("controlQuality.title")} — ${t("footer.company")}`);

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 text-slate-800">
            <div className="mx-auto mt-25 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="relative mb-8 overflow-hidden rounded-[32px] border border-green-200/50 bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 p-6 text-white shadow-[0_22px_70px_rgba(22,163,74,0.32)] ring-1 ring-green-200/50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_30%)]" />
                    <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/12 blur-3xl" />
                    <div className="absolute -bottom-16 left-1/4 h-36 w-36 rounded-full bg-lime-200/20 blur-3xl" />
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />

                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                                <span className="h-5 w-5 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.9)]" />
                                <h1 className="text-[30px] font-semibold tracking-[0.24em] text-emerald-50/90">
                                    {t("controlQuality.title")}
                                </h1>
                            </div>

                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md">
                            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-100/80">{t("controlQuality.projectLabel")}</p>
                            <p className="mt-1 text-lg font-black text-white">Karpaal</p>
                        </div>
                    </div>
                </header>

                <main className="space-y-6">
                    <section className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_12px_30px_rgba(16,185,129,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(16,185,129,0.12)]">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">{t("controlQuality.stats.samples")}</span>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                    {t("controlQuality.stats.today")}
                                </span>
                            </div>
                            <p className="text-4xl font-black text-slate-800">128</p>
                            <p className="mt-3 text-sm text-slate-500">{t("controlQuality.stats.acceptanceRate")}: <span className="font-semibold text-emerald-600">96.4%</span></p>
                        </div>

                        <div className="rounded-3xl border border-lime-100 bg-white p-5 shadow-[0_12px_30px_rgba(132,204,22,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(132,204,22,0.12)]">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">{t("controlQuality.stats.inReview")}</span>
                                <span className="rounded-full bg-lime-100 px-2.5 py-1 text-[10px] font-bold text-lime-700">
                                    {t("controlQuality.stats.activeBadge")}
                                </span>
                            </div>
                            <p className="text-4xl font-black text-slate-800">24</p>
                            <p className="mt-3 text-sm text-slate-500">{t("controlQuality.stats.inReviewNote")}</p>
                        </div>

                        <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-[0_12px_30px_rgba(239,68,68,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(239,68,68,0.12)]">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">{t("controlQuality.stats.issues")}</span>
                                <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                                    {t("controlQuality.stats.criticalBadge")}
                                </span>
                            </div>
                            <p className="text-4xl font-black text-slate-800">07</p>
                            <p className="mt-3 text-sm text-slate-500">{t("controlQuality.stats.issuesNote")}</p>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                        <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-emerald-100">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">{t("controlQuality.reviewEyebrow")}</p>
                                    <h2 className="text-2xl font-black text-slate-800">{t("controlQuality.dailyReportTitle")}</h2>
                                </div>
                                <button className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-600">
                                    {t("controlQuality.newResultButton")}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-100">
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-bold text-slate-700">{t("controlQuality.checks.colorCoating")}</span>
                                        <span className="font-bold text-emerald-600">98%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                                        <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-cyan-50/80 p-4 ring-1 ring-cyan-100">
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-bold text-slate-700">{t("controlQuality.checks.dimensions")}</span>
                                        <span className="font-bold text-cyan-600">94%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-cyan-100">
                                        <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-lime-50/80 p-4 ring-1 ring-lime-100">
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-bold text-slate-700">{t("controlQuality.checks.performance")}</span>
                                        <span className="font-bold text-lime-600">89%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-lime-100">
                                        <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-lime-500 to-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                            <p className="text-sm text-emerald-200">{t("controlQuality.todayStatus")}</p>
                            <h3 className="mt-2 text-2xl font-black">{t("controlQuality.shortReport")}</h3>

                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-slate-300">{t("controlQuality.approvedSamples")}</p>
                                    <p className="mt-2 text-3xl font-black text-emerald-400">112</p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-slate-300">{t("controlQuality.rejectedSamples")}</p>
                                    <p className="mt-2 text-3xl font-black text-red-400">16</p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-slate-300">{t("controlQuality.avgReviewTime")}</p>
                                    <p className="mt-2 text-3xl font-black text-cyan-300">1.8h</p>
                                </div>
                            </div>
                        </aside>
                    </section>

                    <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-emerald-100">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">{t("controlQuality.topSectionsEyebrow")}</p>
                                <h2 className="text-2xl font-black text-slate-800">{t("controlQuality.reportsTitle")}</h2>
                            </div>
                            <button className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
                                {t("controlQuality.showAll")}
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                                <p className="text-sm text-slate-500">{t("controlQuality.sections.production")}</p>
                                <p className="mt-2 text-2xl font-black text-slate-800">91%</p>
                            </div>

                            <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-4 shadow-sm">
                                <p className="text-sm text-slate-500">{t("controlQuality.sections.packaging")}</p>
                                <p className="mt-2 text-2xl font-black text-slate-800">95%</p>
                            </div>

                            <div className="rounded-2xl border border-lime-100 bg-gradient-to-br from-lime-50 to-white p-4 shadow-sm">
                                <p className="text-sm text-slate-500">{t("controlQuality.sections.assembly")}</p>
                                <p className="mt-2 text-2xl font-black text-slate-800">88%</p>
                            </div>

                            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
                                <p className="text-sm text-slate-500">{t("controlQuality.sections.delivery")}</p>
                                <p className="mt-2 text-2xl font-black text-slate-800">97%</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
