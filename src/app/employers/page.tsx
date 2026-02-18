import { AppShell } from "@/components/dashboard/AppShell";
import { BarPageClient } from "@/components/dashboard/BarPageClient";
import { PageToolbar } from "@/components/dashboard/PageToolbar";
import { getMetrics } from "@/lib/metrics";

export const revalidate = 60;

export default async function EmployersPage() {
  const data = await getMetrics();

  return (
    <AppShell
      title="Employers"
      subtitle="Top employers by job postings (last 90 days)"
      toolbar={
        <PageToolbar
          updatedAt={new Date()}
          chips={["Last 90 days", "Employers", "Supabase source", "Public"]}
        />
      }
    >
      <BarPageClient data={data} kind="employers" title="Top employers" />
    </AppShell>
  );
}
