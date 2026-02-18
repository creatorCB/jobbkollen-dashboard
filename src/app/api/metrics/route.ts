import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PAGE_SIZE = 1000;

async function fetchAll<T>(table: string, select: string, filter: { col: string; op: "gte"; val: string }) {
  let from = 0;
  let all: T[] = [];
  while (true) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(select)
      .gte(filter.col, filter.val)
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data as T[]);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

export const revalidate = 60;

export async function GET() {
  try {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const [jobsFact, rawJobs, areas] = await Promise.all([
      fetchAll<any>(
        "v_jobs_fact",
        "published_at,company_name,workplace_name,employment_type,region_name,occupation_label_search,positions",
        { col: "published_at", op: "gte", val: since }
      ),
      fetchAll<any>(
        "raw_jobs",
        "published_date,occupation_area_id_source",
        { col: "published_date", op: "gte", val: since }
      ),
      supabaseAdmin.from("occupation_areas").select("area_id,area_name_sv")
    ]);

    if ((areas as any).error) throw (areas as any).error;
    const areasMap = new Map<string, string>();
    for (const a of (areas as any).data || []) {
      areasMap.set(a.area_id, a.area_name_sv);
    }

    const dailyJobs = new Map<string, number>();
    const topEmployers = new Map<string, number>();
    const employmentType = new Map<string, number>();
    const regions = new Map<string, number>();
    const topOccupations = new Map<string, number>();
    const weekday = new Map<string, number>();
    const positionsBucket = new Map<string, number>();

    for (const j of jobsFact) {
      const day = new Date(j.published_at).toISOString().slice(0, 10);
      dailyJobs.set(day, (dailyJobs.get(day) || 0) + 1);

      const employer = (j.company_name || j.workplace_name || "Unknown").trim();
      topEmployers.set(employer, (topEmployers.get(employer) || 0) + 1);

      const empType = (j.employment_type || "Unknown").trim();
      employmentType.set(empType, (employmentType.get(empType) || 0) + 1);

      const region = (j.region_name || "Unknown").trim();
      regions.set(region, (regions.get(region) || 0) + 1);

      const occ = (j.occupation_label_search || "Unknown").trim();
      topOccupations.set(occ, (topOccupations.get(occ) || 0) + 1);

      const wd = new Date(j.published_at).toLocaleDateString("en-US", { weekday: "short" });
      weekday.set(wd, (weekday.get(wd) || 0) + 1);

      const pos = j.positions as number | null;
      let bucket = "Unknown";
      if (typeof pos === "number") {
        if (pos === 1) bucket = "1";
        else if (pos >= 2 && pos <= 4) bucket = "2–4";
        else if (pos >= 5 && pos <= 9) bucket = "5–9";
        else bucket = "10+";
      }
      positionsBucket.set(bucket, (positionsBucket.get(bucket) || 0) + 1);
    }

    const areasCount = new Map<string, number>();
    for (const r of rawJobs) {
      const areaId = r.occupation_area_id_source;
      if (!areaId) continue;
      const name = areasMap.get(areaId) || areaId;
      areasCount.set(name, (areasCount.get(name) || 0) + 1);
    }

    const toSortedArray = (m: Map<string, number>, limit?: number) => {
      const arr = Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
      return limit ? arr.slice(0, limit) : arr;
    };

    const res = NextResponse.json({
      totals: {
        jobs90d: jobsFact.length,
        employers: topEmployers.size,
        regions: regions.size,
      },
      dailyJobs: Array.from(dailyJobs.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1)),
      areas: toSortedArray(areasCount),
      topEmployers: toSortedArray(topEmployers, 20),
      employmentType: toSortedArray(employmentType),
      regions: toSortedArray(regions, 25),
      topOccupations: toSortedArray(topOccupations, 30),
      weekday: Array.from(weekday.entries()),
      positionsBucket: toSortedArray(positionsBucket),
    });

    // Public dashboard: cache to protect Supabase + make UI snappy.
    // Vercel/Next will also honor revalidate above.
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
