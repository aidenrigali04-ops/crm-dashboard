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
    <div className="p-6 space-y-6 max-w-5xl">
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
              <div key={step.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30">
                <Icon size={14} className="text-zinc-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">
                    {step.leads?.name ?? step.leads?.company ?? "Unknown lead"}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">
                    {step.channel} #{step.step_number}
                    {step.subject ? ` · ${step.subject}` : ""}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-800 text-zinc-400">
                  {step.status}
                </span>
                <span className="text-[11px] text-zinc-600 font-mono shrink-0">
                  {step.sent_at ? timeAgo(step.sent_at) : timeAgo(step.send_at)}
                </span>
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
