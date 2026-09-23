import { useTranslation } from 'react-i18next'
import { BiMailSend } from 'react-icons/bi'
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

import { setStoredLanguage } from '../../i18n/languageStorage'
import { NavLink } from 'react-router-dom';


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
            <header className="fixed inset-x-0 top-0 z-50 bg-green-700 shadow-md">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 pb-2 pt-1 text-white">
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

                    <div className="mx-auto flex items-center justify-center gap-4 text-center md:mx-0 md:ml-auto md:mr-auto">
                        <NavLink
                            type="button"
                            className="rounded-sm md:hidden items-center gap-4 flex bg-green-600 px-4 py-1 text-zinc-50 hover:cursor-pointer hover:bg-green-800" to={"/login"}                    >
                            {t("nav.login")}
                        </NavLink>
                        <a href="/contact" aria-label="Facebook" className="rounded-full p-1.5 transition hover:bg-green-600/40 hover:shadow-sm">
                            <FaFacebook className="h-5 w-5 text-white" />
                        </a>
                        <a href="/contact" aria-label="Instagram" className="rounded-full p-1.5 transition hover:bg-green-600/40 hover:shadow-sm">
                            <FaInstagram className="h-5 w-5 text-white" />
                        </a>
                        <a href="/contact" aria-label="LinkedIn" className="rounded-full p-1.5 transition hover:bg-green-600/40 hover:shadow-sm">
                            <FaLinkedin className="h-5 w-5 text-white" />
                        </a>
                        <a href="/contact" aria-label="WhatsApp" className="rounded-full p-1.5 transition hover:bg-green-600/40 hover:shadow-sm">
                            <FaWhatsapp className="h-5 w-5 text-white" />
                        </a>
                    </div>

                    <div className="hidden items-center gap-2 lg:flex">
                        {[
                            { code: 'fa', label: t('header.languageFa') },
                            { code: 'ps', label: t('header.languagePs') },
                            { code: 'en', label: t('header.languageEn') },
                        ].map((language) => (
                            <button
                                key={language.code}
                                type="button"
                                className={`rounded-lg px-2.5 py-1 text-sm font-medium transition ${i18n.language === language.code
                                    ? 'bg-green-600 shadow-sm ring-1 ring-white/50'
                                    : 'bg-green-800/60 hover:bg-green-600/70'
                                    }`}
                                onClick={() => changeLanguage(language.code)}
                            >
                                {language.label}
                            </button>
                        ))}
                    </div>

                    <select
                        aria-label={t('header.selectLanguage')}
                        className="ms-auto h-9 rounded-md border border-green-500 bg-green-800 px-2 text-sm text-white outline-none ring-0 transition focus:border-green-300 lg:hidden"
                        value={i18n.language}
                        onChange={(event) => changeLanguage(event.target.value)}
                    >
                        <option value="fa" className="bg-green-700 text-white">{t('header.languageFa')}</option>
                        <option value="ps" className="bg-green-700 text-white">{t('header.languagePs')}</option>
                        <option value="en" className="bg-green-700 text-white">{t('header.languageEn')}</option>
                    </select>
                </div>
            </header>
        </>
    )
}

export default Header
