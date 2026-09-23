import { useTranslation } from "react-i18next"

import Lacience from "../../components/Home/Lacience"
import OurProduct from "../../components/Home/OurProduct"
import Slider from "../../components/Home/Slider"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"

function Home() {
    const { t, i18n } = useTranslation()
    useDocumentTitle(`${t("footer.company")} — ${t("footer.companyDescription")}`)
    return (
        <div dir={i18n.dir()}>

            {/* Visually hidden but present in the DOM: every page needs exactly one
                real top-level heading, and the homepage's hero slider has none (it's
                images/CTAs only), so this gives the page a meaningful, translated
                heading without changing the visual hero design. */}
            <h1 className="sr-only">{t("footer.company")} — {t("footer.companyDescription")}</h1>

            <Slider />
            <OurProduct />
            <Lacience />

        </div>
    )
}

export default Home
