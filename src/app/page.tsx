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

    const line = {
      xAxis: { type: "category", data: data.dailyJobs.map((d) => d[0]) },
      yAxis: { type: "value" },
      series: [{ type: "line", data: data.dailyJobs.map((d) => d[1]), smooth: true }],
      tooltip: { trigger: "axis" },
    };

    const bar = (rows: [string, number][], color = "#6366f1") => ({
      xAxis: { type: "value" },
      yAxis: { type: "category", data: rows.map((r) => r[0]) },
      series: [{ type: "bar", data: rows.map((r) => r[1]), itemStyle: { color } }],
      tooltip: { trigger: "item" },
      grid: { left: 120, right: 24, top: 16, bottom: 16 },
    });

    const pie = (rows: [string, number][]) => ({
      series: [
        {
          type: "pie",
          radius: ["35%", "70%"],
          data: rows.map((r) => ({ name: r[0], value: r[1] })),
        },
      ],
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
    });

    const bars = {
      areas: bar(data.areas, "#22c55e"),
      employers: bar(data.topEmployers, "#f59e0b"),
      regions: bar(data.regions, "#0ea5e9"),
      occupations: bar(data.topOccupations, "#a855f7"),
      weekday: bar(data.weekday, "#ef4444"),
      positions: bar(data.positionsBucket, "#14b8a6"),
    };

    return { line, pie: pie(data.employmentType), ...bars };
  }, [data]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-3">
          <Badge className="bg-zinc-800 text-zinc-200">Jobbkollen‑iso</Badge>
          <Badge className="bg-emerald-600 text-white">Live</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Swedish Job Market — Crazy Dashboard</h1>
        <p className="mt-2 text-zinc-400">Last 90 days · Data/IT + full spectrum · Powered by Supabase</p>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16">
        {error && (
          <div className="mb-6 rounded-lg bg-red-900/40 p-4 text-red-200">{error}</div>
        )}

        {!data && !error && (
          <div className="mb-6 rounded-lg bg-zinc-900 p-4 text-zinc-300">Loading dashboard…</div>
        )}

        {data && charts && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Total Jobs (90d)</CardTitle>
                </CardHeader>
                <CardContent className="text-4xl font-bold">{data.totals.jobs90d.toLocaleString()}</CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Employers</CardTitle>
                </CardHeader>
                <CardContent className="text-4xl font-bold">{data.totals.employers.toLocaleString()}</CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Regions</CardTitle>
                </CardHeader>
                <CardContent className="text-4xl font-bold">{data.totals.regions.toLocaleString()}</CardContent>
              </Card>
            </div>

            <Separator className="my-8 bg-zinc-800" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Daily Job Postings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.line} style={{ height: 320 }} />
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Employment Type Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.pie} style={{ height: 320 }} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Jobs by Occupation Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.areas} style={{ height: 360 }} />
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Top Employers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.employers} style={{ height: 360 }} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Top Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.regions} style={{ height: 360 }} />
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Top Occupations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.occupations} style={{ height: 360 }} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Jobs by Weekday</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.weekday} style={{ height: 300 }} />
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Positions per Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={charts.positions} style={{ height: 300 }} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
