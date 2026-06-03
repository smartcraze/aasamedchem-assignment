"use client";

interface BarItem {
  name: string;
  value: number;
}

interface AnalyticsBarChartProps {
  data: BarItem[];
  title: string;
}

export function AnalyticsBarChart({ data, title }: AnalyticsBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden shadow-sm space-y-4">
      <h3 className="font-serif text-sm font-semibold text-foreground">{title}</h3>

      {data.length === 0 ? (
        <p className="text-xs italic text-muted-foreground text-center py-8">
          No sales data available.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item, idx) => {
            const pct = Math.round((item.value / maxVal) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground truncate max-w-[200px]" title={item.name}>
                    {item.name}
                  </span>
                  <span className="font-semibold text-primary font-mono">
                    ₹{item.value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden border border-border/30">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
