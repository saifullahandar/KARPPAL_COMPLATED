import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BiMailSend } from 'react-icons/bi'
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

import { setStoredLanguage } from '../../i18n/languageStorage'


function Header() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);

        document.documentElement.dir =
            lang === "en" ? "ltr" : "rtl";

        document.documentElement.lang = lang;

        setStoredLanguage(lang);
    };


    const { t } = useTranslation()
    return (
        <>
            {/* Exactly h-10 on every screen: the nav below is fixed at top-10, so this bar
                must never wrap onto a second row (that row would hide behind the nav). */}
            <header className="fixed inset-x-0 top-0 z-50 bg-green-700 shadow-md">
                <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-2 px-3 text-white sm:px-4">
                    <div className="hidden items-center gap-4 md:flex">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold transition hover:bg-green-600/40"
                        >
                            <BiMailSend className="h-5 w-5" />
                            {t('email')}
                        </a>

                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold transition hover:bg-green-600/40"
                        >
                            <FaWhatsapp className="h-5 w-5" />
                            {t('phone')}
                        </a>
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-2 md:mx-auto">
                        {[
                            { label: 'Facebook', Icon: FaFacebook },
                            { label: 'Instagram', Icon: FaInstagram },
                            { label: 'LinkedIn', Icon: FaLinkedin },
                            { label: 'WhatsApp', Icon: FaWhatsapp },
                        ].map(({ label, Icon }) => (
                            <a
                                key={label}
                                href="/contact"
                                aria-label={label}
                                className="rounded-full p-1.5 transition hover:bg-white/15"
                            >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </a>
                        ))}
                    </div>

                    {/* One segmented switch for every screen size (replaces the old
                        phone-only <select>). */}
                    <div
                        role="group"
                        aria-label={t('header.selectLanguage')}
                        className="flex shrink-0 items-center gap-0.5 rounded-full bg-green-900/40 p-0.5 ring-1 ring-white/15"
                    >
                        <Globe aria-hidden="true" className="mx-1 hidden h-4 w-4 text-white/70 sm:block" />
                        {[
                            { code: 'fa', label: t('header.languageFa'), short: t('header.languageFa') },
                            { code: 'ps', label: t('header.languagePs'), short: t('header.languagePs') },
                            { code: 'en', label: t('header.languageEn'), short: 'EN' },
                        ].map((language) => {
                            const active = i18n.language === language.code;
                            return (
                                <button
                                    key={language.code}
                                    type="button"
                                    lang={language.code}
                                    aria-pressed={active}
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${active
                                        ? 'bg-white text-green-800 shadow-sm'
                                        : 'text-white/85 hover:bg-white/15 hover:text-white'
                                        }`}
                                    onClick={() => changeLanguage(language.code)}
                                >
                                    <span className="sm:hidden">{language.short}</span>
                                    <span className="hidden sm:inline">{language.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
