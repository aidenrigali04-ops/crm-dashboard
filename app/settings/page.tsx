export default function SettingsPage() {
  const configured = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", set: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { key: "SUPABASE_SERVICE_ROLE_KEY", set: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { key: "ANTHROPIC_API_KEY", set: !!process.env.ANTHROPIC_API_KEY },
  ];

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-base font-medium text-zinc-100">Settings</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Environment configuration status</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800/60">
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Environment variables</p>
        </div>
        <div className="divide-y divide-zinc-800/40">
          {configured.map(({ key, set }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-zinc-300 font-mono">{key}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${set ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
                {set ? "configured" : "missing"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-600 leading-relaxed">
        Copy <code className="text-zinc-400">.env.example</code> to <code className="text-zinc-400">.env.local</code> and fill in your Supabase and Anthropic keys to connect the CRM to your database and AI assistant.
      </p>
    </div>
  );
}
