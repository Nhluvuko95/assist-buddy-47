import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  FolderKanban,
  ListChecks,
  Mail,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DisclaimerBanner, PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

function Dashboard() {
  const [tasks, setTasks] = useState(todayTasks);

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;
  const percent = useMemo(() => Math.round((completed / tasks.length) * 100), [completed, tasks.length]);

  const stats = [
    {
      label: "Tasks completed today",
      value: `${completed}/${tasks.length}`,
      icon: CheckCircle2,
      hint: `${percent}% of today's plan done`,
      tone: "text-success",
    },
    {
      label: "Pending action items",
      value: String(pending + 4),
      icon: CircleDashed,
      hint: "4 carried over from meetings",
      tone: "text-highlight",
    },
    {
      label: "Active projects",
      value: "6",
      icon: FolderKanban,
      hint: "2 with deadlines this week",
      tone: "text-primary",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Good morning, Nhluvuko"
        subtitle="Here is where your day stands. Launch an AI tool below to move faster on planning, writing and follow-ups."
      />
      <DisclaimerBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon aria-hidden className={`size-4 ${stat.tone}`} />
              </div>
              <CardTitle className="font-display text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="font-display">Today&apos;s tasks</CardTitle>
                <CardDescription>Tick items off as you go — progress updates instantly.</CardDescription>
              </div>
              <Badge variant="secondary">{pending} left</Badge>
            </div>
            <Progress value={percent} className="mt-3 h-2" aria-label="Task completion" />
          </CardHeader>
          <CardContent className="space-y-1">
            {tasks.map((task, index) => (
              <div key={task.id}>
                {index > 0 && <Separator className="my-1" />}
                <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60">
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
                  <Badge variant="outline" className={priorityClasses(task.priority)}>
                    {priorityLabel[task.priority]}
                  </Badge>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-base">Upcoming deadlines</CardTitle>
              <CardDescription>Next 14 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-card/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{d.title}</p>
                    <Badge
                      variant="outline"
                      className={
                        d.days <= 3
                          ? "bg-highlight/12 text-highlight border-highlight/30"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {d.days}d
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.when} · {d.owner}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-base">Recent AI activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((a) => (
                <div key={a.id} className="text-sm">
                  <p className="font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.detail} · {a.when}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <section aria-labelledby="quick-launch" className="space-y-3">
        <h2 id="quick-launch" className="font-display text-lg font-semibold tracking-tight">
          Quick launch
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLaunch.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <tool.icon aria-hidden className="size-5" />
              </span>
              <p className="mt-4 font-display text-base font-semibold">{tool.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tool.copy}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
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
