import { createServiceClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";
import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";

async function getAgentData() {
  const db = createServiceClient();
  const [
    { data: harvests },
    { data: recentLeads },
    { data: profiles },
    { data: sequences },
    { data: replies },
    { data: content },
    { data: retention },
  ] = await Promise.all([
    db.from("harvest_log").select("*").order("run_at", { ascending: false }).limit(96),
    db.from("leads").select("created_at, status").order("created_at", { ascending: false }).limit(200),
    db.from("lead_profiles").select("profiled_at").order("profiled_at", { ascending: false }).limit(10),
    db.from("outreach_sequences").select("created_at").order("created_at", { ascending: false }).limit(10),
    db.from("reply_log").select("classified_at, reply_type").order("classified_at", { ascending: false }).limit(20),
    db.from("content_library").select("created_at, vertical, status").order("created_at", { ascending: false }).limit(5),
    db.from("retention_reports").select("created_at, health_status").order("created_at", { ascending: false }).limit(10),
  ]);

  return { harvests, recentLeads, profiles, sequences, replies, content, retention };
}

export default async function AgentsPage() {
  const { harvests, recentLeads, profiles, sequences, replies, content, retention } = await getAgentData();

  const last24h = new Date(Date.now() - 86400000).toISOString();
  const todayLeads = (recentLeads ?? []).filter((l: any) => l.created_at > last24h).length;
  const totalHarvested = (harvests ?? []).reduce((s: number, h: any) => s + (h.leads_inserted ?? 0), 0);
  const totalFound     = (harvests ?? []).reduce((s: number, h: any) => s + (h.leads_found ?? 0), 0);
  const lastHarvest    = harvests?.[0];
  const lastProfile    = profiles?.[0];
  const lastSequence   = sequences?.[0];
  const lastReply      = replies?.[0];
  const lastContent    = content?.[0];
  const lastRetention  = retention?.[0];
  const interestedReplies = (replies ?? []).filter((r: any) => r.reply_type === "interested").length;

  const AGENTS = [
    {
      id: "01", name: "Prospect harvester",
      trigger: "cron · every 30 min", color: "#0F6E56",
      lastRun: lastHarvest ? timeAgo(lastHarvest.run_at) : "No runs yet",
      status: lastHarvest?.error ? "error" : lastHarvest ? "success" : "pending",
      metrics: [
        { label: "Last run found",     value: `${lastHarvest?.leads_found ?? 0} leads` },
        { label: "Last run inserted",  value: `${lastHarvest?.leads_inserted ?? 0} new` },
        { label: "Last run duped",     value: `${lastHarvest?.leads_duped ?? 0} skipped` },
        { label: "Total harvested",    value: totalHarvested.toLocaleString() },
      ],
    },
    {
      id: "02", name: "Lead profiler",
      trigger: "event · on new lead", color: "#534AB7",
      lastRun: lastProfile ? timeAgo(lastProfile.profiled_at) : "No profiles yet",
      status: lastProfile ? "success" : "pending",
      metrics: [
        { label: "Leads profiled",  value: (profiles?.length ?? 0).toString() },
        { label: "Today (leads)",   value: todayLeads.toString() },
        { label: "Model",           value: "claude-sonnet-4" },
        { label: "10 frameworks",   value: "Cialdini, Kahneman…" },
      ],
    },
    {
      id: "03", name: "Outreach generator",
      trigger: "event · on profile complete", color: "#BA7517",
      lastRun: lastSequence ? timeAgo(lastSequence.created_at) : "No sequences yet",
      status: lastSequence ? "success" : "pending",
      metrics: [
        { label: "Sequences created", value: (sequences?.length ?? 0).toString() },
        { label: "Channels",          value: "Email + SMS + LinkedIn" },
        { label: "Emails per lead",   value: "3 (days 0, 3, 7)" },
        { label: "Model",             value: "claude-sonnet-4" },
      ],
    },
    {
      id: "04", name: "Follow-up sequencer",
      trigger: "cron · daily 8am", color: "#185FA5",
      lastRun: "Daily 8am",
      status: "active",
      metrics: [
        { label: "Monitors",   value: "sequence_steps table" },
        { label: "Channels",   value: "Instantly, Twilio, Expandi" },
        { label: "Frequency",  value: "Daily" },
        { label: "Stops on",   value: "Reply received" },
      ],
    },
    {
      id: "05", name: "Response handler",
      trigger: "event · on reply webhook", color: "#3B6D11",
      lastRun: lastReply ? timeAgo(lastReply.classified_at) : "No replies yet",
      status: lastReply ? "success" : "pending",
      metrics: [
        { label: "Total replies",    value: (replies?.length ?? 0).toString() },
        { label: "Interested",       value: interestedReplies.toString() },
        { label: "Interest rate",    value: replies?.length ? `${((interestedReplies / replies.length) * 100).toFixed(1)}%` : "—" },
        { label: "Books demo via",   value: "Calendly link" },
      ],
    },
    {
      id: "06", name: "Content engine",
      trigger: "cron · monday 9am", color: "#993556",
      lastRun: lastContent ? timeAgo(lastContent.created_at) : "No content yet",
      status: lastContent ? "success" : "pending",
      metrics: [
        { label: "Last vertical",  value: lastContent?.vertical ?? "—" },
        { label: "Last status",    value: lastContent?.status ?? "—" },
        { label: "Output",         value: "Blog + 5 LinkedIn + 2 cases" },
        { label: "Schedules via",  value: "Buffer API" },
      ],
    },
    {
      id: "07", name: "Metrics analyst",
      trigger: "cron · friday 5pm", color: "#993C1D",
      lastRun: "Friday 5pm",
      status: "active",
      metrics: [
        { label: "Reports to",    value: "Slack webhook" },
        { label: "Covers",        value: "Full pipeline metrics" },
        { label: "Generated by",  value: "Claude narrative" },
        { label: "Frequency",     value: "Weekly" },
      ],
    },
    {
      id: "08", name: "Retention agent",
      trigger: "cron · 1st of month", color: "#0C447C",
      lastRun: lastRetention ? timeAgo(lastRetention.created_at) : "No reports yet",
      status: lastRetention ? "success" : "pending",
      metrics: [
        { label: "Accounts scored",  value: (retention?.length ?? 0).toString() },
        { label: "At-risk",          value: (retention ?? []).filter((r: any) => r.health_status === "at_risk").length.toString() },
        { label: "Thriving",         value: (retention ?? []).filter((r: any) => r.health_status === "thriving").length.toString() },
        { label: "Sends via",        value: "Twilio SMS" },
      ],
    },
  ];

  const STATUS_ICON: Record<string, any> = {
    success: CheckCircle,
    error:   AlertCircle,
    pending: Clock,
    active:  Activity,
  };

  const STATUS_COLOR: Record<string, string> = {
    success: "text-teal-400",
    error:   "text-red-400",
    pending: "text-zinc-600",
    active:  "text-blue-400",
  };

  // Harvest log sparkline data (last 24 runs)
  const recentHarvests = (harvests ?? []).slice(0, 24).reverse();

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-base font-medium text-zinc-100">Agent monitor</h1>
        <p className="text-xs text-zinc-500 mt-0.5">All 8 agents · Trigger.dev · Claude API</p>
      </div>

      {/* Harvest activity bar */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-3">Agent 01 — harvest activity (last 48 runs)</p>
        <div className="flex items-end gap-0.5 h-12">
          {recentHarvests.map((h: any, i: number) => {
            const height = Math.max((h.leads_inserted / Math.max(...recentHarvests.map((x: any) => x.leads_inserted ?? 1), 1)) * 100, 5);
            return (
              <div
                key={i}
                title={`${h.leads_inserted} inserted · ${h.vertical} · ${h.city} · ${timeAgo(h.run_at)}`}
                className="flex-1 rounded-t-sm transition-all hover:opacity-80"
                style={{
                  height: `${height}%`,
                  background: h.error ? "#7f1d1d" : "#0F6E5640",
                  borderTop: `1.5px solid ${h.error ? "#ef4444" : "#0F6E56"}`,
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-zinc-700 font-mono">48 runs ago</span>
          <span className="text-[10px] text-zinc-700 font-mono">now</span>
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS.map(agent => {
          const StatusIcon = STATUS_ICON[agent.status];
          return (
            <div key={agent.id} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4" style={{ borderLeft: `3px solid ${agent.color}` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{agent.id} · {agent.name}</p>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{agent.trigger}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusIcon size={13} className={STATUS_COLOR[agent.status]} />
                  <span className="text-[11px] text-zinc-500 font-mono">{agent.lastRun}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {agent.metrics.map(m => (
                  <div key={m.label} className="bg-zinc-800/50 rounded p-2">
                    <p className="text-[10px] text-zinc-600 font-mono mb-0.5">{m.label}</p>
                    <p className="text-xs text-zinc-300 font-mono">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
