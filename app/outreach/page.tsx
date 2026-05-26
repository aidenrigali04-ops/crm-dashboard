import { createServiceClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";
import { Mail, Phone, Linkedin } from "lucide-react";

const CHANNEL_ICONS = { email: Mail, sms: Phone, linkedin: Linkedin };

export const revalidate = 60;

export default async function OutreachPage() {
  const db = createServiceClient();
  const { data: steps } = await db
    .from("sequence_steps")
    .select("id, channel, status, step_number, subject, send_at, sent_at, leads(name, company)")
    .order("send_at", { ascending: false })
    .limit(100);

  const pending = (steps ?? []).filter(s => s.status === "pending").length;
  const sent    = (steps ?? []).filter(s => s.status === "sent").length;

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6 max-w-5xl">
      <div>
        <h1 className="text-base font-medium text-zinc-100">Outreach</h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">
          {pending} pending · {sent} sent · {(steps ?? []).length} total steps
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="divide-y divide-zinc-800/40">
          {(steps ?? []).map((step: any) => {
            const Icon = CHANNEL_ICONS[step.channel as keyof typeof CHANNEL_ICONS] ?? Mail;
            return (
              <div key={step.id} className="flex flex-col gap-2 px-4 py-3 active:bg-zinc-800/30 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex min-w-0 items-start gap-3 sm:flex-1">
                  <Icon size={14} className="mt-0.5 shrink-0 text-zinc-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-zinc-200">
                      {step.leads?.name ?? step.leads?.company ?? "Unknown lead"}
                    </p>
                    <p className="truncate font-mono text-[11px] text-zinc-500">
                      {step.channel} #{step.step_number}
                      {step.subject ? ` · ${step.subject}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pl-7 sm:shrink-0 sm:pl-0">
                  <span className="rounded px-2 py-0.5 font-mono text-[10px] bg-zinc-800 text-zinc-400">
                    {step.status}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-zinc-600">
                    {step.sent_at ? timeAgo(step.sent_at) : timeAgo(step.send_at)}
                  </span>
                </div>
              </div>
            );
          })}
          {(steps ?? []).length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-zinc-600">No outreach steps yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
