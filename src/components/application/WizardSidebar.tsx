import { cn } from "@/lib/cn";

const wizardSteps = [
  { number: 1, label: "Personal information" },
  { number: 2, label: "Upload documents" },
  { number: 3, label: "Review & declaration" },
  { number: 4, label: "Submit application" },
];

interface WizardSidebarProps {
  currentStep: number;
}

export function WizardSidebar({ currentStep }: WizardSidebarProps) {
  return (
    <aside className="hidden lg:flex w-[280px] flex-shrink-0 flex-col gap-6">
      <div className="bg-white border border-border rounded-card p-6 flex flex-col gap-5"
        style={{ boxShadow: "0 20px 50px -40px rgba(13,58,43,.4)" }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-[14px] font-extrabold text-text-dark">
            Your application
          </h2>
          <p className="text-[12.5px] text-text-muted">New ITIN Application</p>
        </div>

        <nav aria-label="Application steps">
          <ul className="flex flex-col gap-1">
            {wizardSteps.map((step) => {
              const isDone = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              return (
                <li key={step.number}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors",
                      isCurrent && "bg-navy/6",
                      !isCurrent && "hover:bg-bg-light"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0",
                        isDone && "bg-blue text-white",
                        isCurrent && "bg-navy text-white",
                        !isDone && !isCurrent && "bg-border text-text-muted"
                      )}
                    >
                      {isDone ? "✓" : step.number}
                    </div>
                    <span
                      className={cn(
                        "text-[13px] font-semibold",
                        isCurrent ? "text-navy" : isDone ? "text-text-dark" : "text-text-muted"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="bg-bg-light border border-border rounded-card p-5 flex flex-col gap-3">
        <h3 className="text-[13px] font-bold text-text-dark">Need help?</h3>
        <p className="text-[12.5px] text-text-muted leading-[1.6]">
          Email support is available for general application questions.
        </p>
        <a
          href="mailto:support@itinfiling.com"
          className="text-[13px] font-semibold text-blue hover:underline"
        >
          Contact support →
        </a>
      </div>
    </aside>
  );
}
