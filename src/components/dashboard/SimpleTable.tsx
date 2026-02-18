"use client";

import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function toCsv(rows: [string, number][], valueLabel: string) {
  const esc = (s: string) => `"${String(s).replaceAll('"', '""')}"`;
  const lines = [
    ["Name", valueLabel].map(esc).join(","),
    ...rows.map(([name, v]) => [name ?? "", String(v)].map(esc).join(",")),
  ];
  return lines.join("\n");
}

export function SimpleTable({
  title,
  rows,
  valueLabel = "Jobs",
  limit = 15,
}: {
  title: string;
  rows: [string, number][];
  valueLabel?: string;
  limit?: number;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(([name]) => (name || "").toLowerCase().includes(needle));
  }, [rows, q]);

  const top = filtered.slice(0, limit);

  const download = () => {
    const csv = toCsv(filtered, valueLabel);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replaceAll(/\s+/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="text-sm font-medium">{title}</div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="h-9 w-[220px] rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <Button variant="outline" size="sm" onClick={download}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <div className="text-xs text-muted-foreground">
            Showing {top.length} of {filtered.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 text-right font-medium">{valueLabel}</th>
            </tr>
          </thead>
          <tbody>
            {top.map(([name, value], i) => (
              <tr
                key={name + i}
                className={cn(
                  "border-t",
                  i % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <td className="max-w-[520px] px-4 py-2">
                  <div className="truncate" title={name}>
                    {name || "(unknown)"}
                  </div>
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
