"use client";

import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  Handle,
  Position,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeMouseHandler,
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
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type JourneyNodeKind =
  | "entry"
  | "email"
  | "wait"
  | "split"
  | "sms"
  | "exit";

export type JourneyNodeData = {
  label: string;
  sub?: string;
  kind: JourneyNodeKind;
  count?: number;
  active?: boolean;
  revealed?: boolean;
  selected?: boolean;
  dim?: boolean;
};

const kindMeta: Record<
  JourneyNodeKind,
  { icon: typeof Mail; color: string; ring: string; glow: string }
> = {
  entry: { icon: Play, color: "#10b981", ring: "rgba(16,185,129,0.5)", glow: "rgba(16,185,129,0.55)" },
  email: { icon: Mail, color: "#4f8cff", ring: "rgba(79,140,255,0.5)", glow: "rgba(79,140,255,0.55)" },
  wait: { icon: Clock, color: "#f59e0b", ring: "rgba(245,158,11,0.5)", glow: "rgba(245,158,11,0.55)" },
  split: { icon: GitBranch, color: "#8b5cf6", ring: "rgba(139,92,246,0.5)", glow: "rgba(139,92,246,0.55)" },
  sms: { icon: MessageSquare, color: "#22d3ee", ring: "rgba(34,211,238,0.5)", glow: "rgba(34,211,238,0.55)" },
  exit: { icon: Flag, color: "#ef4444", ring: "rgba(239,68,68,0.5)", glow: "rgba(239,68,68,0.55)" },
};

function JourneyNode({ data }: NodeProps) {
  const d = data as JourneyNodeData;
  const meta = kindMeta[d.kind];
  const Icon = meta.icon;
  const style: CSSProperties = {
    borderColor: meta.color,
    boxShadow: d.selected
      ? `0 0 0 2px ${meta.color}`
      : `0 0 0 1px ${meta.ring}`,
    ["--jb-ring" as string]: meta.ring,
    ["--jb-glow" as string]: meta.glow,
    opacity: d.dim ? 0.4 : 1,
  };
  return (
    <div
      className={cn(
        "w-44 cursor-pointer rounded-xl border bg-[#131a22] px-3 py-2.5 shadow-lg transition-opacity",
        d.active && "jb-node-active"
      )}
      style={style}
    >
      {d.kind !== "entry" && <Handle type="target" position={Position.Top} />}
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
      {typeof d.count === "number" && d.revealed && (
        <div className="jb-reveal mt-2 flex items-center justify-between rounded-md bg-[#0f172a] px-2 py-1 font-mono text-[11px]">
          <span className="text-[#94a3b8]">contacts</span>
          <span style={{ color: meta.color }}>{d.count.toLocaleString()}</span>
        </div>
      )}
      {d.kind !== "exit" && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}

type JourneyEdgeData = {
  active?: boolean;
  label?: string;
  color?: string;
};

function ContactEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });
  const d = (data ?? {}) as JourneyEdgeData;
  const color = d.color ?? "#4f8cff";
  const active = !!d.active;
  const pathId = `edge-${id}`;

  return (
    <>
      <path
        id={pathId}
        d={edgePath}
        fill="none"
        stroke={active ? color : "#334155"}
        strokeWidth={active ? 2.5 : 1.5}
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        style={active ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined}
      />
      {active &&
        [0, 0.45, 0.9].map((begin, i) => (
          <circle key={i} r={3.4} fill={color}>
            <animateMotion
              dur="1.4s"
              begin={`${begin}s`}
              repeatCount="indefinite"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        ))}
      {d.label && (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-none absolute rounded-md border border-line bg-[#0f172a] px-1.5 py-0.5 font-mono text-[10px]"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              color: active ? color : "#94a3b8",
              borderColor: active ? color : "#1f2937",
            }}
          >
            {d.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const nodeTypes = { journey: JourneyNode };
const edgeTypes = { contact: ContactEdge };

export function JourneyCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onNodeClick?: NodeMouseHandler;
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      proOptions={{ hideAttribution: true }}
      className="bg-deep"
      nodesDraggable
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
