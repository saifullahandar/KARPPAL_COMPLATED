import { useEffect, useState } from "react";
import {
    BiSolidFactory,
    BiCheckShield,
    BiLeaf,
    BiSolidTruck,
    BiGlobe,
    BiHeadphone,
    BiArrowBack,
} from "react-icons/bi";

import hero from "../../assets/images/background.jfif";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch";
import { getFeatures, getHeroSlides } from "../../services/core";

const FALLBACK_ICONS = [BiSolidFactory, BiCheckShield, BiLeaf, BiSolidTruck, BiGlobe, BiHeadphone];

function Slider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { t, i18n } = useTranslation();

    const { data: slides } = useFetch(() => getHeroSlides(), []);
    const { data: features } = useFetch(() => getFeatures(), []);

    const sliderItems = slides && slides.length > 0 ? slides.map((s) => s.image) : [hero];

    const fallbackFeatures = [
        { icon: "standardProduction", key: "features.standardProduction" },
        { icon: "qualityControl", key: "features.qualityControl" },
        { icon: "naturalProducts", key: "features.naturalProducts" },
        { icon: "fastDelivery", key: "features.fastDelivery" },
        { icon: "globalExport", key: "features.globalExport" },
        { icon: "support", key: "features.support" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % sliderItems.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [sliderItems.length]);

    return (
        <section className="px-3 pt-20 sm:px-4 md:pt-24 bg-white">
            <div className="mx-auto max-w-7xl">
                {/* ================= Slider ================= */}
                <div className="relative mt-6 h-[260px] overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-[0_20px_60px_rgba(22,101,52,0.12)] sm:h-72 md:h-80 lg:h-[360px] xl:h-[420px]">
                    <div
                    dir="ltr"
                        // The track's slide order/transform math is index-based and left-to-right by
                        // construction (translateX(-index * 100%)); it must stay LTR regardless of the
                        // active UI language or the animation direction inverts. Slide content itself
                        // (text/buttons below) is given the real language direction independently.
                        className="flex h-full transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${activeIndex * 100}%)`,
                        }}
                    >
                        {sliderItems.map((item, index) => (
                            <div key={index} className="relative h-full min-w-full">
                                <img
                                    src={item}
                                    alt={t("slider.slideAlt", { n: index + 1 })}
                                    className="h-full w-full object-cover "
                                />
                                <div className="absolute inset-0 bg-gradient-to-r to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16">
                                    <div dir={i18n.dir()} className="flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-center shadow-lg backdrop-blur-sm sm:flex-row sm:p-5">
                                        <a
                                            href="/all"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-700 bg-green-700 px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                                        >
                                            <BiArrowBack className="text-base" />
                                            <span>{t("slider.ShowAllproduct")}</span>
                                        </a>
                                        <a
                                            href="/contact"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                                        >
                                            <span>{t("slider.contactUs")}</span>
                                            <Phone className="text-base" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        aria-label={t("slider.previousSlide")}
                        onClick={() => setActiveIndex((prev) => (prev - 1 + sliderItems.length) % sliderItems.length)}
                        className="absolute hover:cursor-pointer left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-green-700 shadow-md transition hover:bg-green-600 hover:text-white"
                    >
                        <ArrowLeft />
                    </button>
                    <button
                        type="button"
                        aria-label={t("slider.nextSlide")}
                        onClick={() => setActiveIndex((prev) => (prev + 1) % sliderItems.length)}
                        className="absolute hover:cursor-pointer right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-green-700 shadow-md transition hover:bg-green-600 hover:text-white"
                    >
                        <ArrowRight />
                    </button>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-md backdrop-blur-sm sm:bottom-5">
                        {sliderItems.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 bg-green-600" : "w-2.5 bg-green-200"
                                    }`}
                                aria-label={t("slider.goToSlide", { n: index + 1 })}
                            />
                        ))}
                    </div>
                </div>

                {/* ================= Features ================= */}
                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                    {features && features.length > 0 ? (
                        features.map((feature) => (
                            <div key={feature.id} className="rounded-2xl border border-green-100 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <i className={`bi ${feature.icon} text-3xl`} />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-green-700 sm:text-lg">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                            </div>
                        ))
                    ) : (
                        fallbackFeatures.map((f, i) => {
                            const Icon = FALLBACK_ICONS[i];
                            return (
                                <div key={f.icon} className="rounded-2xl border border-green-100 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                        <Icon size={40} />
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-green-700 sm:text-lg">{t(`${f.key}.title`)}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{t(`${f.key}.text`)}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}

export default Slider;
