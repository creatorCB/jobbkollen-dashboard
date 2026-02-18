import { AppShell } from "@/components/dashboard/AppShell";
import { BarPageClient } from "@/components/dashboard/BarPageClient";
import { PageToolbar } from "@/components/dashboard/PageToolbar";
import { getMetrics } from "@/lib/metrics";

export const revalidate = 60;

export default async function OccupationsPage() {
  const data = await getMetrics();

  return (
    <AppShell
      title="Occupations"
      subtitle="Top occupations by job postings (last 90 days)"
      toolbar={
        <PageToolbar
          updatedAt={new Date()}
          chips={["Last 90 days", "Occupations", "Supabase source", "Public"]}
        />
      }
    >
      <BarPageClient data={data} kind="occupations" title="Top occupations" />
    </AppShell>
  );
}
