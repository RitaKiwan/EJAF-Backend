import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/page-shell";
import { contactLocations, siteCopy } from "@/data/site";
import { resolveLocale, translate } from "@/lib/i18n";

type ContactPageProps = {
  searchParams?: {
    lang?: string;
  };
};

export default function ContactPage({ searchParams }: ContactPageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];

  return (
    <PageShell
      eyebrow={copy.page.contactTitle}
      title={copy.contact.title}
      description={copy.contact.description}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm
          namePlaceholder={copy.contact.namePlaceholder}
          emailPlaceholder={copy.contact.emailPlaceholder}
          subjectPlaceholder={copy.contact.subjectPlaceholder}
          messagePlaceholder={copy.contact.messagePlaceholder}
          submitLabel={copy.contact.submitLabel}
        />

        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-300 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{copy.contact.locationsTitle}</p>
          <div className="space-y-3">
            {contactLocations.map((location) => (
              <article key={location.title.en} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{translate(locale, location.eyebrow)}</p>
                <p className="mt-2 text-base font-medium text-white">{translate(locale, location.title)}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">{translate(locale, location.description)}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <p className="text-white">{copy.contact.phoneLabel}</p>
            <a href="tel:009647501914252" dir="ltr" className="mt-2 inline-block transition-colors hover:text-white">
              +964 (0)750-191-4252
            </a>
          </div>

          <Link href="https://goo.gl/maps/GSNXBQgQp22Whs8v6" className="inline-flex text-cyan-300 transition-colors hover:text-cyan-200">
            {copy.contact.mapLabel}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}