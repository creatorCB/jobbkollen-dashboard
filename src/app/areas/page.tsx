import { AppShell } from "@/components/dashboard/AppShell";
import { BarPageClient } from "@/components/dashboard/BarPageClient";
import { PageToolbar } from "@/components/dashboard/PageToolbar";
import { getMetrics } from "@/lib/metrics";

export const revalidate = 60;

export default async function AreasPage() {
  const data = await getMetrics();

  return (
    <AppShell
      title="Areas"
      subtitle="Occupation areas (21) by job postings (last 90 days)"
      toolbar={
        <PageToolbar
          updatedAt={new Date()}
          chips={["Last 90 days", "21 occupation areas", "Supabase source", "Public"]}
        />
      }
    >
      <BarPageClient data={data} kind="areas" title="Occupation areas" />
    </AppShell>
  );
}
