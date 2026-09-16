import { createFileRoute } from "@tanstack/react-router";
import { Clock, Loader2, Plus, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, DisclaimerBanner, PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { priorityClasses, priorityLabel } from "@/lib/demo-data";
import { generatePlan, type Priority, type PlannerResult, type PlannerTask } from "@/lib/mock-ai";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — VXK_Assistant AI" },
      {
        name: "description",
        content:
          "Enter your tasks with priorities and deadlines, then generate a prioritised breakdown and a time-blocked daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner — VXK_Assistant AI" },
      {
        property: "og:description",
        content: "Turn a task list into a prioritised breakdown and a clear time-blocked daily schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

const initialTasks: PlannerTask[] = [
  { id: "p1", title: "Finalise Q3 investor update deck", priority: "high", deadline: "2026-09-17", estimate: 2 },
  { id: "p2", title: "Review onboarding flow copy with design", priority: "medium", deadline: "2026-09-18", estimate: 1 },
  { id: "p3", title: "Reply to Kudos Labs partnership enquiry", priority: "high", deadline: "2026-09-16", estimate: 0.5 },
  { id: "p4", title: "Draft agenda for Friday retro", priority: "low", deadline: "2026-09-19", estimate: 0.5 },
];

function PlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState("");
  const [estimate, setEstimate] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);

  function addTask() {
    if (!title.trim()) {
      toast.error("Add a task name first.");
      return;
    }
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        priority,
        deadline,
        estimate: Number(estimate) || 1,
      },
    ]);
    setTitle("");
    setDeadline("");
    setEstimate("1");
    setPriority("medium");
    toast.success("Task added to the list.");
  }

  async function generate() {
    if (tasks.length === 0) {
      toast.error("Add at least one task to plan.");
      return;
    }
    setLoading(true);
    setResult(null);
    const plan = await generatePlan(tasks);
    setResult(plan);
    setLoading(false);
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        subtitle="Capture what needs doing, then let VXK_Assistant sequence it into a prioritised, time-blocked day."
      />
      <DisclaimerBanner />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base">Add a task</CardTitle>
            <CardDescription>Priority and deadline drive how the plan is ordered.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task</Label>
              <Input
                id="task-title"
                placeholder="e.g. Prepare client proposal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-estimate">Estimate (hours)</Label>
                <Input
                  id="task-estimate"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={estimate}
                  onChange={(e) => setEstimate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-deadline">Deadline</Label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <Button onClick={addTask} variant="secondary" className="w-full">
              <Plus aria-hidden /> Add task
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="font-display text-base">Task list</CardTitle>
                <CardDescription>{tasks.length} task(s) ready to plan</CardDescription>
              </div>
              <Button onClick={generate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 aria-hidden className="animate-spin" /> Generating plan…
                  </>
                ) : (
                  <>
                    <Sparkles aria-hidden /> Generate plan
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tasks yet — add your first one on the left.
              </p>
            )}
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-2.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{task.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {task.deadline || "No deadline"} · {task.estimate}h
                  </span>
                </span>
                <Badge variant="outline" className={priorityClasses(task.priority)}>
                  {priorityLabel[task.priority]}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove ${task.title}`}
                  onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                >
                  <Trash2 aria-hidden className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {loading && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-base">Building your schedule…</CardTitle>
            <CardDescription>Ranking tasks by impact, then fitting them into focus blocks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full animate-pulse" />
            ))}
          </CardContent>
        </Card>
      )}

      {result && !loading && (
        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-base">Prioritised breakdown</CardTitle>
              <CardDescription>{result.headline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3">
                {result.ranked.map((item) => (
                  <li key={item.task.id} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {item.rank}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{item.task.title}</span>
                        <Badge variant="outline" className={priorityClasses(item.task.priority)}>
                          {priorityLabel[item.task.priority]}
                        </Badge>
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">{item.reason}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Why this order
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {result.rationale.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-display text-base">Daily schedule</CardTitle>
              <CardDescription>Time blocks starting 9:00 AM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.schedule.map((block, i) => (
                <div
                  key={`${block.time}-${i}`}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-card/60 p-3 sm:flex-row sm:items-start sm:gap-4"
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-primary sm:w-40">
                    <Clock aria-hidden className="size-3.5" />
                    {block.time}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{block.title}</span>
                      <Badge variant="outline" className={priorityClasses(block.priority)}>
                        {priorityLabel[block.priority]}
                      </Badge>
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{block.focus}</span>
                  </span>
                </div>
              ))}
              <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/12 p-3">
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                <ul className="space-y-1 text-xs text-warning-foreground">
                  {result.risks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
