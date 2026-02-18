"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

type Metrics = {
  totals: { jobs90d: number; employers: number; regions: number };
  dailyJobs: [string, number][];
  areas: [string, number][];
  topEmployers: [string, number][];
  employmentType: [string, number][];
  regions: [string, number][];
  topOccupations: [string, number][];
  weekday: [string, number][];
  positionsBucket: [string, number][];
};

export default function Home() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/metrics");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        setData(json);
      } catch (e: any) {
        setError(e.message || "Failed to load");
      }
    };
    load();
  }, []);

  const charts = useMemo(() => {
    if (!data) return null;

    const css = (name: string, fallback: string) => {
      if (typeof window === "undefined") return fallback;
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v || fallback;
    };

    const colors = {
      text: css("--foreground", "#111827"),
      mutedText: css("--muted-foreground", "#6b7280"),
      border: css("--border", "#e5e7eb"),
      c1: css("--chart-1", "#f59e0b"),
      c2: css("--chart-2", "#0ea5e9"),
      c3: css("--chart-3", "#6366f1"),
      c4: css("--chart-4", "#22c55e"),
      c5: css("--chart-5", "#a855f7"),
    };

    const axisCommon = {
      axisLine: { lineStyle: { color: colors.border } },
      axisTick: { show: false },
      axisLabel: { color: colors.mutedText },
      splitLine: { lineStyle: { color: colors.border } },
    };

    const line = {
      color: [colors.c3],
      tooltip: {
        trigger: "axis",
        borderColor: colors.border,
        textStyle: { color: colors.text },
      },
      grid: { left: 40, right: 24, top: 20, bottom: 40 },
      xAxis: {
        type: "category",
        data: data.dailyJobs.map((d) => d[0]),
        axisLabel: { color: colors.mutedText },
        axisLine: { lineStyle: { color: colors.border } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: colors.mutedText },
        splitLine: { lineStyle: { color: colors.border } },
      },
      series: [
        {
          type: "line",
          data: data.dailyJobs.map((d) => d[1]),
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.06 },
        },
      ],
    };

    const bar = (rows: [string, number][], color = colors.c4) => ({
      color: [color],
      tooltip: {
        trigger: "item",
        borderColor: colors.border,
        textStyle: { color: colors.text },
      },
      grid: { left: 140, right: 24, top: 12, bottom: 12 },
      xAxis: {
        type: "value",
        ...axisCommon,
        splitLine: { lineStyle: { color: colors.border } },
      },
      yAxis: {
        type: "category",
        data: rows.map((r) => r[0]),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: colors.mutedText },
      },
      series: [
        {
          type: "bar",
          data: rows.map((r) => r[1]),
          barWidth: 14,
          itemStyle: { borderRadius: [6, 6, 6, 6] },
        },
      ],
    });

    const pie = (rows: [string, number][]) => ({
      color: [colors.c4, colors.c2, colors.c1, colors.c5, colors.c3],
      tooltip: {
        trigger: "item",
        borderColor: colors.border,
        textStyle: { color: colors.text },
      },
      legend: {
        bottom: 0,
        textStyle: { color: colors.mutedText },
      },
      series: [
        {
          type: "pie",
          radius: ["35%", "70%"],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: "transparent", borderWidth: 2 },
          label: { color: colors.mutedText },
          data: rows.map((r) => ({ name: r[0], value: r[1] })),
        },
      ],
    });

    const bars = {
      areas: bar(data.areas, colors.c4),
      employers: bar(data.topEmployers, colors.c1),
      regions: bar(data.regions, colors.c2),
      occupations: bar(data.topOccupations, colors.c5),
      weekday: bar(data.weekday, colors.c3),
      positions: bar(data.positionsBucket, colors.c2),
    };

    return { line, pie: pie(data.employmentType), ...bars };
  }, [data]);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Jobbkollen‑iso</Badge>
            <Badge className="bg-emerald-600 text-white">Live</Badge>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Swedish Job Market Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last 90 days · Data/IT occupation areas · Powered by Supabase
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!data && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-[108px] animate-pulse rounded-xl border bg-card" />
            <div className="h-[108px] animate-pulse rounded-xl border bg-card" />
            <div className="h-[108px] animate-pulse rounded-xl border bg-card" />
          </div>
        )}

        {data && charts && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Total jobs (90d)"
                value={data.totals.jobs90d.toLocaleString()}
              />
              <StatCard
                title="Employers"
                value={data.totals.employers.toLocaleString()}
              />
              <StatCard
                title="Regions"
                value={data.totals.regions.toLocaleString()}
              />
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Daily job postings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.line} style={{ height: 320 }} />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Employment type split</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.pie} style={{ height: 320 }} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Jobs by occupation area</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.areas} style={{ height: 360 }} />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Top employers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.employers} style={{ height: 360 }} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Top regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.regions} style={{ height: 360 }} />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Top occupations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.occupations} style={{ height: 360 }} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Jobs by weekday</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.weekday} style={{ height: 300 }} />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Positions per job</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.positions} style={{ height: 300 }} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-muted-foreground">
          <div>Jobbkollen Dashboard</div>
          <div>Data source: Supabase / Platsbanken</div>
        </div>
      </footer>
    </div>
  );
}
