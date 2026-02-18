import { FilterChips } from "@/components/dashboard/FilterChips";
import { RefreshButton } from "@/components/dashboard/RefreshButton";

export function PageToolbar({
  chips,
  updatedAt,
}: {
  chips?: string[];
  updatedAt?: Date;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <FilterChips chips={chips} />
      <div className="hidden text-xs text-muted-foreground md:block">
        {updatedAt
          ? `Updated ${updatedAt.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : ""}
      </div>
      <RefreshButton />
    </div>
  );
}
