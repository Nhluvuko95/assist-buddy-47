import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Loader2, Pencil, RefreshCw, Sparkles } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, type EmailResult, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator — VXK_Assistant AI" },
      {
        name: "description",
        content:
          "Describe your topic and key points, pick a tone, and generate a ready-to-send email with subject line options.",
      },
      { property: "og:title", content: "AI Email Generator — VXK_Assistant AI" },
      {
        property: "og:description",
        content: "Generate polished emails with subject line options in formal, friendly, professional or concise tone.",
      },
    ],
  }),
  component: EmailPage,
});

const tones: Tone[] = ["Formal", "Friendly", "Professional", "Concise"];

function EmailPage() {
  const [recipient, setRecipient] = useState("Lerato");
  const [topic, setTopic] = useState("the Kudos Labs partnership proposal");
  const [keyPoints, setKeyPoints] = useState(
    "we reviewed the proposal and are keen to move forward\nwe'd like to align on scope and pricing before signing\nsuggesting a 30-minute call on Thursday or Friday",
  );
  const [tone, setTone] = useState<Tone>("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!topic.trim()) {
      toast.error("Add a topic so the draft has a focus.");
      return;
    }
    setLoading(true);
    setResult(null);
    setEditing(false);
    const email = await generateEmail({ topic, keyPoints, recipient, tone });
    setResult(email);
    setSubject(email.subject);
    setBody(email.body);
    setLoading(false);
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      toast.success("Email copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copying isn't available in this browser.");
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Email Generator"
        subtitle="Give the key points, choose a tone, and get a send-ready draft with subject line options."
      />
      <DisclaimerBanner />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base">What is the email about?</CardTitle>
            <CardDescription>One key point per line works best.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient name</Label>
              <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={7}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="One point per line"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 aria-hidden className="animate-spin" /> Writing draft…
                </>
              ) : (
                <>
                  <Sparkles aria-hidden /> Generate email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="font-display text-base">Draft preview</CardTitle>
                <CardDescription>Edit anything before you send.</CardDescription>
              </div>
              {result && !loading && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{tone}</Badge>
                  <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
                    <Pencil aria-hidden /> {editing ? "Done editing" : "Edit"}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={copyAll}>
                    {copied ? <Check aria-hidden /> : <Copy aria-hidden />} Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={generate} aria-label="Regenerate draft">
                    <RefreshCw aria-hidden />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="space-y-3">
                <Skeleton className="h-6 w-2/3 animate-pulse" />
                <Skeleton className="h-4 w-full animate-pulse" />
                <Skeleton className="h-4 w-11/12 animate-pulse" />
                <Skeleton className="h-4 w-4/5 animate-pulse" />
                <Skeleton className="h-24 w-full animate-pulse" />
              </div>
            )}

            {!loading && !result && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Your generated email will appear here.
              </p>
            )}

            {!loading && result && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject line</Label>
                  <Input
                    id="subject"
                    value={subject}
                    readOnly={!editing}
                    onChange={(e) => setSubject(e.target.value)}
                    className={editing ? "" : "bg-muted/50"}
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.altSubjects.map((alt) => (
                      <button
                        key={alt}
                        type="button"
                        onClick={() => setSubject(alt)}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  {editing ? (
                    <Textarea id="body" rows={16} value={body} onChange={(e) => setBody(e.target.value)} />
                  ) : (
                    <div
                      id="body"
                      className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed"
                    >
                      {body}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
