import { createServiceClient } from "@/lib/supabase/server";
import { PipelineFunnel } from "@/components/dashboard/pipeline-funnel";

export const revalidate = 60;

const STATUS_ORDER = [
  "pending_profile", "profiled", "outreach_ready",
  "in_sequence", "replied", "demo_booked", "closed_won",
];

export default async function PipelinePage() {
  const db = createServiceClient();
  const { data: leads } = await db.from("leads").select("status");

  const statusCounts = (leads ?? []).reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  const total = leads?.length ?? 0;

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-base font-medium text-zinc-100">Pipeline</h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">{total.toLocaleString()} leads across all stages</p>
      </div>
      <PipelineFunnel statusCounts={statusCounts} statusOrder={STATUS_ORDER} total={total} />
    </div>
  );
}
