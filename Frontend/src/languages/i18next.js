import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-xhr-backend";
import i18n from "i18next";

const Languages = ["en", "vi"];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    debug: false, //trigger this to show i18next message
    whitelist: Languages,
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
