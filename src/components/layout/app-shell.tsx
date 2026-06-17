"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { cn } from "@/lib/utils";

export function AppShell({
  title,
  children,
  rightRail,
}: {
  title: string;
  children: React.ReactNode;
  rightRail?: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-line bg-bg">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-lg border border-line text-muted"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />
        <div className="flex min-h-0 flex-1">
          <main
            className={cn(
              "min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8",
              rightRail && "xl:border-r xl:border-line"
            )}
          >
            {children}
          </main>
          {rightRail && (
            <aside className="hidden w-80 shrink-0 px-5 py-6 xl:block">
              {rightRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
