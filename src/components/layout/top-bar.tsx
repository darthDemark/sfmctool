"use client";

import { Search, Bell, Command, Flame, Menu } from "lucide-react";
import { user } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function TopBar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-bg/80 px-4 backdrop-blur-md md:px-6">
      <button
        onClick={onMenuClick}
        className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-text md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight text-text">
          {title}
        </h1>
      </div>

      <div className="ml-auto hidden items-center gap-2 rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-muted lg:flex">
        <Search className="h-4 w-4" />
        <span>Search missions, labs, docs…</span>
        <kbd className="ml-6 flex items-center gap-0.5 rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[10px] text-muted">
          <Command className="h-3 w-3" />K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Badge tone="amber" className="hidden sm:inline-flex">
          <Flame className="h-3 w-3" />
          {user.streak} day streak
        </Badge>
        <button
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-text"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-electric to-violet text-sm font-bold text-white">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
