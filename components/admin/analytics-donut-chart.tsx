"use client";

interface DonutSegment {
  name: string;
  count: number;
  color: string;
}

interface AnalyticsDonutChartProps {
  segments: DonutSegment[];
  title: string;
}

export function AnalyticsDonutChart({ segments, title }: AnalyticsDonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const size = 120;
  const radius = 40;
  const strokeWidth = 14;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm">
      <div className="relative w-[120px] h-[120px] shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 w-full h-full">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeOpacity="0.2"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            segments.map((seg, idx) => {
              if (seg.count === 0) return null;
              const percent = seg.count / total;
              const strokeLength = percent * circumference;
              const strokeOffset = circumference - (accumulatedPercent * circumference);
              accumulatedPercent += percent;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 hover:stroke-[16px] cursor-pointer"
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-foreground font-mono">{total}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Orders</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 w-full">
        <h3 className="font-serif text-sm font-semibold text-foreground text-center md:text-left">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 pt-1">
          {segments.map((seg, idx) => {
            const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
            return (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-muted-foreground capitalize font-medium">{seg.name.toLowerCase()}</span>
                </div>
                <span className="font-semibold text-foreground font-mono">
                  {seg.count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
