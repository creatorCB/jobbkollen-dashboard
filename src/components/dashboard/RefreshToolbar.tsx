"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RefreshToolbar({
  lastUpdated,
  loading,
  onRefresh,
}: {
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-muted-foreground">
        {lastUpdated ? (
          <span>
            Updated {lastUpdated.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ) : (
          <span>Not updated yet</span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
        Refresh
      </Button>
    </div>
  );
}
