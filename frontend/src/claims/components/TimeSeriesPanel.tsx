import type { TimeSeriesPoint, AnomalyAlert } from '../engine/types';

interface Props {
  timeSeries: TimeSeriesPoint[];
  anomalies: AnomalyAlert[];
}

function formatValue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(1);
}

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#C96A6A';
    case 'high':
      return '#D6A24A';
    case 'moderate':
      return '#4DB6D6';
    case 'low':
      return '#67B58A';
    default:
      return '#4DB6D6';
  }
}

function getSeverityBgColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-red-900/20 border-red-900/40';
    case 'high':
      return 'bg-amber-900/20 border-amber-900/40';
    case 'moderate':
      return 'bg-cyan-900/20 border-cyan-900/40';
    case 'low':
      return 'bg-green-900/20 border-green-900/40';
    default:
      return 'bg-cyan-900/20 border-cyan-900/40';
  }
}

export function TimeSeriesPanel(props: Props) {
  const { timeSeries, anomalies } = props;

  if (!timeSeries || timeSeries.length === 0) {
    return (
      <div className="rounded-lg border border-d-border bg-d-surface p-3 flex flex-col gap-3">
        <div className="text-[9px] font-mono text-d-muted tracking-widest">
          CLAIMS TIME SERIES
        </div>
        <div className="text-[11px] text-d-sub text-center py-8">
          No time series data available
        </div>
      </div>
    );
  }

  // Calculate bounds for scaling
  const allValues = timeSeries.flatMap(p => [p.value, p.predicted || p.value]).filter(v => v > 0);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;
  const padding = valueRange * 0.1;

  // SVG dimensions
  const svgWidth = 100;
  const svgHeight = 40;
  const margin = { top: 4, right: 4, bottom: 6, left: 12 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Scale functions
  const scaleX = (index: number) => (index / Math.max(1, timeSeries.length - 1)) * chartWidth;
  const scaleY = (value: number) => chartHeight - ((value - minValue + padding) / (valueRange + padding * 2)) * chartHeight;

  // Build polyline paths
  const valuePath = timeSeries
    .map((p, i) => `${margin.left + scaleX(i)},${margin.top + scaleY(p.value)}`)
    .join(' ');

  const predictedPath = timeSeries
    .map((p, i) => `${margin.left + scaleX(i)},${margin.top + scaleY(p.predicted || p.value)}`)
    .join(' ');

  // Find anomaly indices
  const anomalyIndices = new Set(
    timeSeries
      .map((p, i) => ({ index: i, isAnomaly: p.anomaly }))
      .filter(a => a.isAnomaly)
      .map(a => a.index)
  );

  // Y-axis labels
  const yLabels = [
    { value: minValue + padding, label: formatValue(minValue + padding) },
    { value: (minValue + maxValue) / 2, label: formatValue((minValue + maxValue) / 2) },
    { value: maxValue - padding, label: formatValue(maxValue - padding) },
  ];

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3 flex flex-col gap-3">
      {/* Header */}
      <div className="text-[9px] font-mono text-d-muted tracking-widest">
        CLAIMS TIME SERIES
      </div>

      {/* Chart */}
      <svg
        width="100%"
        height="160"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="bg-d-bg rounded"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <line
            key={`grid-${i}`}
            x1={margin.left}
            y1={margin.top + scaleY(label.value)}
            x2={svgWidth - margin.right}
            y2={margin.top + scaleY(label.value)}
            stroke="#39414C"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text
            key={`y-label-${i}`}
            x={margin.left - 2}
            y={margin.top + scaleY(label.value) + 1}
            fontSize="2.5"
            fill="#818B97"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {label.label}
          </text>
        ))}

        {/* Fill under value line */}
        <polygon
          points={`${margin.left},${margin.top + chartHeight} ${valuePath} ${svgWidth - margin.right},${margin.top + chartHeight}`}
          fill="#4DB6D6"
          opacity="0.05"
        />

        {/* Predicted line (dashed) */}
        <polyline
          points={predictedPath}
          fill="none"
          stroke="#5D8BFF"
          strokeWidth="0.8"
          strokeDasharray="1.5,1"
          opacity="0.7"
        />

        {/* Value line */}
        <polyline points={valuePath} fill="none" stroke="#4DB6D6" strokeWidth="1" />

        {/* Anomaly points with pulsing effect */}
        {Array.from(anomalyIndices).map(index => {
          const point = timeSeries[index];
          const x = margin.left + scaleX(index);
          const y = margin.top + scaleY(point.value);

          return (
            <g key={`anomaly-${index}`}>
              {/* Pulsing circles */}
              <circle cx={x} cy={y} r="1.2" fill="#C96A6A" opacity="0.8">
                <animate
                  attributeName="r"
                  values="1;1.8;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.2;0.8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={x} cy={y} r="0.8" fill="#C96A6A" />
            </g>
          );
        })}

        {/* Labels with vertical lines */}
        {timeSeries
          .map((p, i) => ({ index: i, label: p.label }))
          .filter(item => item.label)
          .map(({ index, label }) => {
            const x = margin.left + scaleX(index);
            const y = margin.top + scaleY(timeSeries[index].value);

            return (
              <g key={`label-${index}`}>
                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={margin.top + chartHeight + 2}
                  stroke="#39414C"
                  strokeWidth="0.4"
                />
                <text
                  x={x}
                  y={margin.top + chartHeight + 4}
                  fontSize="2"
                  fill="#AAB3BF"
                  textAnchor="middle"
                  dominantBaseline="hanging"
                >
                  {label}
                </text>
              </g>
            );
          })}

        {/* X-axis */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={svgWidth - margin.right}
          y2={margin.top + chartHeight}
          stroke="#39414C"
          strokeWidth="0.5"
        />
      </svg>

      {/* Anomalies Section */}
      {anomalies.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-mono text-d-muted tracking-widest">
            ANOMALIES DETECTED ({anomalies.length})
          </div>

          <div className="flex flex-col gap-2">
            {anomalies.map((anomaly, idx) => {
              const severityColor = getSeverityColor(anomaly.severity);
              const severityBgClass = getSeverityBgColor(anomaly.severity);

              return (
                <div
                  key={idx}
                  className={`border rounded px-2 py-1.5 flex items-start gap-2 ${severityBgClass}`}
                >
                  {/* Severity dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: severityColor }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[9px] font-mono font-bold uppercase tracking-wider"
                        style={{ color: severityColor }}
                      >
                        {anomaly.type}
                      </span>
                      {anomaly.deviation !== undefined && (
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: severityColor }}
                        >
                          {anomaly.deviation.toFixed(1)}σ
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-d-text mb-1 break-words">
                      {anomaly.description}
                    </p>

                    {/* Actual vs Expected */}
                    {(anomaly.actualValue !== undefined || anomaly.expectedValue !== undefined) && (
                      <div className="flex gap-3 text-[10px] text-d-sub">
                        {anomaly.actualValue !== undefined && (
                          <div>
                            <span className="text-d-muted">Actual:</span> {formatValue(anomaly.actualValue)}
                          </div>
                        )}
                        {anomaly.expectedValue !== undefined && (
                          <div>
                            <span className="text-d-muted">Expected:</span> {formatValue(anomaly.expectedValue)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
