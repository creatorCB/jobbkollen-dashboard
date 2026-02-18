import { AppShell } from "@/components/dashboard/AppShell";
import { PageToolbar } from "@/components/dashboard/PageToolbar";
import { OverviewClient } from "@/components/dashboard/OverviewClient";
import { getMetrics } from "@/lib/metrics";

export const revalidate = 60;

export default async function Home() {
  const data = await getMetrics();
  const updatedAt = new Date();

  return (
    <AppShell
      title="Overview"
      subtitle="Last 90 days · Data/IT occupation areas"
      toolbar={
        <PageToolbar
          updatedAt={updatedAt}
          chips={["Last 90 days", "Data/IT occupation areas", "Supabase source", "Public"]}
        />
      }
    >
      <OverviewClient data={data} />
    </AppShell>
  );
}
