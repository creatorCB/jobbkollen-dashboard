import type { ReactNode } from "react";

import { SidebarNav } from "@/components/dashboard/SidebarNav";

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

          <SidebarNav />

          <div className="mt-3 border-t px-2 pt-3 text-xs text-muted-foreground">
            Source: Supabase / Platsbanken
          </div>
        </aside>

        <section>
          <header className="mb-6 rounded-xl border bg-gradient-to-b from-muted/50 to-background p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
          <div>Public</div>
        </div>
      </footer>
    </div>
  );
}
