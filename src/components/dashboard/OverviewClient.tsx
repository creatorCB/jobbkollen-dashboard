"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Chart, useChartOptions } from "@/components/dashboard/Charts";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import type { Metrics } from "@/lib/metrics";

export function OverviewClient({ data }: { data: Metrics }) {
  const charts = useChartOptions(data);

  const StatCard = ({ title, value }: { title: string; value: string }) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-semibold tracking-tight">
        {value}
      </CardContent>
    </Card>
  );

  if (!charts) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total jobs (90d)" value={data.totals.jobs90d.toLocaleString()} />
        <StatCard title="Employers" value={data.totals.employers.toLocaleString()} />
        <StatCard title="Regions" value={data.totals.regions.toLocaleString()} />
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Daily job postings</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.line} height={320} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Employment type split</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.pie} height={320} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Jobs by occupation area</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.barAreas} height={360} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top employers</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.barEmployers} height={360} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top regions</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.barRegions} height={360} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top occupations</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.barOccupations} height={360} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleTable title="Top employers" rows={data.topEmployers} valueLabel="Jobs" limit={20} />
        <SimpleTable title="Top occupations" rows={data.topOccupations} valueLabel="Jobs" limit={20} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleTable title="Top regions" rows={data.regions} valueLabel="Jobs" limit={20} />
        <SimpleTable title="Occupation areas" rows={data.areas} valueLabel="Jobs" limit={21} />
      </div>
    </>
  );
}
