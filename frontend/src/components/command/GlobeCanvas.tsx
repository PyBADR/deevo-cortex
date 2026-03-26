import React, { useMemo } from 'react';
import { GraphSummaryData, Locale } from '../../types/ui';

interface GlobeCanvasProps {
  data: GraphSummaryData;
  locale: Locale;
}

const GCC_NODES = [
  { id: 'SA', label: 'Saudi Arabia', labelAr: 'السعودية', x: 180, y: 165 },
  { id: 'AE', label: 'UAE', labelAr: 'الإمارات', x: 310, y: 210 },
  { id: 'KW', label: 'Kuwait', labelAr: 'الكويت', x: 210, y: 80 },
  { id: 'QA', label: 'Qatar', labelAr: 'قطر', x: 285, y: 155 },
  { id: 'BH', label: 'Bahrain', labelAr: 'البحرين', x: 265, y: 120 },
  { id: 'OM', label: 'Oman', labelAr: 'عمان', x: 355, y: 250 },
];

const GCC_EDGES = [
  ['SA', 'AE'], ['SA', 'KW'], ['SA', 'QA'], ['SA', 'BH'],
  ['AE', 'QA'], ['AE', 'OM'], ['KW', 'BH'], ['QA', 'BH'],
];

export const GlobeCanvas: React.FC<GlobeCanvasProps> = ({ data, locale }) => {
  const nodeDetails = useMemo(() => {
    const map: Record<string, { pressure: number; severity_score: number }> = {};
    (data.node_details || []).forEach((n) => {
      map[n.id.toUpperCase()] = n;
    });
    return map;
  }, [data.node_details]);

  const intensity = data.max_intensity ?? 0.5;

  return (
    <div className="h-full flex flex-col bg-d-shell border border-d-border/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-d-border/30">
        <h2 className="font-mono text-xs font-bold text-d-cyan uppercase tracking-[0.2em]">
          {locale === 'ar' ? 'شبكة استخبارات الخليج' : 'GCC Intelligence Network'}
        </h2>
        <div className="flex gap-4 text-[10px] font-mono text-d-muted">
          <span>{data.active_nodes} nodes</span>
          <span>{data.traversed_edges} edges</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 flex items-center justify-center p-4" style={{ minHeight: 320 }}>
        <svg viewBox="0 0 450 320" className="w-full h-full max-w-[450px]">
          {/* Clean flat background — no filters, no glow */}

          {/* Edges */}
          {GCC_EDGES.map(([fromId, toId], idx) => {
            const from = GCC_NODES.find((n) => n.id === fromId)!;
            const to = GCC_NODES.find((n) => n.id === toId)!;
            return (
              <line
                key={idx}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="#4DB6D6"
                strokeWidth="1"
                opacity={0.15 + intensity * 0.2}
              />
            );
          })}

          {/* Nodes */}
          {GCC_NODES.map((node) => {
            const detail = nodeDetails[node.id];
            const pressure = detail?.pressure ?? 0.3;
            const r = 6 + pressure * 8;
            return (
              <g key={node.id}>
                {/* Outer pulse */}
                <circle cx={node.x} cy={node.y} r={r + 8} fill="none" stroke="#4DB6D6" strokeWidth="0.5" opacity={0.15}>
                  <animate attributeName="r" from={r + 4} to={r + 14} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.2" to="0" dur="3s" repeatCount="indefinite" />
                </circle>
                {/* Node */}
                <circle cx={node.x} cy={node.y} r={r} fill="#4DB6D6" opacity={0.7 + pressure * 0.3} />
                {/* Label */}
                <text x={node.x} y={node.y + r + 14} textAnchor="middle" fill="#AAB3BF" fontSize="10" fontFamily="monospace">
                  {locale === 'ar' ? node.labelAr : node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 border-t border-d-border/30">
        {[
          { label: locale === 'ar' ? 'العقد' : 'Nodes', value: data.active_nodes },
          { label: locale === 'ar' ? 'الروابط' : 'Edges', value: data.traversed_edges },
          { label: locale === 'ar' ? 'الشدة' : 'Intensity', value: (intensity * 100).toFixed(0) + '%' },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-3 text-center">
            <div className="text-lg font-mono font-bold text-d-cyan">{stat.value}</div>
            <div className="text-[10px] font-mono text-d-muted uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
