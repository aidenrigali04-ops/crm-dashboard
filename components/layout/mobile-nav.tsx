"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Bot, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/",       label: "Home",   icon: LayoutDashboard, match: (p: string) => p === "/" },
  { href: "/leads",  label: "Leads",  icon: Users,           match: (p: string) => p.startsWith("/leads") },
  { href: "/agents", label: "Agents", icon: Bot,             match: (p: string) => p.startsWith("/agents") },
];

interface Props {
  onMoreClick: () => void;
}

export function MobileNav({ onMoreClick }: Props) {
  const path = usePathname();

  const moreActive = !TABS.some(t => t.match(path));

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/60 bg-zinc-900/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(path);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-colors",
                active ? "text-teal-400" : "text-zinc-500 active:text-zinc-300"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMoreClick}
          className={cn(
            "flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-colors",
            moreActive ? "text-teal-400" : "text-zinc-500 active:text-zinc-300"
          )}
        >
          <MoreHorizontal size={20} strokeWidth={moreActive ? 2.25 : 1.75} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
