import { Mail, Phone } from "lucide-react";
import { FaLocationDot } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function UpperFooter() {
    const { t, i18n } = useTranslation();

    return (
        <footer
            dir={i18n.dir()}
            className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.28),_transparent_28%),linear-gradient(135deg,#052e16_0%,#064e3b_30%,#0b3d2e_100%)] text-green-50"
        >
            <div className="absolute inset-0 opacity-70">
                <div className="absolute -left-12 top-10 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-400/10" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

                <div className="grid gap-2 border-b border-green-400/25 pb-8 md:grid-cols-2 lg:grid-cols-5 lg:pb-10">

                    {/* Map */}
                    <div className="group p-5 transition-all duration-300">
                        <a
                            href="https://maps.app.goo.gl/r1M2JF3MkEAL9h8M9"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                className="h-full w-full rounded-3xl object-cover"
                                src="/src/assets/images/Map.PNG"
                                alt={t("footer.mapAlt")}
                            />
                        </a>
                    </div>

                    {/* Contact */}
                    <div className="group p-5 transition-all duration-300">
                        <h3 className="mb-5 text-lg font-extrabold text-white">
                            {t("footer.contact")}
                        </h3>

                        <ul className="space-y-4 text-sm text-green-100/80">

                            <li className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600/20 text-green-300 ring-1 ring-green-400/40 transition group-hover:bg-green-600/30 group-hover:text-white">
                                    <FaLocationDot size={18} />
                                </div>

                                <span className="leading-7">
                                    {t("footer.address")}
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600/20 text-green-300 ring-1 ring-green-400/40 transition group-hover:bg-green-600/30 group-hover:text-white">
                                    <Mail size={18} />
                                </div>

                                <span dir="ltr">
                                    Kappal@admin.af
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600/20 text-green-300 ring-1 ring-green-400/40 transition group-hover:bg-green-600/30 group-hover:text-white">
                                    <Phone size={18} />
                                </div>

                                <span dir="ltr">
                                    +93 780 194 632
                                </span>
                            </li>

                        </ul>
                    </div>

                    {/* Services */}
                    <div className="group p-5 transition-all duration-300">
                        <h3 className="mb-5 text-lg font-extrabold text-white">
                            {t("footer.services")}
                        </h3>

                        <ul className="space-y-3 text-sm text-green-100/80">
                            <li>
                                <a href="#" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.service1")}
                                </a>
                            </li>

                            <li>
                                <a href="#" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.service2")}
                                </a>
                            </li>

                            <li>
                                <a href="#" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.service3")}
                                </a>
                            </li>

                            <li>
                                <a href="#" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.service4")}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Access */}
                    <div className="group p-5 transition-all duration-300">
                        <h3 className="mb-5 text-lg font-extrabold text-white">
                            {t("footer.quickAccess")}
                        </h3>

                        <ul className="space-y-3 text-sm text-green-100/80">

                            <li>
                                <a href="/" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.home")}
                                </a>
                            </li>

                            <li>
                                <a href="/about" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.about")}
                                </a>
                            </li>

                            <li>
                                <a href="/services" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.servicesLink")}
                                </a>
                            </li>

                            <li>
                                <a href="/products" className="inline-block rounded-full px-2.5 py-1.5 transition duration-200 hover:text-white">
                                    {t("footer.products")}
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Company */}
                    <div className="w-full rounded-3xl border border-green-500/40 bg-gradient-to-br from-green-700/70 via-green-800/80 to-emerald-950/90 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-green-300/70">

                        <div className="flex items-center justify-start gap-3">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-300 via-green-500 to-green-700 text-2xl font-black text-white shadow-[0_16px_30px_rgba(22,163,74,0.45)] ring-4 ring-green-200/10">
                                ک
                            </div>

                            <div>
                                <p className="text-2xl font-black tracking-wide text-white">
                                    {t("footer.company")}
                                </p>

                                <p className="text-sm text-green-100">
                                    {t("footer.companyDescription")}
                                </p>
                            </div>

                        </div>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-green-100/80">
                            {t("footer.description")}
                        </p>

                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col gap-4 pt-6 text-center text-sm text-green-100/80 sm:flex-row sm:items-center sm:justify-between">

                    <p className="font-medium">
                        {t("footer.copyright")} © 2026
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-5">

                        <a href="#" className="transition hover:text-white">
                            {t("footer.siteMap")}
                        </a>

                        <a href="#" className="transition hover:text-white">
                            {t("footer.terms")}
                        </a>

                        <a href="#" className="transition hover:text-white">
                            {t("footer.privacy")}
                        </a>

                    </div>

                </div>

            </div>
        </footer>
    );
}

export default UpperFooter;