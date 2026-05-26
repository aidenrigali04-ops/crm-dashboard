import { createServiceClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";

export const revalidate = 60;

export default async function ContentPage() {
  const db = createServiceClient();
  const { data: items } = await db
    .from("content_library")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-base font-medium text-zinc-100">Content library</h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">{(items ?? []).length} items from content engine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(items ?? []).map((item: any) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-200">{item.vertical}</p>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-800 text-zinc-400">
                {item.status}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono mb-3">Week of {item.week_of}</p>
            {item.blog_post && (
              <p className="text-xs text-zinc-400 line-clamp-3">{item.blog_post.slice(0, 200)}…</p>
            )}
            <p className="text-[10px] text-zinc-600 font-mono mt-3">{timeAgo(item.created_at)}</p>
          </div>
        ))}
        {(items ?? []).length === 0 && (
          <p className="text-sm text-zinc-600 col-span-full text-center py-12">No content generated yet</p>
        )}
      </div>
    </div>
  );
}
