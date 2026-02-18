"use client";

import { Badge } from "@/components/ui/badge";

export function FilterChips({
  chips = [
    "Last 90 days",
    "Data/IT occupation areas",
    "Supabase source",
    "Live",
  ],
}: {
  chips?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <Badge key={c} variant="secondary">
          {c}
        </Badge>
      ))}
    </div>
  );
}
