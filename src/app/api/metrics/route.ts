import { NextResponse } from "next/server";
import { getMetrics } from "@/lib/metrics";

export const revalidate = 60;

export async function GET() {
  try {
    const body = await getMetrics();
    const res = NextResponse.json(body);
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
