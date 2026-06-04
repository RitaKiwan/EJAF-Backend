import { AdminShell } from "@/components/admin-shell";
import { AdminBlogCrud } from "@/components/admin-blog-crud";
import { resolveLocale } from "@/lib/i18n";
import { blogRecords } from "@/data/blog";

type Props = { searchParams?: { lang?: string } };

export default function AdminBlogPage({ searchParams }: Props) {
  const locale = resolveLocale(searchParams?.lang);
  const isAr = locale === "ar";

  const initial = blogRecords.map((p) => ({
    id:         p.id,
    title_en:   p.title.en,
    title_ar:   p.title.ar,
    excerpt_en: p.excerpt.en,
    excerpt_ar: p.excerpt.ar,
    content_en: p.content.en,
    content_ar: p.content.ar,
    slug:       p.slug,
    image:      p.image,
    tags:       p.tags.join(", "),
    createdAt:  p.createdAt,
  }));

  return (
    <AdminShell
      title={isAr ? "المدونة" : "Blog"}
      description={isAr ? "كتابة وتحرير ونشر المقالات" : "Write, edit and publish articles"}
    >
      <AdminBlogCrud initial={initial} isAr={isAr} />
    </AdminShell>
  );
}