"use client";

import { useEffect, useState } from "react";
import { Menu, Zap } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <div className="hidden md:flex shrink-0">
        <Sidebar onNavigate={() => {}} />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[min(280px,85vw)] shadow-2xl">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="safe-top flex shrink-0 items-center justify-between border-b border-zinc-800/60 bg-zinc-900/95 px-4 py-3 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Zap size={14} className="text-zinc-950" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none text-zinc-100">AI Marketing</p>
              <p className="mt-0.5 text-[11px] leading-none text-zinc-500">Agent CRM</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 active:bg-zinc-800"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>

        <MobileNav onMoreClick={() => setMenuOpen(true)} />
      </div>
    </div>
  );
}
