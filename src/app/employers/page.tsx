"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetrics } from "@/lib/useMetrics";
import { AppShell } from "@/components/dashboard/AppShell";
import { RefreshToolbar } from "@/components/dashboard/RefreshToolbar";
import { FilterChips } from "@/components/dashboard/FilterChips";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { Chart, useChartOptions } from "@/components/dashboard/Charts";

export default function EmployersPage() {
  const { data, error, loading, lastUpdated, refresh } = useMetrics();
  const charts = useChartOptions(data);

  return (
    <AppShell
      title="Employers"
      subtitle="Top employers by job postings (last 90 days)"
      toolbar={
        <>
          <FilterChips />
          <RefreshToolbar
            lastUpdated={lastUpdated}
            loading={loading}
            onRefresh={refresh}
          />
        </>
      }
    >
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!data && loading && <div className="h-[420px] animate-pulse rounded-xl border bg-card" />}

      {data && charts && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top employers</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart option={charts.barEmployers} height={520} />
            </CardContent>
          </Card>

          <SimpleTable title="Top employers" rows={data.topEmployers} valueLabel="Jobs" limit={20} />
        </div>
      )}
    </AppShell>
  );
}
