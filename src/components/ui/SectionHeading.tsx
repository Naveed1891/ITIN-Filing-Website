import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em]",
            light ? "text-white/60" : "text-blue"
          )}
        >
          {eyebrow}
        </span>
      )}
      <Heading
        className={cn(
          "text-[clamp(1.625rem,3vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em]",
          light ? "text-white" : "text-text-dark"
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "reading-width text-[14px] sm:text-[15px] lg:text-[17px] leading-[1.65]",
            light ? "text-white/70" : "text-text-mid"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
