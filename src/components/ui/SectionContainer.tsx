import { cn } from "@/lib/cn";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  innerClassName?: string;
  children: React.ReactNode;
}

export function SectionContainer({
  as: Tag = "section",
  className,
  innerClassName,
  children,
  ...props
}: SectionContainerProps) {
  // Cast once: rendered tags are plain HTML elements, so div props are safe.
  const Component = Tag as "div";

  return (
    <Component className={cn("section-padding", className)} {...props}>
      <div className={cn("site-container", innerClassName)}>
        {children}
      </div>
    </Component>
  );
}
