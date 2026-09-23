import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function Login() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("login.title")} — ${t("footer.company")}`);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            await login({ email, password });
            navigate("/");
        } catch {
            setError(t("login.invalidCredentials"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-4 py-8" dir={i18n.dir()}>
            <div className="mt-25 max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
                <div className="grid w-full max-w-125">

                    <div className="flex items-center justify-center bg-white p-6 sm:p-10">
                        <div className="w-full max-w-md">
                            <div className="mb-8 text-center md:text-start">
                                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl font-black text-sky-700">
                                    K
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-800">{t("login.title")}</h1>
                                <p className="mt-2 text-sm text-slate-500">{t("login.subtitle")}</p>
                            </div>

                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                                        {t("login.emailLabel")}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("login.emailPlaceholder")}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-start text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                                        {t("login.passwordLabel")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t("login.passwordPlaceholder")}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 ps-12 text-start text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 start-3 flex items-center justify-center text-slate-500 transition hover:text-slate-700"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                                                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                    <path d="M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                                                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <label className="flex items-center gap-2 text-slate-600">
                                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                                        {t("login.rememberMe")}
                                    </label>

                                    <a href="#" className="font-medium text-sky-600 transition hover:text-sky-700">
                                        {t("login.forgotPassword")}
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-green-600 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? t("login.submitting") : t("login.submit")}
                                </button>

                                <div className="pt-2 text-center text-sm text-slate-600">
                                    {t("login.noAccount")}
                                    <a href="#" className="ms-1 font-semibold text-sky-600 hover:text-sky-700">
                                        {t("login.signUp")}
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
