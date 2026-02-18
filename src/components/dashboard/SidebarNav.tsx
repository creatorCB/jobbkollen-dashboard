"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, Globe2, LayoutDashboard, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/employers", label: "Employers", icon: <Building2 className="h-4 w-4" /> },
  { href: "/regions", label: "Regions", icon: <Globe2 className="h-4 w-4" /> },
  { href: "/occupations", label: "Occupations", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/areas", label: "Areas", icon: <Users className="h-4 w-4" /> },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-2 space-y-1">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Button
            key={item.href}
            asChild
            variant={active ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-2", active && "font-medium")}
          >
            <Link href={item.href}>
              {item.icon}
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
