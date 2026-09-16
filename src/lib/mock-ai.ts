// Deterministic, realistic mock "AI" generation used for the demo experience.
// No network calls: outputs are composed from the user's own input.

export const AI_DISCLAIMER = "AI can make mistakes. Please verify important details and review outputs.";

export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export type Priority = "high" | "medium" | "low";

export type PlannerTask = {
  id: string;
  title: string;
  priority: Priority;
  deadline: string;
  estimate: number; // hours
};

export type TimeBlock = {
  time: string;
  title: string;
  focus: string;
  priority: Priority;
};

export type PlannerResult = {
  headline: string;
  rationale: string[];
  ranked: { task: PlannerTask; rank: number; reason: string }[];
  schedule: TimeBlock[];
  risks: string[];
};

const priorityWeight: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function fmtTime(minutesFromStart: number) {
  const total = 9 * 60 + minutesFromStart;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export async function generatePlan(tasks: PlannerTask[]): Promise<PlannerResult> {
  await delay(1500);

  const ranked = [...tasks]
    .sort((a, b) => {
      const p = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (p !== 0) return p;
      return a.deadline.localeCompare(b.deadline);
    })
    .map((task, index) => ({
      task,
      rank: index + 1,
      reason:
        task.priority === "high"
          ? `Highest impact and due ${task.deadline || "soon"} — protect deep-focus time for this first.`
          : task.priority === "medium"
            ? `Meaningful progress item; schedule after critical work while energy is still high.`
            : `Low urgency — batch into the afternoon or delegate if the day compresses.`,
    }));

  const schedule: TimeBlock[] = [];
  let cursor = 0;
  schedule.push({
    time: `${fmtTime(0)} – ${fmtTime(15)}`,
    title: "Daily alignment",
    focus: "Review priorities, clear blockers, confirm today's single most important outcome.",
    priority: "medium",
  });
  cursor = 15;

  for (const { task } of ranked) {
    const minutes = Math.max(30, Math.round((task.estimate || 1) * 60));
    schedule.push({
      time: `${fmtTime(cursor)} – ${fmtTime(cursor + minutes)}`,
      title: task.title,
      focus:
        task.priority === "high"
          ? "Deep focus block — notifications off, no meetings."
          : "Steady execution block — batch related follow-ups here.",
      priority: task.priority,
    });
    cursor += minutes;
    if (cursor >= 180 && cursor < 210) {
      schedule.push({
        time: `${fmtTime(cursor)} – ${fmtTime(cursor + 30)}`,
        title: "Reset break",
        focus: "Step away from the screen to protect afternoon focus quality.",
        priority: "low",
      });
      cursor += 30;
    }
  }

  schedule.push({
    time: `${fmtTime(cursor)} – ${fmtTime(cursor + 20)}`,
    title: "Shutdown review",
    focus: "Log progress, move unfinished items to tomorrow, capture open questions.",
    priority: "medium",
  });

  const highCount = tasks.filter((t) => t.priority === "high").length;
  const totalHours = tasks.reduce((sum, t) => sum + (t.estimate || 1), 0);

  return {
    headline: `${tasks.length} task${tasks.length === 1 ? "" : "s"} sequenced into a ${totalHours.toFixed(1)}h focused day`,
    rationale: [
      `${highCount} high-priority item${highCount === 1 ? "" : "s"} placed in the morning window, when focus capacity is highest.`,
      "Similar work is batched to reduce context switching between blocks.",
      totalHours > 7
        ? "The plan exceeds a realistic 7h of focused output — consider deferring the lowest-ranked item."
        : "Total load fits comfortably inside a single working day with buffer.",
    ],
    ranked,
    risks: [
      "Deadlines were inferred from the dates you entered; confirm them against your calendar.",
      "Estimates assume uninterrupted blocks — add 20% buffer if your day is meeting-heavy.",
    ],
  };
}

export type Tone = "Formal" | "Friendly" | "Professional" | "Concise";

export type EmailResult = {
  subject: string;
  altSubjects: string[];
  body: string;
};

export async function generateEmail(input: {
  topic: string;
  keyPoints: string;
  recipient: string;
  tone: Tone;
}): Promise<EmailResult> {
  await delay(1400);

  const points = input.keyPoints
    .split("\n")
    .map((p) => p.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  const name = input.recipient.trim() || "team";
  const topic = input.topic.trim() || "our next steps";

  const openings: Record<Tone, string> = {
    Formal: `Dear ${name},\n\nI hope this message finds you well. I am writing regarding ${topic}.`,
    Friendly: `Hi ${name},\n\nHope your week is going well! I wanted to share a quick update on ${topic}.`,
    Professional: `Hi ${name},\n\nI wanted to follow up on ${topic} and outline where things currently stand.`,
    Concise: `Hi ${name},\n\nQuick note on ${topic}.`,
  };

  const closings: Record<Tone, string> = {
    Formal: `Please let me know if you require any further information. I would be glad to provide it.\n\nKind regards,\nVXK`,
    Friendly: `Let me know what you think — happy to jump on a quick call if that's easier!\n\nThanks so much,\nVXK`,
    Professional: `Happy to walk through any of this in more detail. Let me know how you'd like to proceed.\n\nBest regards,\nVXK`,
    Concise: `Let me know if that works.\n\nThanks,\nVXK`,
  };

  const bodyPoints = points.length
    ? points.map((p) => `• ${p.charAt(0).toUpperCase()}${p.slice(1)}`).join("\n")
    : `• ${topic.charAt(0).toUpperCase()}${topic.slice(1)}`;

  const bridge: Record<Tone, string> = {
    Formal: "The key points are summarised below for your consideration:",
    Friendly: "Here's the short version:",
    Professional: "Here are the key points:",
    Concise: "Key points:",
  };

  const subjectBase = topic.replace(/\.$/, "");
  const titled = subjectBase.charAt(0).toUpperCase() + subjectBase.slice(1);

  const subjects: Record<Tone, string> = {
    Formal: `Regarding ${titled}`,
    Friendly: `Quick update: ${titled}`,
    Professional: `${titled} — update and next steps`,
    Concise: `${titled}`,
  };

  return {
    subject: subjects[input.tone],
    altSubjects: [
      `${titled}: where we stand`,
      `Next steps on ${subjectBase}`,
      `Following up — ${subjectBase}`,
    ],
    body: `${openings[input.tone]}\n\n${bridge[input.tone]}\n\n${bodyPoints}\n\n${closings[input.tone]}`,
  };
}

export type ActionItem = { task: string; owner: string; due: string };

export type MeetingResult = {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
};

export const SAMPLE_MEETING_NOTES = `Weekly product sync — 24 attendees, 45 min
- Thabo walked through Q3 retention numbers: churn down 1.8% after onboarding rework
- Decision: ship the new onboarding flow to 100% of users on Friday
- Lerato raised that the billing emails still reference the old pricing page
- Action: Lerato to update billing email templates by Thursday
- Action: Sipho to run a load test on the checkout service before launch, due Wednesday
- Decision: postpone the mobile push notification work to Q4
- Open question: do we need legal review for the updated terms copy?
- Action: Naledi to confirm with legal by next Monday`;

export async function generateMeetingSummary(notes: string): Promise<MeetingResult> {
  await delay(1600);

  const lines = notes
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  const decisions = lines
    .filter((l) => /^decision/i.test(l) || /\bdecided\b|\bwe will\b|\bagreed\b/i.test(l))
    .map((l) => l.replace(/^decision:\s*/i, ""));

  const actionLines = lines.filter((l) => /^action/i.test(l) || /\bto\b.*\bby\b/i.test(l));

  const actionItems: ActionItem[] = actionLines.map((line) => {
    const clean = line.replace(/^action:?\s*/i, "");
    const ownerMatch = clean.match(/^([A-Z][a-zA-Z]+)\b/);
    const dueMatch = clean.match(/\b(?:by|due)\s+([^,.]+)/i);
    return {
      task: clean
        .replace(/^([A-Z][a-zA-Z]+)\s+to\s+/, "")
        .replace(/\b(?:by|due)\s+[^,.]+/i, "")
        .replace(/[,.\s]+$/, "")
        .trim() || clean,
      owner: ownerMatch ? ownerMatch[1] : "Unassigned",
      due: dueMatch ? dueMatch[1].trim() : "No date given",
    };
  });

  const questions = lines.filter((l) => /^open question/i.test(l) || l.endsWith("?"));

  const headline = lines[0] ?? "Meeting notes";
  const summary = `${headline}. The discussion covered ${lines.length} captured points, resulting in ${decisions.length} recorded decision${decisions.length === 1 ? "" : "s"} and ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"} with named owners. ${
    decisions.length
      ? `The most consequential outcome was: ${decisions[0].toLowerCase()}.`
      : "No firm decisions were recorded — a follow-up may be needed to close the loop."
  } ${
    questions.length
      ? `${questions.length} open question${questions.length === 1 ? "" : "s"} remain${questions.length === 1 ? "s" : ""} unresolved and should be tracked.`
      : "No open questions were left outstanding."
  }`;

  return {
    summary,
    decisions: decisions.length ? decisions : ["No explicit decisions detected in the notes provided."],
    actionItems,
    followUps: questions.length
      ? questions.map((q) => q.replace(/^open question:?\s*/i, ""))
      : ["Confirm owners and dates for anything captured without a deadline."],
  };
}
