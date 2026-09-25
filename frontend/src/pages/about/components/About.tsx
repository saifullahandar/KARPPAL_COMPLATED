import { GiEyeTarget, GiPoliceOfficerHead } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

function About() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("about.title")} — ${t("footer.company")}`);

    return (
        <section
            className="about-page relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-white py-16 text-slate-800 md:py-24"
            dir={i18n.dir()}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_40%)]" />

            <div className="relative mt-25 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mx-auto mb-12 max-w-3xl text-center">

                    <span className="mb-5 inline-flex rounded-full bg-emerald-100 px-5 py-3 text-2xl font-bold text-emerald-700 ring-1 ring-emerald-200 shadow-sm md:text-3xl">
                        {t("about.badge")}
                    </span>

                    <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                        {t("about.title")}
                    </h1>

                </div>

                {/* Description */}
                <div className="mb-12 rounded-[28px] border border-emerald-100 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(16,185,129,0.35)] backdrop-blur-sm md:p-8">

                    <p className="mx-auto max-w-4xl text-lg leading-8 text-slate-600 md:text-xl">
                        {t("about.description")}
                    </p>

                </div>

                {/* Mission & Vision */}
                <div className="about-grid grid gap-8 md:grid-cols-2">

                    {/* Mission */}
                    <div className="group rounded-[28px] border border-emerald-100 bg-white p-7 shadow-[0_18px_40px_-18px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(16,185,129,0.45)]">

                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner ring-1 ring-emerald-200">
                            <GiPoliceOfficerHead
                                strokeWidth={20}
                                fill="none"
                                size={30}
                            />
                        </div>

                        <h2 className="mb-3 text-2xl font-bold text-slate-900">
                            {t("about.missionTitle")}
                        </h2>

                        <p className="text-base leading-8 text-slate-600">
                            {t("about.missionText")}
                        </p>

                    </div>

                    {/* Vision */}
                    <div className="group rounded-[28px] border border-emerald-100 bg-white p-7 shadow-[0_18px_40px_-18px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(16,185,129,0.45)]">

                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-inner ring-1 ring-green-200">
                            <GiEyeTarget size={30} />
                        </div>

                        <h2 className="mb-3 text-2xl font-bold text-slate-900">
                            {t("about.visionTitle")}
                        </h2>

                        <p className="text-base leading-8 text-slate-600">
                            {t("about.visionText")}
                        </p>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default About;