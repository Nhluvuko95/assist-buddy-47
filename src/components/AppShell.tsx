import { Link, useRouterState } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, LayoutDashboard, ListChecks, Mail, Sparkle } from "lucide-react";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AI_DISCLAIMER } from "@/lib/mock-ai";

const navItems = [
  { to: "/", label: "Dashboard", description: "Overview", icon: LayoutDashboard },
  { to: "/planner", label: "AI Task Planner", description: "Plan the day", icon: ListChecks },
  { to: "/email", label: "Email Generator", description: "Draft replies", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", description: "Notes to actions", icon: CalendarClock },
] as const;

export function DisclaimerBanner() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/12 px-4 py-3"
    >
      <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
      <p className="text-sm leading-relaxed text-warning-foreground">
        <span className="font-semibold">Responsible AI:</span> {AI_DISCLAIMER}
      </p>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="px-4 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/30"
            >
              <Sparkle className="size-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight">VXK_Assistant AI</span>
              <span className="text-xs text-sidebar-foreground/60">Productivity workspace</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.to}
                      tooltip={item.label}
                      className="h-11"
                    >
                      <Link to={item.to}>
                        <item.icon aria-hidden />
                        <span className="flex flex-col leading-tight">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-xs opacity-60">{item.description}</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-4 pb-5">
          <p className="text-xs leading-relaxed text-sidebar-foreground/60">{AI_DISCLAIMER}</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <span className="font-title pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-tight">
            VXK_Assistant AI
          </span>
          <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">Demo workspace</span>
        </header>
        <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
