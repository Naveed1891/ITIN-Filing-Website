import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";

const reviewSections = [
  {
    title: "Personal information",
    items: [
      { label: "Full name", value: "Maria García" },
      { label: "Date of birth", value: "January 15, 1985" },
      { label: "Country of residence", value: "Mexico" },
      { label: "Email", value: "m.garcia@email.com" },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "Passport", value: "passport.pdf - uploaded" },
      { label: "Tax requirement proof", value: "w8ben.pdf - uploaded" },
    ],
  },
  {
    title: "Package",
    items: [
      { label: "Service", value: "New ITIN Application" },
      { label: "Amount paid", value: "$225" },
    ],
  },
];

export function ReviewPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[20px] font-extrabold text-text-dark">
          Review & declaration
        </h2>
        <p className="text-[14px] text-text-mid">
          Review your information before submitting to our team.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {reviewSections.map((section) => (
          <div
            key={section.title}
            className="bg-bg-light border border-border rounded-[12px] p-5 flex flex-col gap-4"
          >
            <h3 className="text-[13px] font-bold text-text-dark uppercase tracking-[0.08em]">
              {section.title}
            </h3>
            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between gap-4 text-[13.5px]">
                  <span className="text-text-muted">{item.label}</span>
                  <span className="font-semibold text-text-dark text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Declaration */}
      <div className="bg-white border border-border rounded-[12px] p-5 flex flex-col gap-3">
        <h3 className="text-[14px] font-bold text-text-dark">Declaration</h3>
        <p className="text-[13.5px] text-text-mid leading-[1.6]">
          By submitting this application, I declare that the information
          provided is accurate and complete to the best of my knowledge. I
          authorise ITINFiling.com to submit my W-7 application to the IRS on
          my behalf.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded accent-navy"
          />
          <span className="text-[13.5px] text-text-dark font-medium">
            I agree to the declaration above and the{" "}
            <Link href="/terms-and-conditions" className="text-blue underline">
              Terms of Service
            </Link>
            .
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Link href={customerDashboardUrl("/dashboard/orders")}>
          <Button variant="text" size="sm" className="text-text-muted">
            ← Back
          </Button>
        </Link>
        <Button variant="primary" size="md">
          Submit application →
        </Button>
      </div>
    </div>
  );
}
