import { useTranslation } from "react-i18next";

import { useFetch } from "../../../hooks/useFetch";
import { getJobPostings } from "../../../services/jobs";
import { LoadingState, ErrorState, EmptyState } from "../../../components/Status/StatusStates";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

function JobChance() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("jobs.title")} — ${t("footer.company")}`);
    const { data: jobs, loading, error } = useFetch(() => getJobPostings(), []);

    const employmentLabels: Record<string, string> = {
        full_time: t("jobs.employmentTypes.fullTime"),
        part_time: t("jobs.employmentTypes.partTime"),
        remote: t("jobs.employmentTypes.remote"),
        contract: t("jobs.employmentTypes.contract"),
    };

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white text-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-25">
                <header className="mb-10 overflow-hidden rounded-[32px] border border-green-200 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(22,163,74,0.25)] backdrop-blur-sm md:flex md:items-center md:justify-between">
                    <div className="relative z-10">
                        <p className="mb-2 text-sm font-bold tracking-[0.25em] text-green-600 uppercase">
                            Karpaal
                        </p>
                        <h1 className="text-3xl font-black text-slate-900 md:text-5xl">
                            {t("jobs.title")}
                        </h1>
                    </div>

                    <div className="mt-6 flex items-center gap-3 md:mt-0">
                        <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-lg text-green-600 sm:flex">
                            ✓
                        </div>
                        <a
                            href="/jobs-export"
                            className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-[0_18px_35px_-15px_rgba(22,163,74,0.8)] transition duration-200 hover:bg-green-700 hover:shadow-[0_22px_40px_-15px_rgba(22,163,74,0.9)]"
                        >
                            {t("jobs.applyButton")}
                        </a>
                    </div>
                </header>

                <section className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-[0_14px_30px_-20px_rgba(15,118,110,0.35)] transition hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_18px_40px_-20px_rgba(22,163,74,0.45)]">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-700">
                            💼
                        </div>
                        <h2 className="text-xl font-black text-slate-900">{t("jobs.cards.freshTitle")}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            {t("jobs.cards.freshText")}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-[0_14px_30px_-20px_rgba(15,118,110,0.35)] transition hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_18px_40px_-20px_rgba(22,163,74,0.45)]">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                            ✅
                        </div>
                        <h2 className="text-xl font-black text-slate-900">{t("jobs.cards.nationalTitle")}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            {t("jobs.cards.nationalText")}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-[0_14px_30px_-20px_rgba(15,118,110,0.35)] transition hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_18px_40px_-20px_rgba(22,163,74,0.45)]">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-2xl text-lime-700">
                            🚀
                        </div>
                        <h2 className="text-xl font-black text-slate-900">{t("jobs.cards.growthTitle")}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            {t("jobs.cards.growthText")}
                        </p>
                    </div>
                </section>

                <main className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_0.5fr]">
                    <section className="rounded-[28px] border border-green-100 bg-white p-6 shadow-[0_20px_45px_-25px_rgba(22,163,74,0.25)]">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-black text-slate-900">{t("jobs.recentTitle")}</h2>
                            <span className="rounded-full bg-green-100 px-3.5 py-1.5 text-xs font-bold text-green-700">
                                {t("jobs.postingsCount", { count: jobs?.length ?? 0 })}
                            </span>
                        </div>

                        {loading && <LoadingState label={t("jobs.loading")} />}
                        {error && <ErrorState message={t("jobs.error")} />}
                        {!loading && !error && (jobs?.length ?? 0) === 0 && <EmptyState message={t("jobs.empty")} />}

                        {!loading && !error && jobs && jobs.length > 0 && (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <article key={job.id} className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-5 transition duration-200 hover:border-green-300 hover:shadow-[0_15px_30px_-25px_rgba(22,163,74,0.7)]">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="text-[11px] font-bold tracking-[0.24em] text-green-600 uppercase">
                                                    {employmentLabels[job.employment_type] ?? job.employment_type}
                                                </p>
                                                <h3 className="mt-2 text-xl font-black text-slate-900">{job.title}</h3>
                                            </div>
                                            <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                                {t("jobs.activeBadge")}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                                            {job.location && <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">{job.location}</span>}
                                            {job.tag_list.map((tag) => (
                                                <span key={tag} className="rounded-full bg-white px-3 py-1.5 shadow-sm">{tag}</span>
                                            ))}
                                        </div>

                                        <div className="mt-4">
                                            <a href="/jobs-export" className="text-sm font-bold text-green-700 hover:text-green-800">
                                                {t("jobs.applyForPosition")}
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-[28px] bg-gradient-to-br from-green-700 to-emerald-600 p-6 text-white shadow-[0_24px_50px_-20px_rgba(22,163,74,0.8)]">
                            <p className="text-sm font-semibold text-green-100">{t("jobs.sidebar.activeOpportunities")}</p>
                            <p className="mt-3 text-4xl font-black">{jobs?.length ?? 0}</p>
                            <p className="mt-2 text-sm text-green-50/90">{t("jobs.sidebar.activeOpportunitiesDesc")}</p>
                        </div>

                        <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-[0_20px_35px_-25px_rgba(34,197,94,0.32)]">
                            <h3 className="text-xl font-black text-slate-900">{t("jobs.sidebar.guideTitle")}</h3>
                            <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                <li className="flex items-center gap-3 rounded-xl bg-green-50 px-3 py-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                    {t("jobs.sidebar.guideResume")}
                                </li>
                                <li className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                                    {t("jobs.sidebar.guideExplore")}
                                </li>
                                <li className="flex items-center gap-3 rounded-xl bg-lime-50 px-3 py-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-lime-600" />
                                    {t("jobs.sidebar.guideGrow")}
                                </li>
                            </ul>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
export default JobChance;
