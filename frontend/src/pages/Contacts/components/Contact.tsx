import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaWhatsapp,
} from "react-icons/fa";
import { submitContactMessage } from "../../../services/contact";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

function Contact() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("contact.hero.title")} — ${t("footer.company")}`);

    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");
        try {
            await submitContactMessage(form);
            setStatus("success");
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch {
            setStatus("error");
            setErrorMessage(t("contact.form.errorGeneric"));
        }
    };

    return (
        <div
            dir={i18n.language === "en" ? "ltr" : "rtl"}
            lang={i18n.language}
            className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 text-slate-800"
        >
            {/* ================= HERO ================= */}
            <section className="relative mt-15 overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-4 py-20 text-white sm:px-6 lg:px-8">

                <div className="absolute inset-0">
                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                </div>

                <div className="relative mx-auto max-w-6xl text-center">

                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-sm">
                        {t("contact.hero.badge")}
                    </span>

                    <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
                        {t("contact.hero.title")}
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-green-50 sm:text-lg">
                        {t("contact.hero.description")}
                    </p>

                </div>
            </section>

            {/* ================= MAIN ================= */}
            <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

                <div className="grid gap-8 lg:grid-cols-5">

                    {/* ================= CONTACT INFO ================= */}
                    <div className="lg:col-span-2">

                        <div className="h-full rounded-[32px] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-7 text-white shadow-[0_25px_60px_rgba(22,163,74,0.25)] sm:p-9">

                            <h2 className="text-3xl font-black">
                                {t("contact.info.title")}
                            </h2>

                            <p className="mt-3 leading-8 text-green-50">
                                {t("contact.info.description")}
                            </p>

                            <div className="mt-10 space-y-5">

                                {/* Address */}
                                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-600">
                                        <MapPin size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold">
                                            {t("contact.info.address.title")}
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-green-50">
                                            {t("contact.info.address.text")}
                                        </p>
                                    </div>

                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-600">
                                        <Mail size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold">
                                            {t("contact.info.email.title")}
                                        </h3>

                                        <p className="mt-1 text-sm text-green-50">
                                            info@karppal.af
                                        </p>
                                    </div>

                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-600">
                                        <Phone size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold">
                                            {t("contact.info.phone.title")}
                                        </h3>

                                        <p className="mt-1 text-sm text-green-50">
                                            +93 780 194 632
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Social */}
                            <div className="mt-10 border-t border-white/20 pt-7">

                                <h3 className="font-bold">
                                    {t("contact.info.social")}
                                </h3>

                                <div className="mt-4 flex gap-3">

                                    <a
                                        href="https://www.facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-600"
                                    >
                                        <FaFacebook size={20} />
                                    </a>

                                    <a
                                        href="https://www.instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-600"
                                    >
                                        <FaInstagram size={20} />
                                    </a>

                                    <a
                                        href="https://www.linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-600"
                                    >
                                        <FaLinkedin size={20} />
                                    </a>

                                    <a
                                        href="https://www.whatsapp.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-600"
                                    >
                                        <FaWhatsapp size={20} />
                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ================= FORM ================= */}
                    <div className="lg:col-span-3">

                        <div className="rounded-[32px] border border-green-100 bg-white p-6 shadow-[0_20px_60px_rgba(22,163,74,0.10)] sm:p-9">

                            <div className="mb-8">

                                <span className="text-sm font-bold text-green-600">
                                    {t("contact.form.badge")}
                                </span>

                                <h2 className="mt-2 text-3xl font-black text-slate-900">
                                    {t("contact.form.title")}
                                </h2>

                                <p className="mt-3 leading-7 text-slate-500">
                                    {t("contact.form.description")}
                                </p>

                            </div>

                            {status === "success" && (
                                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                                    {t("contact.form.successMessage")}
                                </div>
                            )}
                            {status === "error" && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>

                                {/* Name + Phone */}
                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>
                                        <label htmlFor="contact-name" className="mb-2 block text-sm font-bold text-slate-700">
                                            {t("contact.form.name")}
                                        </label>

                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={handleChange("name")}
                                            placeholder={t("contact.form.namePlaceholder")}
                                            className="w-full rounded-xl border border-green-100 bg-green-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contact-phone" className="mb-2 block text-sm font-bold text-slate-700">
                                            {t("contact.form.phone")}
                                        </label>

                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange("phone")}
                                            placeholder={t("contact.form.phonePlaceholder")}
                                            className="w-full rounded-xl border border-green-100 bg-green-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                        />
                                    </div>

                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="contact-email" className="mb-2 block text-sm font-bold text-slate-700">
                                        {t("contact.form.email")}
                                    </label>

                                    <input
                                        id="contact-email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange("email")}
                                        placeholder={t("contact.form.emailPlaceholder")}
                                        className="w-full rounded-xl border border-green-100 bg-green-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="contact-subject" className="mb-2 block text-sm font-bold text-slate-700">
                                        {t("contact.form.subject")}
                                    </label>

                                    <input
                                        id="contact-subject"
                                        type="text"
                                        value={form.subject}
                                        onChange={handleChange("subject")}
                                        placeholder={t("contact.form.subjectPlaceholder")}
                                        className="w-full rounded-xl border border-green-100 bg-green-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="contact-message" className="mb-2 block text-sm font-bold text-slate-700">
                                        {t("contact.form.message")}
                                    </label>

                                    <textarea
                                        id="contact-message"
                                        rows={6}
                                        required
                                        value={form.message}
                                        onChange={handleChange("message")}
                                        placeholder={t("contact.form.messagePlaceholder")}
                                        className="w-full resize-none rounded-xl border border-green-100 bg-green-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-bold text-white shadow-[0_15px_35px_rgba(22,163,74,0.25)] transition duration-300 hover:-translate-y-1 hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Send size={19} />
                                    {status === "submitting" ? t("contact.form.sending") : t("contact.form.submit")}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

                {/* ================= MAP ================= */}
                <div className="mt-10 overflow-hidden rounded-[32px] border border-green-100 bg-white p-3 shadow-[0_20px_60px_rgba(22,163,74,0.10)] sm:p-4">

                    <div className="relative h-[300px] overflow-hidden rounded-[25px] bg-green-100 sm:h-[400px]">
                        
                        <img
                            src="/src/assets/images/Map.PNG"
                            alt={t("contact.map.alt")}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-end pb-3 justify-center bg-green-900/10">

                            <a
                                href="https://maps.app.goo.gl/r1M2JF3MkEAL9h8M9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex opacity-70 items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-500 hover:opacity-100"
                            >
                                <MapPin size={20} />
                                {t("contact.map.button")}
                            </a>

                        </div>

                    </div>

                </div>

            </section>
        </div>
    );
}

export default Contact;