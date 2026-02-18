"use client";

import { useCallback, useEffect, useState } from "react";

export type Metrics = {
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

export function useMetrics() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/metrics", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setData(json);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, error, loading, lastUpdated, refresh };
}
