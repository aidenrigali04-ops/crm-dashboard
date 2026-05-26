"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useState } from "react";

const STATUSES = [
  "pending_profile", "profiled", "outreach_ready", "in_sequence",
  "replied", "demo_booked", "closed_won", "closed_lost", "unsubscribed",
];

const INDUSTRIES = [
  "hvac", "landscaping", "construction", "property_mgmt",
  "plumbing", "real_estate", "agency",
];

const SOURCES  = ["apollo", "clay", "vibe_prospecting", "manual", "csv"];
const DISC     = ["D", "I", "S", "C"];

const LABELS: Record<string, string> = {
  pending_profile: "Pending",   profiled: "Profiled",
  outreach_ready:  "Ready",     in_sequence: "In sequence",
  replied:         "Replied",   demo_booked: "Demo booked",
  closed_won:      "Won",       closed_lost: "Lost",
  unsubscribed:    "Unsub",     hvac: "HVAC",
  landscaping:     "Landscaping", construction: "Construction",
  property_mgmt:   "Prop mgmt", plumbing: "Plumbing",
  real_estate:     "Real estate", agency: "Agency",
  apollo:          "Apollo",    clay: "Clay",
  vibe_prospecting: "Vibe",     manual: "Manual",
  csv:             "CSV",
};

const selectClass =
  "h-10 w-full min-w-0 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 text-sm text-zinc-300 focus:border-teal-500/50 focus:outline-none md:h-7 md:w-auto md:rounded md:px-2 md:text-xs";

interface Props {
  currentParams: Record<string, string | undefined>;
}

export function LeadFilters({ currentParams }: Props) {
  const router = useRouter();
  const sp     = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/leads?${params.toString()}`);
  }, [sp, router]);

  const clear = () => router.push("/leads");

  const hasFilters = !!(currentParams.status || currentParams.disc ||
    currentParams.industry || currentParams.source || currentParams.search || currentParams.min_score);

  const activeFilterCount = [
    currentParams.status,
    currentParams.disc,
    currentParams.industry,
    currentParams.source,
    currentParams.min_score,
  ].filter(Boolean).length;

  return (
    <div className="shrink-0 border-b border-zinc-800/60 bg-zinc-900/50">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="relative min-w-0 flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Search name, company..."
            defaultValue={currentParams.search ?? ""}
            onChange={e => update("search", e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-700/60 bg-zinc-800 pl-9 pr-3 text-base text-zinc-200 placeholder-zinc-600 focus:border-teal-500/50 focus:outline-none md:h-7 md:rounded md:text-xs"
          />
        </div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 text-xs text-zinc-300 active:bg-zinc-800 md:hidden"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-mono text-teal-400">
              {activeFilterCount}
            </span>
          )}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <div className={`px-4 pb-3 md:px-4 md:py-2.5 ${expanded ? "block" : "hidden md:block"}`}>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          <select
            value={currentParams.status ?? ""}
            onChange={e => update("status", e.target.value)}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{LABELS[s] ?? s}</option>)}
          </select>

          <select
            value={currentParams.disc ?? ""}
            onChange={e => update("disc", e.target.value)}
            className={selectClass}
          >
            <option value="">All DISC</option>
            {DISC.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={currentParams.industry ?? ""}
            onChange={e => update("industry", e.target.value)}
            className={selectClass}
          >
            <option value="">All industries</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{LABELS[i] ?? i}</option>)}
          </select>

          <select
            value={currentParams.source ?? ""}
            onChange={e => update("source", e.target.value)}
            className={selectClass}
          >
            <option value="">All sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{LABELS[s] ?? s}</option>)}
          </select>

          <select
            value={currentParams.min_score ?? ""}
            onChange={e => update("min_score", e.target.value)}
            className={selectClass}
          >
            <option value="">Any score</option>
            <option value="40">≥ 40</option>
            <option value="60">≥ 60</option>
            <option value="75">≥ 75</option>
            <option value="90">≥ 90</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="h-10 rounded-lg border border-zinc-700/60 px-3 text-xs text-zinc-400 active:bg-zinc-800 md:h-7 md:rounded"
            >
              Clear
            </button>
          )}

          <div className="hidden items-center gap-1.5 text-zinc-600 md:ml-auto md:flex">
            <SlidersHorizontal size={11} />
            <span className="text-[10px] font-mono">Filters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
