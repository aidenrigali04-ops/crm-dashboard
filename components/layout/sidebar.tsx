"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, GitBranch, Mail,
  FileText, Bot, Settings, Zap, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/leads",     label: "Leads",      icon: Users },
  { href: "/pipeline",  label: "Pipeline",   icon: GitBranch },
  { href: "/outreach",  label: "Outreach",   icon: Mail },
  { href: "/content",   label: "Content",    icon: FileText },
  { href: "/agents",    label: "Agents",     icon: Bot },
];

const BOTTOM = [
  { href: "/mrr",       label: "MRR tracker", icon: TrendingUp },
  { href: "/settings",  label: "Settings",    icon: Settings },
];

interface Props {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: Props) {
  const path = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-zinc-800/60 bg-zinc-900 md:h-screen">
      <div className="border-b border-zinc-800/60 px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal-500">
            <Zap size={13} className="text-zinc-950" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none text-zinc-100">AI Marketing</p>
            <p className="mt-0.5 text-[11px] leading-none text-zinc-500">Agent CRM</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          Command
        </p>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-[44px] items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              path === href || (href !== "/" && path.startsWith(href))
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 active:bg-zinc-800/60 active:text-zinc-200"
            )}
          >
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-zinc-800/60 px-2 py-3">
        {BOTTOM.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-[44px] items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              path === href
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 active:bg-zinc-800/60 active:text-zinc-200"
            )}
          >
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
