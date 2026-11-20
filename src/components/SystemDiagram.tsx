"use client";

import { useEffect, useId, useState } from "react";
import { ArrowDown } from "lucide-react";
import type { DiagramEdge, DiagramNode, ProjectItem } from "@/data/portfolio";

export interface SystemDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  accent?: ProjectItem["accent"];
}

const STROKE_COLORS: Record<NonNullable<SystemDiagramProps["accent"]>, string> = {
  cyan: "#2dd4bf",
  amber: "#facc15",
  coral: "#fb7185",
};

const TEXT_CLASSES: Record<NonNullable<SystemDiagramProps["accent"]>, string> = {
  cyan: "text-[#2dd4bf] border-[#2dd4bf]",
  amber: "text-[#facc15] border-[#facc15]",
  coral: "text-[#fb7185] border-[#fb7185]",
};

function wrapLabel(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";

  const pushLongToken = (token: string) => {
    for (let i = 0; i < token.length; i += maxChars) {
      lines.push(token.slice(i, i + maxChars));
    }
  };

  for (const word of words) {
    if (word.length > maxChars) {
      if (current) {
        lines.push(current);
        current = "";
      }
      pushLongToken(word);
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export default function SystemDiagram({
  nodes,
  edges,
  accent = "cyan",
}: SystemDiagramProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, "");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!nodes || nodes.length === 0) {
    return null;
  }

  const stroke = STROKE_COLORS[accent];
  const nodeWidth = 228;
  const gap = 108;
  const paddingX = 20;
  const topY = 28;

  const wrappedNodes = nodes.map((node) => ({
    ...node,
    labelLines: wrapLabel(node.label, 22),
    detailLines: node.detail ? wrapLabel(node.detail, 25) : [],
  }));

  const maxLineCount = Math.max(
    2,
    ...wrappedNodes.map(
      (n) => n.labelLines.length + (n.detailLines.length > 0 ? n.detailLines.length : 0)
    )
  );
  const nodeHeight = Math.max(76, 36 + maxLineCount * 14);
  const nodeIndexById = new Map(nodes.map((node, index) => [node.id, index]));

  const hasNonAdjacentEdge = edges.some((edge) => {
    const fromIdx = nodeIndexById.get(edge.from);
    const toIdx = nodeIndexById.get(edge.to);
    return (
      fromIdx !== undefined &&
      toIdx !== undefined &&
      toIdx !== fromIdx + 1
    );
  });

  const totalWidth =
    nodes.length * nodeWidth + Math.max(0, nodes.length - 1) * gap + paddingX * 2;
  const svgHeight = topY + nodeHeight + (hasNonAdjacentEdge ? 76 : 28);

  return (
    <div className="border-2 border-slate-700 bg-[#0d1017] p-4">
      <div className="font-mono-tech mb-3 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-slate-400">
        <span>
          Topology // {nodes.length} Node{nodes.length === 1 ? "" : "s"} •{" "}
          {edges.length} Edge{edges.length === 1 ? "" : "s"}
        </span>
        {nodes.length > 4 && (
          <span className="hidden text-slate-400 md:inline">
            ← Scroll horizontally to inspect full pipeline →
          </span>
        )}
      </div>

      {/* Mobile vertical pipeline (zero label clipping, zero cramped horizontal scroll) */}
      <div className="space-y-2 md:hidden">
        {nodes.map((node, index) => {
          const nextNode = nodes[index + 1];
          const edgeToNext = nextNode
            ? edges.find((e) => e.from === node.id && e.to === nextNode.id)
            : undefined;
          const badge = String(index + 1).padStart(2, "0");

          return (
            <div key={node.id} className="space-y-2">
              <div
                className={`border-2 bg-[#141923] p-3 shadow-[3px_3px_0px_#000000] ${TEXT_CLASSES[accent].split(" ")[1]}`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`font-mono-tech mt-0.5 shrink-0 text-[10px] font-bold ${TEXT_CLASSES[accent].split(" ")[0]}`}
                  >
                    {badge}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono-tech break-words text-xs font-semibold text-slate-100">
                      {node.label}
                    </p>
                    {node.detail && (
                      <p className="font-mono-tech mt-1 break-words text-[11px] text-slate-400">
                        {node.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {nextNode && (
                <div className="flex items-center justify-center gap-2 py-0.5">
                  <ArrowDown
                    className={`h-4 w-4 ${TEXT_CLASSES[accent].split(" ")[0]}`}
                    aria-hidden="true"
                  />
                  {edgeToNext?.label && (
                    <span className="font-mono-tech border border-slate-700 bg-[#141923] px-2 py-0.5 text-[10px] text-slate-300">
                      {edgeToNext.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tablet/Desktop horizontal SVG architecture diagram */}
      <div className="hidden overflow-x-auto md:block">
        <svg
          viewBox={`0 0 ${totalWidth} ${svgHeight}`}
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="System Architecture Dataflow Diagram"
        >
          <defs>
            <marker
              id={`arrow-${uid}`}
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L9,3 z" fill={stroke} />
            </marker>
          </defs>

          {edges.map((edge, edgeIdx) => {
            const fromIdx = nodeIndexById.get(edge.from);
            const toIdx = nodeIndexById.get(edge.to);
            if (fromIdx === undefined || toIdx === undefined) return null;

            const pathId = `edge-${uid}-${edgeIdx}`;
            const isSequential = toIdx === fromIdx + 1;

            let pathD: string;
            let labelX: number;
            let anchorY: number;

            if (isSequential) {
              const x1 = paddingX + fromIdx * (nodeWidth + gap) + nodeWidth;
              const x2 = paddingX + toIdx * (nodeWidth + gap) - 4;
              const yMid = topY + nodeHeight / 2;
              pathD = `M ${x1} ${yMid} L ${x2} ${yMid}`;
              labelX = (x1 + x2) / 2;
              anchorY = yMid - 7;
            } else {
              const x1 = paddingX + fromIdx * (nodeWidth + gap) + nodeWidth / 2;
              const x2 = paddingX + toIdx * (nodeWidth + gap) + nodeWidth / 2;
              const yStart = topY + nodeHeight;
              const yArc = yStart + 38 + (edgeIdx % 2) * 14;
              pathD = `M ${x1} ${yStart} L ${x1} ${yArc} L ${x2} ${yArc} L ${x2} ${yStart + 4}`;
              labelX = (x1 + x2) / 2;
              anchorY = yArc - 5;
            }

            const edgeLines = edge.label ? wrapLabel(edge.label, 14) : [];
            const maxEdgeLineLen = edgeLines.reduce(
              (max, line) => Math.max(max, line.length),
              0
            );
            const edgeLineHeight = 11;
            const pillWidth =
              edgeLines.length > 0
                ? Math.max(54, maxEdgeLineLen * 6.4 + 14)
                : 0;
            const pillHeight =
              edgeLines.length > 0 ? edgeLines.length * edgeLineHeight + 6 : 0;
            const pillY = Math.max(2, anchorY - pillHeight);

            return (
              <g key={`${edge.from}-${edge.to}-${edgeIdx}`}>
                <path
                  id={pathId}
                  d={pathD}
                  stroke={stroke}
                  strokeWidth="2"
                  fill="none"
                  markerEnd={`url(#arrow-${uid})`}
                />

                {!prefersReducedMotion && (
                  <circle r="3.5" fill={stroke} className="motion-reduce:hidden">
                    <animateMotion
                      dur="1.7s"
                      repeatCount="indefinite"
                      begin={`${edgeIdx * 0.35}s`}
                    >
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </circle>
                )}

                {edgeLines.length > 0 && (
                  <g>
                    <rect
                      x={labelX - pillWidth / 2}
                      y={pillY}
                      width={pillWidth}
                      height={pillHeight}
                      fill="#0d1017"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x={labelX}
                      y={pillY + 11.5}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      {edgeLines.map((line, lineIdx) => (
                        <tspan
                          key={lineIdx}
                          x={labelX}
                          dy={lineIdx === 0 ? 0 : edgeLineHeight}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {wrappedNodes.map((node, index) => {
            const x = paddingX + index * (nodeWidth + gap);
            const y = topY;
            const badge = String(index + 1).padStart(2, "0");
            const totalTextLines = node.labelLines.length + node.detailLines.length;
            const startY =
              y + Math.max(36, (nodeHeight - totalTextLines * 14) / 2 + 12);

            return (
              <g key={node.id}>
                <rect
                  x={x + 4}
                  y={y + 4}
                  width={nodeWidth}
                  height={nodeHeight}
                  fill="#000000"
                />
                <rect
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  fill="#141923"
                  stroke={stroke}
                  strokeWidth="2"
                />
                <text
                  x={x + 10}
                  y={y + 16}
                  fill={stroke}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {badge}
                </text>

                {node.labelLines.map((line, lineIdx) => (
                  <text
                    key={`lbl-${lineIdx}`}
                    x={x + nodeWidth / 2}
                    y={startY + lineIdx * 14}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {line}
                  </text>
                ))}

                {node.detailLines.map((line, detailIdx) => (
                  <text
                    key={`dtl-${detailIdx}`}
                    x={x + nodeWidth / 2}
                    y={startY + (node.labelLines.length + detailIdx) * 14}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
