"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, user } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/lib/progress";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { stats, hydrated } = useProgress();

  return (
    <div className="flex h-full flex-col bg-panel/60">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-5 py-5"
        onClick={onNavigate}
      >
        <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary shadow-lg shadow-blue/30">
          <span className="font-mono text-sm font-bold text-white">{"</>"}</span>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight">SFMC Labs</div>
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Ops Center
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Operations
        </div>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/" &&
              pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-electric/10 text-text"
                  : "text-text-secondary hover:bg-card hover:text-text"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 h-5 w-0.5 rounded-r-full transition-all",
                  active ? "bg-electric" : "bg-transparent"
                )}
              />
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active
                    ? "text-electric"
                    : "text-muted group-hover:text-text-secondary"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge tone="red" className="px-1.5 py-0 text-[9px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-electric to-violet text-sm font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold text-text">
              {user.name}
            </div>
            <div className="truncate text-[11px] text-muted">{user.role}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-lg border border-line bg-deep/60 px-3 py-1.5">
          <span className="text-[11px] font-medium text-muted">XP</span>
          <span className="font-mono text-xs font-semibold text-cyan">
            {hydrated ? stats.xp.toLocaleString() : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
