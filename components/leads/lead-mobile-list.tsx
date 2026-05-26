import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, DISC_COLORS, INDUSTRY_LABELS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

interface Lead {
  id: string;
  name: string | null;
  company: string;
  industry: string | null;
  email: string | null;
  linkedin_url: string | null;
  score: number;
  status: string;
  source: string | null;
  created_at: string;
  lead_profiles: { disc: string } | null;
}

interface Props {
  leads: Lead[];
}

export function LeadMobileList({ leads }: Props) {
  if (leads.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-zinc-600 md:hidden">
        No leads match these filters
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800/40 md:hidden">
      {leads.map(lead => (
        <Link
          key={lead.id}
          href={`/leads/${lead.id}`}
          className="flex gap-3 px-4 py-3.5 active:bg-zinc-800/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800">
            <span className="text-xs font-medium text-zinc-400">
              {(lead.name ?? lead.company)?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-200">{lead.name ?? "—"}</p>
                <p className="truncate text-xs text-zinc-500">{lead.company}</p>
              </div>
              <span className="shrink-0 text-[11px] font-mono text-zinc-500">{lead.score}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${STATUS_COLORS[lead.status] ?? "bg-zinc-800 text-zinc-500"}`}>
                {STATUS_LABELS[lead.status] ?? lead.status}
              </span>
              {lead.lead_profiles?.disc && (
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium ${DISC_COLORS[lead.lead_profiles.disc]}`}>
                  {lead.lead_profiles.disc}
                </span>
              )}
              {lead.industry && (
                <span className="text-[10px] text-zinc-600">
                  {INDUSTRY_LABELS[lead.industry] ?? lead.industry}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600">{timeAgo(lead.created_at)}</span>
              {lead.linkedin_url && (
                <ExternalLink size={11} className="text-zinc-600" />
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
