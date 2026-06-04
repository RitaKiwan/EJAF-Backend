"use client";

import { useState } from "react";
import { sendContact } from "@/lib/admin-api";
import { useSearchParams } from "next/navigation"; // 🌟 استيراد لاستكشاف اللغة

type ContactFormProps = {
  namePlaceholder?: string;
  emailPlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  isAr?: boolean; // 🌟 إضافة اختياري لتحديد اللغة
};

export function ContactForm({
  namePlaceholder = "Your name",
  emailPlaceholder = "Email address",
  subjectPlaceholder = "Subject",
  messagePlaceholder = "Tell us about your project",
  submitLabel = "Send message",
  isAr: isArProp, // استقبال اللغة
}: ContactFormProps) {
  const searchParams = useSearchParams();
  // تحديد اللغة: إما من الـ props أو من الـ searchParams
  const isAr = isArProp ?? searchParams.get("lang") === "ar";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 🌟 قاموس الرسائل للتبديل بين اللغتين
  const messages = {
    success: isAr
      ? "✓ تم إرسال رسالتك بنجاح!"
      : "✓ Your message sent successfully!",
    error: isAr
      ? "فشل الإرسال، يرجى المحاولة لاحقاً."
      : "Failed to send, please try again.",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      await sendContact(payload);
      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      setError(messages.error); // 🌟 استخدام الرسالة الديناميكية
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      dir={isAr ? "rtl" : "ltr"}
      className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_50px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-8 text-left"
    >
      {success && (
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {messages.success} 🌟 {/* 🌟 استخدام الرسالة الديناميكية */}
        </p>
      )}

      {error && (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          placeholder={namePlaceholder}
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          placeholder={emailPlaceholder}
        />
      </div>
      <input
        type="text"
        name="subject"
        required
        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
        placeholder={subjectPlaceholder}
      />
      <textarea
        name="message"
        rows={5}
        required
        className="min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
        placeholder={messagePlaceholder}
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? "..." : submitLabel}
      </button>
    </form>
  );
}
