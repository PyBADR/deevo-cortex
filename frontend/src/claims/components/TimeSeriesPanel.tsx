// ============================================================================
// Time Series + Anomaly Alerts — COMPRESSED
// Single chart + top 3 anomalies only. No noise.
// ============================================================================

import type { TimeSeriesPoint, AnomalyAlert } from '../engine/types';

interface Props {
  timeSeries: TimeSeriesPoint[];
  anomalies: AnomalyAlert[];
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toFixed(0);
}

function sevColor(s: string): string {
  switch (s) {
    case 'critical': return '#C96A6A';
    case 'high': return '#D6A24A';
    case 'moderate': return '#4DB6D6';
    default: return '#67B58A';
  }
}

export function TimeSeriesPanel({ timeSeries, anomalies }: Props) {
  if (!timeSeries.length) return null;

  const values = timeSeries.flatMap(p => [p.value, p.predicted]).filter(v => v > 0);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const pad = range * 0.1;

  const W = 100, H = 32;
  const m = { t: 3, r: 3, b: 5, l: 10 };
  const cW = W - m.l - m.r;
  const cH = H - m.t - m.b;

  const sx = (i: number) => m.l + (i / Math.max(1, timeSeries.length - 1)) * cW;
  const sy = (v: number) => m.t + cH - ((v - minV + pad) / (range + pad * 2)) * cH;

  const valPath = timeSeries.map((p, i) => `${sx(i)},${sy(p.value)}`).join(' ');
  const predPath = timeSeries.map((p, i) => `${sx(i)},${sy(p.predicted)}`).join(' ');
  const anomalyPts = timeSeries.map((p, i) => ({ i, p })).filter(x => x.p.anomaly);

  // Top 3 anomalies only
  const topAnomalies = [...anomalies]
    .sort((a, b) => b.deviation - a.deviation)
    .slice(0, 3);

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3 flex flex-col gap-2">
      <div className="text-[9px] font-mono text-d-muted tracking-widest">CLAIMS TIME SERIES</div>

      {/* Chart */}
      <svg width="100%" height="140" viewBox={`0 0 ${W} ${H}`} className="bg-d-bg rounded" preserveAspectRatio="none">
        {/* Y labels */}
        {[minV + pad, (minV + maxV) / 2, maxV - pad].map((v, i) => (
          <text key={i} x={m.l - 1} y={sy(v) + 0.8} fontSize="2" fill="#818B97" textAnchor="end" dominantBaseline="middle" fontFamily="monospace">
            {fmt(v)}
          </text>
        ))}

        {/* Fill */}
        <polygon points={`${m.l},${m.t + cH} ${valPath} ${W - m.r},${m.t + cH}`} fill="#4DB6D6" opacity="0.05" />

        {/* Predicted (dashed) */}
        <polyline points={predPath} fill="none" stroke="#5D8BFF" strokeWidth="0.6" strokeDasharray="1.5,1" opacity="0.6" />

        {/* Actual */}
        <polyline points={valPath} fill="none" stroke="#4DB6D6" strokeWidth="0.8" />

        {/* Anomaly dots */}
        {anomalyPts.map(({ i, p }) => (
          <g key={i}>
            <circle cx={sx(i)} cy={sy(p.value)} r="1" fill="#C96A6A" opacity="0.8">
              <animate attributeName="r" values="0.8;1.5;0.8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={sx(i)} cy={sy(p.value)} r="0.5" fill="#C96A6A" />
          </g>
        ))}

        {/* Event labels */}
        {timeSeries.filter(p => p.label).map((p, idx) => {
          const i = timeSeries.indexOf(p);
          return (
            <g key={idx}>
              <line x1={sx(i)} y1={sy(p.value)} x2={sx(i)} y2={m.t + cH + 1.5} stroke="#39414C" strokeWidth="0.3" />
              <text x={sx(i)} y={m.t + cH + 3} fontSize="1.8" fill="#AAB3BF" textAnchor="middle" fontFamily="monospace">{p.label}</text>
            </g>
          );
        })}

        {/* X-axis */}
        <line x1={m.l} y1={m.t + cH} x2={W - m.r} y2={m.t + cH} stroke="#39414C" strokeWidth="0.3" />
      </svg>

      {/* Top 3 Anomalies */}
      {topAnomalies.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">TOP ANOMALIES</div>
          {topAnomalies.map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 rounded border border-d-border/20 bg-d-bg/40 px-2 py-1">
              <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: sevColor(a.severity) }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color: sevColor(a.severity) }}>
                    {a.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: sevColor(a.severity) }}>{a.deviation.toFixed(1)}σ</span>
                </div>
                <div className="text-[9px] text-d-sub line-clamp-1">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
