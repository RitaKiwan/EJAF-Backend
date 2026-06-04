import { AdminShell } from "@/components/admin-shell";
import { AdminProjectsCrud } from "@/components/admin-projects-crud";
import { resolveLocale } from "@/lib/i18n";
import { projectRecords } from "@/data/projects";

type Props = { searchParams?: { lang?: string } };

export default function AdminProjectsPage({ searchParams }: Props) {
  const locale = resolveLocale(searchParams?.lang);
  const isAr   = locale === "ar";

  const initial = projectRecords.map((p) => ({
    id:             p.id,
    title_en:       p.title.en,
    title_ar:       p.title.ar,
    description_en: p.description.en,
    description_ar: p.description.ar,
    image:          p.image,
    technologies:   p.technologies.join(", "),
  }));

  return (
    <AdminShell
      title={isAr ? "المشاريع" : "Projects"}
      description={isAr ? "إدارة دراسات الحالة وصور الغلاف" : "Manage case studies and cover images"}
    >
      <AdminProjectsCrud initial={initial} isAr={isAr} />
    </AdminShell>
  );
}
