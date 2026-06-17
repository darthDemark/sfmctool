"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Play,
  Mail,
  Clock,
  GitBranch,
  Flag,
  MessageSquare,
} from "lucide-react";

type JourneyNodeData = {
  label: string;
  sub?: string;
  kind: "entry" | "email" | "wait" | "split" | "sms" | "exit";
  count?: number;
};

const kindMeta: Record<
  JourneyNodeData["kind"],
  { icon: typeof Mail; color: string; ring: string }
> = {
  entry: { icon: Play, color: "#10b981", ring: "rgba(16,185,129,0.4)" },
  email: { icon: Mail, color: "#4f8cff", ring: "rgba(79,140,255,0.4)" },
  wait: { icon: Clock, color: "#f59e0b", ring: "rgba(245,158,11,0.4)" },
  split: { icon: GitBranch, color: "#8b5cf6", ring: "rgba(139,92,246,0.4)" },
  sms: { icon: MessageSquare, color: "#22d3ee", ring: "rgba(34,211,238,0.4)" },
  exit: { icon: Flag, color: "#ef4444", ring: "rgba(239,68,68,0.4)" },
};

function JourneyNode({ data }: NodeProps) {
  const d = data as JourneyNodeData;
  const meta = kindMeta[d.kind];
  const Icon = meta.icon;
  return (
    <div
      className="w-44 rounded-xl border bg-[#131a22] px-3 py-2.5 shadow-lg"
      style={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.ring}` }}
    >
      {d.kind !== "entry" && (
        <Handle type="target" position={Position.Top} />
      )}
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
          style={{ background: `${meta.color}22`, color: meta.color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-[#f9fafb]">
            {d.label}
          </div>
          {d.sub && (
            <div className="truncate text-[11px] text-[#94a3b8]">{d.sub}</div>
          )}
        </div>
      </div>
      {typeof d.count === "number" && (
        <div className="mt-2 flex items-center justify-between rounded-md bg-[#0f172a] px-2 py-1 font-mono text-[11px]">
          <span className="text-[#94a3b8]">contacts</span>
          <span style={{ color: meta.color }}>{d.count.toLocaleString()}</span>
        </div>
      )}
      {d.kind !== "exit" && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
}

const nodeTypes = { journey: JourneyNode };

export function JourneyCanvas({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge({ ...c, animated: true }, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ animated: true }}
      className="bg-deep"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#1f2937"
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
