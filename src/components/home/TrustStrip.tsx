import { Reveal } from "@/components/motion";

const stats = [
  { value: "9-digit", label: "IRS tax number" },
  { value: "W-7", label: "Application form" },
  { value: "Federal", label: "Tax purposes only" },
  { value: "Not an SSN", label: "Separate tax ID" },
  { value: "No work status", label: "Not authorization" },
];

export function TrustStrip() {
  return (
    <div className="border-y border-white/8 bg-navy-deep">
      <div className="site-container py-5 sm:py-6">
        <Reveal
          stagger
          className="grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative flex flex-col items-center gap-1 text-center ${
                i >= 3 ? "hidden sm:flex" : ""
              }`}
            >
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-white/10 ${
                    i >= 3 ? "hidden sm:block" : ""
                  }`}
                />
              )}
              <span className="text-[16px] font-extrabold leading-none text-white sm:text-[18px] lg:text-[20px]">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium leading-tight text-white/45 sm:text-[11.5px]">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
