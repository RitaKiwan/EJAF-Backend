import { AdminShell } from "@/components/admin-shell";
import { AdminServicesCrud } from "@/components/admin-services-crud";
import { resolveLocale } from "@/lib/i18n";
import { serviceRecords } from "@/data/services";

type Props = { searchParams?: { lang?: string } };

export default function AdminServicesPage({ searchParams }: Props) {
  const locale = resolveLocale(searchParams?.lang);
  const isAr   = locale === "ar";

  const initial = serviceRecords.map((s) => ({
    id:             s.id,
    title_en:       s.title.en,
    title_ar:       s.title.ar,
    description_en: s.description.en,
    description_ar: s.description.ar,
    icon:           s.icon,
    gif:            s.gif ?? "",
  }));

  return (
    <AdminShell
      title={isAr ? "الخدمات" : "Services"}
      description={isAr ? "إنشاء وتعديل وحذف سجلات الخدمات" : "Create, edit and delete service records"}
    >
      <AdminServicesCrud initial={initial} isAr={isAr} />
    </AdminShell>
  );
}
