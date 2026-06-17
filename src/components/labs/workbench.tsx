import { cn } from "@/lib/utils";

export function Workbench({
  left,
  center,
  right,
  bottom,
  centerLabel,
  centerActions,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  bottom: React.ReactNode;
  centerLabel?: string;
  centerActions?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left brief */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
          {left}
        </div>

        {/* Center editor */}
        <div className="flex h-[460px] flex-col overflow-hidden rounded-xl border border-line bg-deep lg:col-span-6">
          {centerLabel && (
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <span className="font-mono text-xs text-muted">{centerLabel}</span>
              {centerActions}
            </div>
          )}
          <div className="min-h-0 flex-1">{center}</div>
        </div>

        {/* Right inspector */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
          {right}
        </div>
      </div>

      {/* Bottom panels */}
      <div className={cn("grid gap-4")}>{bottom}</div>
    </div>
  );
}

export function InspectorPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        {icon}
        <h3 className="text-sm font-semibold text-text">{title}</h3>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}
