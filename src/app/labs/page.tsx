import { FlaskConical } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { LabCard } from "@/components/labs/lab-card";
import { Badge } from "@/components/ui/badge";
import { labs, automationLab } from "@/lib/data";

export default function LabsPage() {
  const allLabs = [...labs.slice(0, 3), automationLab, labs[3]];

  return (
    <AppShell title="Labs">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-blue/10 via-card to-violet/10 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/15 text-electric">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Training Labs</h2>
              <p className="text-sm text-muted">
                Pick a discipline and run live missions in the simulator.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="blue">5 labs</Badge>
            <Badge tone="green">53 missions</Badge>
            <Badge tone="violet">Architect feedback</Badge>
            <Badge tone="amber">XP &amp; scoring</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {allLabs.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
