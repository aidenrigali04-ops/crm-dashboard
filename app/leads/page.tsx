import { createServiceClient } from "@/lib/supabase/server";
import { STATUS_LABELS, STATUS_COLORS, DISC_COLORS, INDUSTRY_LABELS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadRow } from "@/components/leads/lead-row";
import { LeadMobileList } from "@/components/leads/lead-mobile-list";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface SearchParams {
  status?:   string;
  disc?:     string;
  industry?: string;
  source?:   string;
  min_score?: string;
  search?:   string;
  page?:     string;
}

const PAGE_SIZE = 50;

async function getLeads(params: SearchParams) {
  const db   = createServiceClient();
  const page = parseInt(params.page ?? "1") - 1;

  let query = db
    .from("leads")
    .select("*, lead_profiles(disc, awareness_level, primary_fear)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (params.status)   query = query.eq("status", params.status);
  if (params.industry) query = query.eq("industry", params.industry);
  if (params.source)   query = query.eq("source", params.source);
  if (params.disc)     query = query.eq("lead_profiles.disc", params.disc);
  if (params.min_score) query = query.gte("score", parseInt(params.min_score));
  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,company.ilike.%${params.search}%,email.ilike.%${params.search}%`
    );
  }

  return query;
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { data: leads, count } = await getLeads(searchParams);
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const currentPage = parseInt(searchParams.page ?? "1");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-zinc-800/60 px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-base font-medium text-zinc-100">Leads</h1>
          <p className="mt-0.5 font-mono text-xs text-zinc-500">{count?.toLocaleString()} total</p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-12 border-b border-zinc-800/60 bg-zinc-900/50" />}>
        <LeadFilters currentParams={searchParams as Record<string, string | undefined>} />
      </Suspense>

      <LeadMobileList leads={leads ?? []} />

      {/* Desktop table */}
      <div className="hidden flex-1 overflow-auto md:block">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800/60">
            <tr>
              {["Name", "Company", "Industry", "DISC", "Score", "Status", "Source", "Created"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {(leads ?? []).map((lead: any) => (
              <LeadRow key={lead.id} leadId={lead.id}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-zinc-400">
                        {(lead.name ?? lead.company)?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-zinc-200 text-xs font-medium">{lead.name ?? "—"}</p>
                      {lead.email && (
                        <p className="text-[10px] text-zinc-600 font-mono">{lead.email}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-300">{lead.company}</span>
                    {lead.linkedin_url && (
                      <a
                        href={lead.linkedin_url}
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        className="text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  {lead.company_size && (
                    <p className="text-[10px] text-zinc-600 font-mono">{lead.company_size} emp</p>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs text-zinc-400">
                    {INDUSTRY_LABELS[lead.industry] ?? lead.industry ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  {lead.lead_profiles?.disc ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${DISC_COLORS[lead.lead_profiles.disc]}`}>
                      {lead.lead_profiles.disc}
                    </span>
                  ) : (
                    <span className="text-zinc-700 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.min(lead.score, 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">{lead.score}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${STATUS_COLORS[lead.status] ?? "bg-zinc-800 text-zinc-500"}`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[11px] text-zinc-500 font-mono">{lead.source ?? "—"}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[11px] text-zinc-600 font-mono">{timeAgo(lead.created_at)}</span>
                </td>
              </LeadRow>
            ))}
          </tbody>
        </table>

        {(leads ?? []).length === 0 && (
          <div className="hidden h-48 items-center justify-center text-sm text-zinc-600 md:flex">
            No leads match these filters
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-zinc-800/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-zinc-500 font-mono">
            Page {currentPage} of {totalPages} · {count?.toLocaleString()} leads
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <a href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) })}`}
                className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors">
                Previous
              </a>
            )}
            {currentPage < totalPages && (
              <a href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) })}`}
                className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors">
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
