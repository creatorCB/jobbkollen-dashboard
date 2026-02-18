"use client";

import { cn } from "@/lib/utils";

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
  const top = rows.slice(0, limit);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          Showing {top.length} of {rows.length}
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
