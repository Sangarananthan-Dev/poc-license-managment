import { cn } from "@/lib/utils";

export function BarListChart({ data, className }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item) => {
        const width = (item.value / maxValue) * 100;

        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{item.label}</span>
              <span className="font-semibold text-slate-800">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${width}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StackedBar({ segments }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
      {segments.map((item) => {
        const width = (item.value / total) * 100;
        return (
          <div
            key={item.label}
            className="h-full"
            title={`${item.label}: ${item.value}`}
            style={{ width: `${width}%`, backgroundColor: item.color }}
          />
        );
      })}
    </div>
  );
}
