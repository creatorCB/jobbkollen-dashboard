"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, Globe2, LayoutDashboard, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const nav: NavItem[] = [
  { href: "/", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/employers", label: "Employers", icon: <Building2 className="h-4 w-4" /> },
  { href: "/regions", label: "Regions", icon: <Globe2 className="h-4 w-4" /> },
  { href: "/occupations", label: "Occupations", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/areas", label: "Areas", icon: <Users className="h-4 w-4" /> },
];

export function AppShell({
  title,
  subtitle,
  toolbar,
  children,
}: {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border bg-card p-3 shadow-sm">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              J
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Jobbkollen</div>
              <div className="text-xs text-muted-foreground">Dashboard</div>
            </div>
          </div>

          <nav className="mt-2 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    active && "font-medium"
                  )}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="mt-3 border-t px-2 pt-3 text-xs text-muted-foreground">
            Source: Supabase / Platsbanken
          </div>
        </aside>

        <section>
          <header className="mb-6 rounded-xl border bg-gradient-to-b from-muted/50 to-background p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
            </div>
          </header>

          {children}
        </section>
      </div>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-muted-foreground">
          <div>Jobbkollen Dashboard</div>
          <div>Light mode</div>
        </div>
      </footer>
    </div>
  );
}
