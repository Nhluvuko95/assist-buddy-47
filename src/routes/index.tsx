import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  FolderKanban,
  ListChecks,
  Mail,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DisclaimerBanner, PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { activity, deadlines, priorityClasses, priorityLabel, todayTasks } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VXK_Assistant AI — Your AI productivity dashboard" },
      {
        name: "description",
        content:
          "Track tasks, deadlines and projects in one dashboard, then launch AI tools for planning, email drafting and meeting summaries.",
      },
      { property: "og:title", content: "VXK_Assistant AI — Your AI productivity dashboard" },
      {
        property: "og:description",
        content:
          "Track tasks, deadlines and projects in one dashboard, then launch AI tools for planning, email drafting and meeting summaries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const quickLaunch = [
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    copy: "Turn a messy task list into a prioritised, time-blocked day.",
  },
  {
    to: "/email",
    icon: Mail,
    title: "Email Generator",
    copy: "Draft a polished email with subject lines in your chosen tone.",
  },
  {
    to: "/meetings",
    icon: CalendarClock,
    title: "Meeting Summarizer",
    copy: "Convert raw notes into decisions and owned action items.",
  },
] as const;

function relativeChip(days: number) {
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return `In ${Math.round(days / 7)} weeks`;
}

function Dashboard() {
  const [tasks, setTasks] = useState(todayTasks);

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;
  const percent = useMemo(() => Math.round((completed / tasks.length) * 100), [completed, tasks.length]);
  const highPriorityLeft = tasks.filter((t) => !t.done && t.priority === "high").length;

  const stats = [
    {
      label: "Tasks completed today",
      value: `${completed}/${tasks.length}`,
      icon: CheckCircle2,
      hint: `${percent}% of today's plan done`,
      trend: "+12% vs last week",
      tone: "text-success",
      ring: "bg-success/10",
    },
    {
      label: "Pending action items",
      value: String(pending + 4),
      icon: CircleDashed,
      hint: "4 carried over from meetings",
      trend: "3 due within 48 hrs",
      tone: "text-highlight",
      ring: "bg-highlight/10",
    },
    {
      label: "Active projects",
      value: "6",
      icon: FolderKanban,
      hint: "2 with deadlines this week",
      trend: "All on track",
      tone: "text-primary",
      ring: "bg-primary/10",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Good morning, Nhluvuko"
        subtitle="Here is where your day stands. Launch an AI tool below to move faster on planning, writing and follow-ups."
      />
      <DisclaimerBanner />

      {/* AI insight bar */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-highlight/8 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Sparkles aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">AI insight</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {highPriorityLeft > 0
                  ? `You have ${highPriorityLeft} high-priority item${highPriorityLeft > 1 ? "s" : ""} still open and 2 deadlines inside 3 days. Block 9:00–11:00 for deep work before your first meeting.`
                  : "High-priority work is clear. Use the free morning block to get ahead of the Q3 board pack due Monday."}
              </p>
            </div>
          </div>
          <Link
            to="/planner"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Plan my day
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </CardDescription>
                <span className={`flex size-9 items-center justify-center rounded-xl ${stat.ring} ${stat.tone}`}>
                  <stat.icon aria-hidden className="size-4" />
                </span>
              </div>
              <CardTitle className="font-display text-4xl tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
              <p className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <TrendingUp aria-hidden className="size-3.5" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="font-display text-lg">Today&apos;s tasks</CardTitle>
                <CardDescription>Tick items off as you go — progress updates instantly.</CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-full px-3">
                {pending} left
              </Badge>
            </div>
            <div className="mt-4 space-y-1.5">
              <Progress value={percent} className="h-1.5" aria-label="Task completion" />
              <p className="text-xs text-muted-foreground">{percent}% complete</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-all hover:border-border/70 hover:bg-muted/50"
              >
                <Checkbox
                  checked={task.done}
                  onCheckedChange={(checked) =>
                    setTasks((prev) =>
                      prev.map((t) => (t.id === task.id ? { ...t, done: checked === true } : t)),
                    )
                  }
                  className="mt-0.5"
                  aria-label={`Mark ${task.title} as complete`}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium ${
                      task.done ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{task.project}</span>
                    <span aria-hidden>•</span>
                    <span>{task.due}</span>
                  </span>
                </span>
                <Badge variant="outline" className={`rounded-full ${priorityClasses(task.priority)}`}>
                  {priorityLabel[task.priority]}
                </Badge>
              </label>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-base">Upcoming deadlines</CardTitle>
              <CardDescription>Next 14 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-border/70 bg-muted/30 p-3.5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{d.title}</p>
                    <span
                      aria-hidden
                      className={`mt-1 size-2 shrink-0 rounded-full ${
                        d.days <= 3 ? "bg-highlight" : d.days <= 7 ? "bg-warning" : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-full text-xs ${
                        d.days <= 3
                          ? "border-highlight/30 bg-highlight/10 text-highlight"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {relativeChip(d.days)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {d.when} · {d.owner}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-base">Recent AI activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                  <div className="min-w-0 text-sm">
                    <p className="font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.detail} · {a.when}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <section aria-labelledby="quick-launch" className="space-y-4">
        <h2 id="quick-launch" className="font-display text-lg font-semibold tracking-tight">
          Quick launch
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickLaunch.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/6 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <tool.icon aria-hidden className="size-5" />
              </span>
              <p className="mt-5 font-display text-base font-semibold">{tool.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.copy}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open tool
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
