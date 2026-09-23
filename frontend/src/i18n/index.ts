import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fa from "../locales/fa.json";
import ps from "../locales/ps.json";
import en from "../locales/en.json";
import { getStoredLanguage } from "./languageStorage";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: {
        translation: fa,
      },
      ps: {
        translation: ps,
      },
      en: {
        translation: en,
      },
    },

    // Restores the language the user last selected (persisted to localStorage
    // by Header.tsx's changeLanguage()), falling back to Pashto for first-time
    // visitors — without this, every page refresh/new tab reset the language
    // back to the default regardless of what the user had picked.
    lng: getStoredLanguage(),
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

// Keep <html dir>/<html lang> in sync with the active language on first load —
// without this, the default "ps" (Pashto, RTL) language renders the initial
// page as LTR until the user manually switches languages via the header.
document.documentElement.dir = i18n.dir(i18n.language);
document.documentElement.lang = i18n.language;

export default i18n;