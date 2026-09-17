import { cn } from "@/lib/cn";

type BadgeVariant = "gold" | "blue" | "navy" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold/20 text-[#b07e22] border border-gold/40",
  blue: "bg-blue/10 text-blue border border-blue/20",
  navy: "bg-navy/10 text-navy border border-navy/20",
  muted: "bg-bg-light text-text-mid border border-border",
};

export function Badge({ variant = "muted", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-pill",
        "text-[11.5px] font-semibold uppercase tracking-[0.08em]",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
