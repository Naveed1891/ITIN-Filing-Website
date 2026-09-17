import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  label,
}: ProgressBarProps) {
  const pct = Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("h-1.5 bg-border rounded-pill overflow-hidden", className)}
    >
      <div
        className="h-full bg-blue rounded-pill transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
