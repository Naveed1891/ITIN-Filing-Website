import { cn } from "@/lib/cn";

interface CardProps {
  className?: string;
  shadow?: "card" | "pricing" | "sm" | "none";
  children: React.ReactNode;
}

const shadowClasses = {
  card: "shadow-card",
  pricing: "shadow-pricing",
  sm: "shadow-sm",
  none: "",
};

export function Card({ className, shadow = "card", children }: CardProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 h-full bg-white rounded-card border border-border",
        shadowClasses[shadow],
        className
      )}
    >
      {children}
    </div>
  );
}
