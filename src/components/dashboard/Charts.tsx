"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { Metrics } from "@/lib/useMetrics";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function useChartOptions(data: Metrics | null) {
  return useMemo(() => {
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
      grid: { left: 160, right: 24, top: 12, bottom: 12 },
      xAxis: {
        type: "value",
        ...axisCommon,
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

    return {
      line,
      pie: pie(data.employmentType),
      barAreas: bar(data.areas, colors.c4),
      barEmployers: bar(data.topEmployers, colors.c1),
      barRegions: bar(data.regions, colors.c2),
      barOccupations: bar(data.topOccupations, colors.c5),
    };
  }, [data]);
}

export function Chart({ option, height }: { option: any; height: number }) {
  return <ReactECharts option={option} style={{ height }} />;
}
