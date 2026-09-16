import type { Priority } from "./mock-ai";

export type Task = {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  due: string;
  done: boolean;
};

export const todayTasks: Task[] = [
  {
    id: "t1",
    title: "Finalise Q3 investor update deck",
    project: "Investor Relations",
    priority: "high",
    due: "Today, 4:00 PM",
    done: false,
  },
  {
    id: "t2",
    title: "Review onboarding flow copy with design",
    project: "Product",
    priority: "medium",
    due: "Today, 2:30 PM",
    done: false,
  },
  {
    id: "t3",
    title: "Approve supplier invoices for August",
    project: "Operations",
    priority: "medium",
    due: "Today, 5:00 PM",
    done: true,
  },
  {
    id: "t4",
    title: "Reply to partnership enquiry from Kudos Labs",
    project: "Growth",
    priority: "high",
    due: "Today, 11:00 AM",
    done: true,
  },
  {
    id: "t5",
    title: "Draft agenda for Friday team retro",
    project: "Team",
    priority: "low",
    due: "Tomorrow",
    done: false,
  },
];

export const deadlines = [
  { id: "d1", title: "Client proposal — Mahlangu Group", when: "Thu, 18 Sep", days: 2, owner: "You" },
  { id: "d2", title: "Onboarding flow 100% rollout", when: "Fri, 19 Sep", days: 3, owner: "Product" },
  { id: "d3", title: "Q3 board pack submission", when: "Mon, 22 Sep", days: 6, owner: "You" },
  { id: "d4", title: "Annual compliance review", when: "Wed, 30 Sep", days: 14, owner: "Operations" },
];

export const activity = [
  { id: "a1", label: "Meeting summarised", detail: "Weekly product sync — 4 action items", when: "12 min ago" },
  { id: "a2", label: "Email drafted", detail: "Partnership follow-up (Professional tone)", when: "1 hr ago" },
  { id: "a3", label: "Day planned", detail: "6 tasks sequenced into time blocks", when: "This morning" },
];

export const priorityLabel: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function priorityClasses(priority: Priority) {
  switch (priority) {
    case "high":
      return "bg-highlight/12 text-highlight border-highlight/30";
    case "medium":
      return "bg-warning/15 text-warning-foreground border-warning/40";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
