import { ListCollapse, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FcDocument } from "react-icons/fc";
import { NavLink } from "react-router-dom";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Nav() {
    // FOR responsive
    const [open, setOpen] = useState(false);
    // FOR responsive
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();
    const navLinkClass =
        "relative inline-flex items-center py-1 font-medium text-gray-800 transition-colors duration-300 hover:text-green-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-green-700 after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100";

    const getNavLinkClass = (isActive: boolean, extraClass = "") =>
        `${navLinkClass} ${extraClass} ${isActive ? "text-green-700 after:scale-x-100" : ""}`;

    // Moves focus into the drawer when it opens, so keyboard/screen-reader users land
    // somewhere meaningful instead of on a now-hidden hamburger button.
    useEffect(() => {
        if (open) {
            menuRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
        }
    }, [open]);

    function closeMenu() {
        setOpen(false);
        toggleButtonRef.current?.focus();
    }

    function handleMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Escape") {
            e.preventDefault();
            closeMenu();
            return;
        }
        if (e.key !== "Tab" || !menuRef.current) return;

        const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    return (
        <div className="fixed z-50 top-10 left-0 right-0 bg-white shadow-sm">
            <div className="relative flex h-18 items-center justify-around px-4 sm:px-6 bg-white">
                {/* DOM order is logical reading order (logo, then links Home → Login), so the
                    browser's dir (ltr for English, rtl for Dari/Pashto) mirrors it correctly. */}
                <div className="mr-3 ml-3 w-13 sm:mx-10">
                    <img className="" src="/src/assets/logo_karppal.png" alt="Karppal" />
                </div>

                <nav
                    className="hidden items-center gap-7 text-[14px] lg:flex"
                    id="navbarNavDropdown"
                >
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.home")}
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.about")}
                    </NavLink>

                    <div className="relative">
                        <NavLink
                            to="/products"
                            className={({ isActive }) => getNavLinkClass(isActive, "flex items-center")}
                        >
                            {t("nav.products")}
                        </NavLink>
                    </div>

                    <NavLink
                        to="/services"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.services")}
                    </NavLink>
                    <NavLink
                        to="/control-quality"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.controlquality")}
                    </NavLink>
                    <NavLink
                        to="/gallery"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.gallery")}
                    </NavLink>
                    <NavLink
                        to="/research"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.research")}
                    </NavLink>
                    <NavLink
                        to="/export"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.export")}
                    </NavLink>
                    <NavLink
                        to="/jobs"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.jobchance")}
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        {t("nav.call")}
                    </NavLink>
                    <NavLink
                        type="button"
                        className="rounded-sm bg-green-700 px-4 py-1 text-zinc-50 hover:cursor-pointer hover:bg-green-600" to={"/login"}                    >
                        {t("nav.login")}
                        <FcDocument className="inline pl-1 pr-1" size={32} />
                    </NavLink>
                </nav>

                {open && (
                    <div
                        id="mobile-nav-menu"
                        ref={menuRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={t("header.menuToggle")}
                        onKeyDown={handleMenuKeyDown}
                        onClick={(e) => {
                            if ((e.target as HTMLElement).closest("a")) closeMenu();
                        }}
                        className="absolute end-0 top-full w-[85vw] max-w-[260px] rounded-lg bg-[#bfffb2] shadow-xl lg:hidden"
                    >
                        <nav className="flex flex-col space-y-4 px-6 py-4 text-center text-black">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.home")}
                            </NavLink>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.about")}
                            </NavLink>
                            <NavLink
                                to="/products"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.products")}
                            </NavLink>

                            <NavLink
                                to="/services"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.services")}
                            </NavLink>
                            <NavLink
                                to="/control-quality"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.controlquality")}
                            </NavLink>
                            <NavLink
                                to="/gallery"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.gallery")}
                            </NavLink>
                            <NavLink
                                to="/research"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.research")}
                            </NavLink>
                            <NavLink
                                to="/export"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.export")}
                            </NavLink>
                            <NavLink
                                to="/jobs"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.jobchance")}
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => getNavLinkClass(isActive, "justify-center transition-colors duration-300 hover:text-green-600")}
                            >
                                {t("nav.call")}
                            </NavLink>
                        </nav>
                    </div>
                )}

                <button
                    type="button"
                    ref={toggleButtonRef}
                    aria-label={t("header.menuToggle")}
                    aria-expanded={open}
                    aria-controls="mobile-nav-menu"
                    className="p-2 text-green-700 lg:hidden"
                    onClick={() => (open ? closeMenu() : setOpen(true))}
                >
                    {open ? <X size={28} /> : <ListCollapse size={28} />}
                </button>
            </div>
        </div>

    )
}

export default Nav;
