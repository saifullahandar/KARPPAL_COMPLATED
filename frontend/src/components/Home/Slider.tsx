import { useRef, useState } from "react";
import {
    BiSolidFactory,
    BiCheckShield,
    BiLeaf,
    BiSolidTruck,
    BiGlobe,
    BiHeadphone,
} from "react-icons/bi";

import hero from "../../assets/images/background.jfif";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch";
import { getFeatures, getHeroSlides } from "../../services/core";
import type { HeroSlide } from "../../services/types";

const FALLBACK_ICONS = [BiSolidFactory, BiCheckShield, BiLeaf, BiSolidTruck, BiGlobe, BiHeadphone];

const SLIDE_MS = 7000;

function Slider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === "rtl";

    const { data: slides, loading: slidesLoading } = useFetch(() => getHeroSlides(), []);
    const { data: features, loading: featuresLoading } = useFetch(() => getFeatures(), []);

    // First load only (a language switch keeps the old data while refetching): show
    // placeholders instead of flashing the built-in content before the dashboard's.
    const waitingForSlides = slidesLoading && !slides;
    const waitingForFeatures = featuresLoading && !features;

    // Dashboard slides (title/subtitle/button already in the active language), or one
    // built-in slide — only if the dashboard has none or the request failed — so the
    // hero is never empty.
    const sliderItems: HeroSlide[] =
        slides && slides.length > 0
            ? slides
            : [{ id: 0, title: t("slider.defaultTitle"), subtitle: t("slider.defaultSubtitle"), image: hero, cta_text: "", cta_link: "", order: 0 }];
    const count = sliderItems.length;
    const current = Math.min(activeIndex, count - 1);

    const fallbackFeatures = [
        { icon: "standardProduction", key: "features.standardProduction" },
        { icon: "qualityControl", key: "features.qualityControl" },
        { icon: "naturalProducts", key: "features.naturalProducts" },
        { icon: "fastDelivery", key: "features.fastDelivery" },
        { icon: "globalExport", key: "features.globalExport" },
        { icon: "support", key: "features.support" },
    ];

    const goTo = (index: number) => setActiveIndex((index + count) % count);
    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    // Swipe on touch screens; "forward" follows the reading direction.
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 50) return;
        if ((dx < 0) !== isRtl) next();
        else prev();
    };

    // pt-28 = the fixed header (h-10) + nav (h-18) above, so the hero is never tucked under them.
    return (
        <section className="px-3 pt-28 sm:px-4 bg-white">
            <div className="mx-auto max-w-7xl">
                {/* ================= Slider ================= */}
                {waitingForSlides ? (
                    <div
                        aria-busy="true"
                        aria-label={t("common.loading")}
                        className="relative mt-6 h-[440px] overflow-hidden rounded-[28px] bg-gray-200 sm:h-[460px] lg:h-[520px]"
                    >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-hero-shimmer" />
                        <div className="relative flex h-full flex-col justify-end gap-4 px-6 pb-24 sm:justify-center sm:px-12 sm:pb-16 lg:px-20">
                            <div className="h-7 w-52 rounded-full bg-gray-300" />
                            <div className="h-10 w-4/5 max-w-xl rounded-xl bg-gray-300 lg:h-14" />
                            <div className="h-5 w-3/5 max-w-md rounded-lg bg-gray-300" />
                            <div className="mt-3 flex gap-3">
                                <div className="h-12 w-44 rounded-full bg-gray-300" />
                                <div className="h-12 w-36 rounded-full bg-gray-300" />
                            </div>
                        </div>
                    </div>
                ) : (
                <div
                    dir={i18n.dir()}
                    className="relative mt-6 h-[440px] overflow-hidden rounded-[28px] bg-green-950 shadow-[0_25px_70px_rgba(20,83,45,0.25)] sm:h-[460px] lg:h-[520px]"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Slides are stacked and cross-fade, so layout is identical for ltr and rtl. */}
                    {sliderItems.map((item, index) => {
                        const active = index === current;
                        return (
                            <div
                                key={item.id}
                                aria-hidden={!active}
                                className={`absolute inset-0 transition-opacity duration-1000 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
                            >
                                <img
                                    key={active ? `on-${current}` : "off"}
                                    src={item.image}
                                    alt={item.title || t("slider.slideAlt", { n: index + 1 })}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    className={`h-full w-full object-cover ${active ? "motion-safe:animate-hero-zoom" : ""}`}
                                />
                                {/* Readability: dark from the text side, plus a bottom fade for phones. */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/5 rtl:bg-gradient-to-l" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            </div>
                        );
                    })}

                    {/* Text of the active slide; the key re-runs the entrance animation on every change. */}
                    <div className="relative z-10 flex h-full items-end px-6 pb-24 pt-10 sm:items-center sm:px-12 sm:pb-16 lg:px-20">
                        <div key={current} className="max-w-2xl text-white">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-green-100 backdrop-blur-md motion-safe:animate-hero-rise sm:text-sm">
                                <BiLeaf className="text-green-300" />
                                {t("slider.badge")}
                            </span>
                            {sliderItems[current].title && (
                                <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight drop-shadow-lg motion-safe:animate-hero-rise [animation-delay:120ms] sm:text-4xl lg:text-5xl xl:text-6xl">
                                    {sliderItems[current].title}
                                </h2>
                            )}
                            {sliderItems[current].subtitle && (
                                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 drop-shadow motion-safe:animate-hero-rise [animation-delay:240ms] sm:text-lg">
                                    {sliderItems[current].subtitle}
                                </p>
                            )}
                            <div className="mt-7 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise [animation-delay:360ms]">
                                <a
                                    href={sliderItems[current].cta_link || "/all"}
                                    className="group inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base"
                                >
                                    {sliderItems[current].cta_text || t("slider.ShowAllproduct")}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                                </a>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base"
                                >
                                    <Phone size={18} />
                                    {t("slider.contactUs")}
                                </a>
                            </div>
                        </div>
                    </div>

                    {count > 1 && (
                        <div className="absolute inset-x-6 bottom-6 z-20 flex items-center justify-between gap-4 sm:inset-x-12 lg:inset-x-20">
                            {/* Progress bars: the active one fills over SLIDE_MS, then moves on (pauses on hover). */}
                            <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
                                {sliderItems.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => goTo(index)}
                                        aria-label={t("slider.goToSlide", { n: index + 1 })}
                                        aria-current={index === current}
                                        className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/30"
                                    >
                                        <span
                                            key={index === current ? `run-${current}` : "idle"}
                                            onAnimationEnd={index === current ? next : undefined}
                                            style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                                            className={`absolute inset-0 rounded-full bg-white ltr:origin-left rtl:origin-right ${index === current
                                                ? "animate-hero-progress"
                                                : index < current ? "" : "scale-x-0"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={t("slider.previousSlide")}
                                    onClick={prev}
                                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-green-800"
                                >
                                    <ArrowLeft size={20} className="rtl:-scale-x-100" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={t("slider.nextSlide")}
                                    onClick={next}
                                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-green-800"
                                >
                                    <ArrowRight size={20} className="rtl:-scale-x-100" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}

                {/* ================= Features ================= */}
                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                    {waitingForFeatures ? (
                        FALLBACK_ICONS.map((_, i) => (
                            <div key={i} aria-hidden="true" className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm motion-safe:animate-pulse">
                                <div className="mx-auto h-16 w-16 rounded-xl bg-green-100" />
                                <div className="mx-auto mt-4 h-5 w-3/4 rounded bg-green-100" />
                                <div className="mx-auto mt-3 h-3 w-full rounded bg-slate-100" />
                                <div className="mx-auto mt-2 h-3 w-5/6 rounded bg-slate-100" />
                            </div>
                        ))
                    ) : features && features.length > 0 ? (
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
