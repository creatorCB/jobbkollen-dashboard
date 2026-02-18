import { AppShell } from "@/components/dashboard/AppShell";
import { BarPageClient } from "@/components/dashboard/BarPageClient";
import { PageToolbar } from "@/components/dashboard/PageToolbar";
import { getMetrics } from "@/lib/metrics";

export const revalidate = 60;

export default async function RegionsPage() {
  const data = await getMetrics();

  return (
    <AppShell
      title="Regions"
      subtitle="Top regions by job postings (last 90 days)"
      toolbar={
        <PageToolbar
          updatedAt={new Date()}
          chips={["Last 90 days", "Regions", "Supabase source", "Public"]}
        />
      }
    >
      <BarPageClient data={data} kind="regions" title="Top regions" />
    </AppShell>
  );
}
