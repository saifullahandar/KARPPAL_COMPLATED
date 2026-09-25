import { ChevronRight, LogIn, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo_karppal.png";
import { DASHBOARD_URL } from "../../services/apiClient";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// One list for the desktop bar and the mobile menu, so the two can never drift apart.
const NAV_LINKS = [
    { to: "/", key: "nav.home", end: true },
    { to: "/about", key: "nav.about" },
    { to: "/products", key: "nav.products" },
    { to: "/services", key: "nav.services" },
    { to: "/gallery", key: "nav.gallery" },
    { to: "/research", key: "nav.research" },
    { to: "/export", key: "nav.export" },
    { to: "/jobs", key: "nav.jobchance" },
    { to: "/contact", key: "nav.call" },
];

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

    const getMobileLinkClass = (isActive: boolean) =>
        `group flex items-center justify-between rounded-xl px-4 py-3 font-medium transition-colors ${isActive
            ? "bg-green-50 text-green-700"
            : "text-gray-800 hover:bg-gray-50 hover:text-green-700"
        }`;

    // Moves focus into the drawer when it opens, so keyboard/screen-reader users land
    // somewhere meaningful instead of on a now-hidden hamburger button.
    useEffect(() => {
        if (open) {
            menuRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
        }
    }, [open]);

    // The page behind the open menu must not scroll along with it.
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
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
            {/* Phones/tablets: logo at the start edge, menu button at the end edge.
                Desktop (xl+, where all links fit on one line) keeps the spread-out bar. */}
            <div className="relative flex h-18 items-center justify-between px-4 sm:px-6 xl:justify-around bg-white">
                {/* DOM order is logical reading order (logo, then links Home → Login), so the
                    browser's dir (ltr for English, rtl for Dari/Pashto) mirrors it correctly. */}
                <NavLink to="/" end className="flex shrink-0 items-center gap-2.5 xl:mx-10">
                    <img src={logo} alt="" className="w-13" />
                    <span className="text-xl font-extrabold tracking-tight text-green-800">
                        {t("footer.company")}
                    </span>
                </NavLink>

                <nav
                    className="hidden items-center gap-7 whitespace-nowrap text-[14px] xl:flex"
                    id="navbarNavDropdown"
                >
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            {t(link.key)}
                        </NavLink>
                    ))}
                    <a
                        className="group inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md"
                        href={DASHBOARD_URL}
                    >
                        {t("nav.login")}
                        {/* Arrow points into the page: mirrored for rtl (Dari/Pashto). */}
                        <LogIn
                            size={18}
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                    </a>
                </nav>

                <button
                    type="button"
                    ref={toggleButtonRef}
                    aria-label={t("header.menuToggle")}
                    aria-expanded={open}
                    aria-controls="mobile-nav-menu"
                    className={`rounded-xl p-2 transition-colors xl:hidden ${open
                        ? "bg-green-700 text-white"
                        : "text-green-700 ring-1 ring-green-200 hover:bg-green-50"
                        }`}
                    onClick={() => (open ? closeMenu() : setOpen(true))}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>

                {open && (
                    <>
                        {/* Dims the page below the header + nav (h-10 + h-18 = 7rem); a tap closes the menu. */}
                        <div
                            aria-hidden="true"
                            className="fixed inset-x-0 bottom-0 top-28 bg-black/40 xl:hidden"
                            onClick={closeMenu}
                        />
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
                            className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-b-2xl border-t border-green-100 bg-white shadow-xl xl:hidden"
                        >
                            <nav className="flex flex-col gap-1 p-3">
                                {NAV_LINKS.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.end}
                                        className={({ isActive }) => getMobileLinkClass(isActive)}
                                    >
                                        {t(link.key)}
                                        <ChevronRight
                                            size={18}
                                            aria-hidden="true"
                                            className="text-gray-300 transition group-hover:text-green-600 rtl:-scale-x-100"
                                        />
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="border-t border-gray-100 p-3">
                                <a
                                    href={DASHBOARD_URL}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800"
                                >
                                    {t("nav.login")}
                                    <LogIn size={18} aria-hidden="true" className="rtl:-scale-x-100" />
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

    )
}

export default Nav;
