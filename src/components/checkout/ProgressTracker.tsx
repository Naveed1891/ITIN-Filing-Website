import { cn } from "@/lib/cn";

const steps = [
  { label: "Your information", number: 1 },
  { label: "Payment", number: 2 },
  { label: "Confirmation", number: 3 },
];

interface ProgressTrackerProps {
  currentStep: 1 | 2 | 3;
}

export function ProgressTracker({ currentStep }: ProgressTrackerProps) {
  return (
    <nav aria-label="Checkout progress" className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isDone = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-colors",
                  isDone &&
                    "bg-blue border-blue text-white",
                  isCurrent &&
                    "bg-white border-navy text-navy",
                  !isDone &&
                    !isCurrent &&
                    "bg-bg-light border-border text-text-muted"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? "✓" : step.number}
              </div>
              <span
                className={cn(
                  "text-[11.5px] font-semibold whitespace-nowrap",
                  isCurrent ? "text-navy" : "text-text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-3 mb-5",
                  isDone ? "bg-blue" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
