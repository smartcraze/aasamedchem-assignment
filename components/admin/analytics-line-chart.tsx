"use client";

interface LineChartData {
  label: string;
  value: number;
}

interface AnalyticsLineChartProps {
  data: LineChartData[];
  title: string;
}

export function AnalyticsLineChart({ data, title }: AnalyticsLineChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const height = 150;
  const width = 500;
  const padding = 20;

  // Calculate points
  const points = data.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (d.value * (height - padding * 2)) / maxVal;
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden shadow-sm">
      <h3 className="font-serif text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * (height - padding * 2);
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="var(--border)"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area under line */}
          {areaD && <path d={areaD} fill="url(#chart-area-grad)" />}

          {/* Line Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} className="group/dot cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-card stroke-primary stroke-2 transition-all duration-150 group-hover/dot:r-6"
              />
              <title>{`${data[i].label}: ₹${Number(data[i].value).toLocaleString()}`}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] text-muted-foreground font-mono">
        {data.map((d, i) => (
          <span key={i} className="text-center w-full truncate px-1">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
