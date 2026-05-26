import { createServiceClient } from "@/lib/supabase/server";
import { MRRChart } from "@/components/dashboard/mrr-chart";

export const revalidate = 60;

const MRR_TARGET = 40000;
const AVG_CONTRACT = 500;

export default async function MRRPage() {
  const db = createServiceClient();
  const { data: leads } = await db.from("leads").select("status").eq("status", "closed_won");

  const closedWon  = leads?.length ?? 0;
  const currentMRR = closedWon * AVG_CONTRACT;
  const mrrPct     = Math.min((currentMRR / MRR_TARGET) * 100, 100).toFixed(1);

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-base font-medium text-zinc-100">MRR tracker</h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">
          {closedWon} closed won · ${AVG_CONTRACT}/mo avg contract
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Current MRR</p>
            <p className="text-3xl font-medium text-zinc-100 mt-1">${currentMRR.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-medium text-teal-400">{mrrPct}%</p>
            <p className="text-xs text-zinc-500 mt-1">of $40k target</p>
          </div>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${mrrPct}%` }} />
        </div>
      </div>

      <MRRChart currentMRR={currentMRR} />
    </div>
  );
}
