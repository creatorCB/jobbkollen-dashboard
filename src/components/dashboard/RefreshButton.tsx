"use client";

import { RefreshCw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function RefreshButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        // Cache-bust (forces new server render + fresh metrics revalidate)
        router.replace(`${pathname}?t=${Date.now()}`);
        router.refresh();
        // Small delay so spinner is visible; avoids UI looking stuck.
        setTimeout(() => setLoading(false), 600);
      }}
    >
      <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
      Refresh
    </Button>
  );
}
