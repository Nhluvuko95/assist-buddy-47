import { createFileRoute } from "@tanstack/react-router";
import { Copy, FileText, Gavel, HelpCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, DisclaimerBanner, PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { generateMeetingSummary, SAMPLE_MEETING_NOTES, type MeetingResult } from "@/lib/mock-ai";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — VXK_Assistant AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get an executive summary, key decisions and action items with owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Summarizer — VXK_Assistant AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into an executive summary, decisions and owned action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState(SAMPLE_MEETING_NOTES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingResult | null>(null);

  async function generate() {
    if (!notes.trim()) {
      toast.error("Paste some notes first, or load the sample template.");
      return;
    }
    setLoading(true);
    setResult(null);
    const summary = await generateMeetingSummary(notes);
    setResult(summary);
    setLoading(false);
  }

  async function copySummary() {
    if (!result) return;
    const text = [
      "EXECUTIVE SUMMARY",
      result.summary,
      "",
      "KEY DECISIONS",
      ...result.decisions.map((d) => `- ${d}`),
      "",
      "ACTION ITEMS",
      ...result.actionItems.map((a) => `- ${a.task} (${a.owner}, due ${a.due})`),
      "",
      "OPEN FOLLOW-UPS",
      ...result.followUps.map((f) => `- ${f}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Summary copied to clipboard.");
    } catch {
      toast.error("Copying isn't available in this browser.");
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Meeting Summarizer"
        subtitle="Paste your raw notes and get an executive summary, the decisions made, and action items with owners and dates."
      />
      <DisclaimerBanner />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="font-display text-base">Meeting notes</CardTitle>
                <CardDescription>Bullet points, transcript snippets — anything works.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setNotes(SAMPLE_MEETING_NOTES)}>
                <FileText aria-hidden /> Sample
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="sr-only">
                Meeting notes
              </Label>
              <Textarea
                id="notes"
                rows={16}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your meeting notes here…"
                className="font-mono text-xs leading-relaxed"
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 aria-hidden className="animate-spin" /> Summarising…
                </>
              ) : (
                <>
                  <Sparkles aria-hidden /> Summarise meeting
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {loading && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-base">Reading your notes…</CardTitle>
                <CardDescription>Extracting decisions, owners and deadlines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full animate-pulse" />
                <Skeleton className="h-4 w-11/12 animate-pulse" />
                <Skeleton className="h-4 w-3/4 animate-pulse" />
                <Skeleton className="h-28 w-full animate-pulse" />
              </CardContent>
            </Card>
          )}

          {!loading && !result && (
            <Card className="shadow-card">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Your summary, decisions and action items will appear here.
              </CardContent>
            </Card>
          )}

          {!loading && result && (
            <>
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="font-display text-base">Executive summary</CardTitle>
                    <Button size="sm" variant="secondary" onClick={copySummary}>
                      <Copy aria-hidden /> Copy all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <Gavel aria-hidden className="size-4 text-primary" /> Key decisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.decisions.map((d) => (
                      <li key={d} className="flex gap-2 text-sm">
                        <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="font-display text-base">Action items</CardTitle>
                    <Badge variant="secondary">{result.actionItems.length} items</Badge>
                  </div>
                  <CardDescription>Owners and dates were pulled from your notes — confirm them.</CardDescription>
                </CardHeader>
                <CardContent>
                  {result.actionItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No action items detected.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead className="w-32">Owner</TableHead>
                          <TableHead className="w-36">Due</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.actionItems.map((item, i) => (
                          <TableRow key={`${item.task}-${i}`}>
                            <TableCell className="text-sm">{item.task}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.owner}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{item.due}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <HelpCircle aria-hidden className="size-4 text-highlight" /> Open follow-ups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.followUps.map((f) => (
                      <li key={f} className="flex gap-2 text-sm">
                        <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-highlight" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
