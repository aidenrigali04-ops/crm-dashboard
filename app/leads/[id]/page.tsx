import { createServiceClient } from "@/lib/supabase/server";
import { STATUS_LABELS, STATUS_COLORS, DISC_COLORS, DISC_LABELS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Linkedin, Globe, Brain, Send, MessageCircle } from "lucide-react";
import Link from "next/link";

async function getLead(id: string) {
  const db = createServiceClient();
  const { data } = await db
    .from("leads")
    .select(`
      *,
      lead_profiles (*),
      outreach_sequences (
        *,
        sequence_steps (*)
      ),
      reply_log (*)
    `)
    .eq("id", id)
    .order("classified_at", { foreignTable: "reply_log", ascending: false })
    .single();
  return data;
}

const CHANNEL_ICONS: Record<string, typeof Mail> = {
  email: Mail, sms: Phone, linkedin: Linkedin,
};

const STEP_STATUS_COLORS: Record<string, string> = {
  sent:      "bg-green-900/40 text-green-400",
  pending:   "bg-zinc-800 text-zinc-500",
  failed:    "bg-red-900/40 text-red-400",
  skipped:   "bg-zinc-800 text-zinc-600",
  cancelled: "bg-zinc-800 text-zinc-600",
};

const REPLY_COLORS: Record<string, string> = {
  interested:   "bg-green-900/40 text-green-400",
  soft_interest:"bg-teal-900/40 text-teal-400",
  objection:    "bg-amber-900/40 text-amber-400",
  wrong_person: "bg-zinc-800 text-zinc-400",
  unsubscribe:  "bg-red-900/40 text-red-400",
};

const AWARENESS_LABELS = ["", "Unaware", "Problem-aware", "Solution-aware", "Product-aware", "Most aware"];

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id);
  if (!lead) notFound();

  const profile  = lead.lead_profiles;
  const sequence = lead.outreach_sequences;
  const steps    = sequence?.sequence_steps?.sort((a: any, b: any) => a.step_number - b.step_number) ?? [];
  const replies  = lead.reply_log ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      {/* Back + header */}
      <div>
        <Link href="/leads" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-3 transition-colors w-fit">
          <ArrowLeft size={12} />
          All leads
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-medium text-zinc-400">
                {(lead.name ?? lead.company)?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-zinc-100">{lead.name ?? "Unknown"}</h1>
              <p className="text-sm text-zinc-400">{lead.title} · {lead.company}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${STATUS_COLORS[lead.status] ?? "bg-zinc-800 text-zinc-500"}`}>
                  {STATUS_LABELS[lead.status] ?? lead.status}
                </span>
                <span className="text-[11px] text-zinc-600 font-mono">score: {lead.score}</span>
                <span className="text-[11px] text-zinc-600 font-mono">source: {lead.source}</span>
              </div>
            </div>
          </div>
          {/* Contact buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 active:bg-zinc-700 sm:min-h-0 sm:rounded sm:py-1.5">
                <Mail size={12} /> Email
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 active:bg-zinc-700 sm:min-h-0 sm:rounded sm:py-1.5">
                <Phone size={12} /> Call
              </a>
            )}
            {lead.linkedin_url && (
              <a href={lead.linkedin_url} target="_blank" className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 active:bg-zinc-700 sm:min-h-0 sm:rounded sm:py-1.5">
                <Linkedin size={12} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-3.5 space-y-2">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Contact info</p>
          {[
            { icon: Mail,    label: "Email",   value: lead.email },
            { icon: Phone,   label: "Phone",   value: lead.phone },
            { icon: Globe,   label: "Website", value: lead.website },
          ].map(({ icon: Icon, label, value }) => value ? (
            <div key={label} className="flex items-center gap-2">
              <Icon size={12} className="text-zinc-600 shrink-0" />
              <span className="text-xs text-zinc-400 w-14 shrink-0">{label}</span>
              <span className="text-xs text-zinc-200 truncate font-mono">{value}</span>
            </div>
          ) : null)}
          {lead.company_size && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 w-[76px] shrink-0">Company size</span>
              <span className="text-xs text-zinc-200 font-mono">{lead.company_size} employees</span>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-3.5 space-y-2">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Timeline</p>
          {[
            { label: "Discovered",  value: timeAgo(lead.created_at) },
            { label: "Enriched",    value: lead.enriched_at ? timeAgo(lead.enriched_at) : "—" },
            { label: "Replied",     value: lead.replied_at ? timeAgo(lead.replied_at) : "—" },
            { label: "Reply type",  value: lead.reply_type ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-20 shrink-0">{label}</span>
              <span className="text-xs text-zinc-300 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pain signals */}
      {lead.pain_signals && (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-3.5">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2">Pain signals</p>
          <p className="text-xs text-zinc-400 leading-relaxed">{lead.pain_signals}</p>
        </div>
      )}

      {/* Psychological profile */}
      {profile && (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-purple-400" />
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Psychological profile</p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {/* DISC */}
            <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
              <p className="text-[10px] text-zinc-500 font-mono mb-1">DISC type</p>
              <p className={`text-2xl font-medium ${DISC_COLORS[profile.disc ?? ""] ?? "text-zinc-400"}`}>
                {profile.disc ?? "—"}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                {DISC_LABELS[profile.disc ?? ""] ?? ""}
              </p>
            </div>

            {/* Awareness */}
            <div className="bg-zinc-800/60 rounded-lg p-3">
              <p className="text-[10px] text-zinc-500 font-mono mb-1.5">Awareness level</p>
              <p className="text-base font-medium text-zinc-200">{profile.awareness_level ?? "—"}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{AWARENESS_LABELS[profile.awareness_level ?? 0]}</p>
              {profile.awareness_level && (
                <div className="flex gap-0.5 mt-2">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className={`flex-1 h-1 rounded-full ${n <= profile.awareness_level! ? "bg-teal-500" : "bg-zinc-700"}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Primary fear */}
            <div className="bg-zinc-800/60 rounded-lg p-3">
              <p className="text-[10px] text-zinc-500 font-mono mb-1.5">Primary fear</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{profile.primary_fear ?? "—"}</p>
            </div>

            {/* Ego identity */}
            <div className="bg-zinc-800/60 rounded-lg p-3">
              <p className="text-[10px] text-zinc-500 font-mono mb-1.5">Ego identity</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{profile.ego_identity ?? "—"}</p>
            </div>
          </div>

          {/* Top triggers */}
          {profile.top_triggers && (profile.top_triggers as any[]).length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-500 font-mono mb-2">Top triggers</p>
              <div className="space-y-1.5">
                {(profile.top_triggers as any[]).map((t: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-[10px] text-zinc-600 font-mono mt-0.5 w-3 shrink-0">{i + 1}</span>
                    <div>
                      <span className="text-xs font-medium text-zinc-300">{t.trigger}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">· {t.expert}</span>
                      <p className="text-[11px] text-zinc-600 mt-0.5">{t.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opening hook + do not */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-green-900/10 border border-green-800/30 rounded-lg p-3">
              <p className="text-[10px] text-green-600 font-mono mb-1.5">Opening hook</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{profile.opening_hook ?? "—"}</p>
            </div>
            <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-3">
              <p className="text-[10px] text-red-600 font-mono mb-1.5">Do not</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{profile.do_not ?? "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Outreach sequence */}
      {sequence && (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Send size={13} className="text-amber-400" />
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Outreach sequence</p>
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-mono ${STEP_STATUS_COLORS[sequence.status] ?? "bg-zinc-800 text-zinc-500"}`}>
              {sequence.status}
            </span>
          </div>
          <div className="space-y-2">
            {steps.map((step: any) => {
              const Icon = CHANNEL_ICONS[step.channel] ?? Mail;
              return (
                <div key={step.id} className="flex items-center gap-3 py-2 border-b border-zinc-800/30 last:border-0">
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <Icon size={12} className="text-zinc-500" />
                    <span className="text-[11px] text-zinc-500 font-mono">{step.channel} #{step.step_number}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono w-16 text-center shrink-0 ${STEP_STATUS_COLORS[step.status] ?? ""}`}>
                    {step.status}
                  </span>
                  <span className="text-[11px] text-zinc-600 font-mono">
                    {step.sent_at ? `Sent ${timeAgo(step.sent_at)}` : `Due ${timeAgo(step.send_at)}`}
                  </span>
                  {step.subject && (
                    <span className="text-xs text-zinc-400 truncate">{step.subject}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reply log */}
      {replies.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={13} className="text-teal-400" />
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Reply log</p>
          </div>
          <div className="space-y-3">
            {replies.map((reply: any) => (
              <div key={reply.id} className="bg-zinc-800/40 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${REPLY_COLORS[reply.reply_type] ?? "bg-zinc-800 text-zinc-500"}`}>
                    {reply.reply_type ?? "unknown"}
                  </span>
                  <span className="text-[11px] text-zinc-600 font-mono">{reply.channel}</span>
                  <span className="text-[11px] text-zinc-700 font-mono ml-auto">{timeAgo(reply.classified_at)}</span>
                </div>
                {reply.reply_text && (
                  <p className="text-xs text-zinc-400 leading-relaxed mb-2 italic">"{reply.reply_text}"</p>
                )}
                {reply.response_draft && (
                  <div className="border-l-2 border-teal-800 pl-2 mt-2">
                    <p className="text-[10px] text-zinc-600 font-mono mb-1">Response sent</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{reply.response_draft}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
