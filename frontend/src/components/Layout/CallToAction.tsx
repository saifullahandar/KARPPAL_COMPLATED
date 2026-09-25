import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft } from "lucide-react";

function CallToAction() {
    const { t, i18n } = useTranslation();
    const Arrow = i18n.dir() === "rtl" ? ArrowLeft : ArrowRight;

    return (
        <section dir={i18n.dir()} className="bg-[linear-gradient(to_bottom,#f0fdf4_0%,#f0fdf4_50%,#052e16_50%,#052e16_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-green-200/60 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-[0_30px_80px_-20px_rgba(22,163,74,0.45)] sm:p-12">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(190,242,100,0.2),_transparent_35%)]" />
                <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full border border-white/15" />
                <div className="absolute -bottom-20 -start-10 h-48 w-48 rounded-full bg-lime-300/15 blur-2xl" />

                <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">

                    <div className="max-w-2xl">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-widest text-green-50 backdrop-blur-sm">
                            <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(163,230,53,1)]" />
                            {t("cta.badge")}
                        </span>

                        <h2 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                            {t("cta.title")}
                        </h2>

                        <p className="mt-3 text-base leading-7 text-green-50/90 sm:text-lg">
                            {t("cta.text")}
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
                        <Link
                            to="/contact"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-green-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-50 hover:shadow-xl"
                        >
                            {t("slider.contactUs")}
                            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </Link>

                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                        >
                            {t("nav.products")}
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default CallToAction;
