import { FileText, Globe2, ShieldCheck } from "lucide-react";

const formRows = [
  ["Notice reference", "TIN-47-2086"],
  ["Notice date", "September 18, 2026"],
  ["Application type", "Individual"],
  ["Checklist status", "Prepared"],
];

export function HeroDocumentVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative isolate h-[27rem] w-full min-w-0 md:h-[29rem] lg:h-[clamp(30rem,34vw,39rem)]"
    >
      <div className="absolute inset-x-[4%] top-[8%] bottom-[4%] rounded-[42%_58%_48%_52%/42%_38%_62%_58%] bg-navy-deep/45" />
      <div className="absolute -right-[8%] top-[2%] h-[46%] w-[72%] rotate-[-10deg] rounded-[4rem] bg-blue/25" />
      <div className="absolute -left-[2%] bottom-[1%] h-[34%] w-[76%] rotate-[-32deg] rounded-[3.5rem] bg-white/[0.035]" />
      <div className="absolute right-[4%] bottom-[2%] hidden h-44 w-44 rounded-full border border-white/10 lg:block" />

      <div className="absolute bottom-[14%] left-[1%] z-10 w-[36%] min-w-0 -rotate-[7deg] rounded-[clamp(0.75rem,1.5vw,1.25rem)] border border-white/10 bg-navy-deep p-[clamp(0.8rem,1.6vw,1.25rem)] shadow-[0_24px_55px_-22px_rgba(0,0,0,0.72)] md:left-[3%] lg:bottom-[11%]">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
            <FileText className="h-4 w-4" strokeWidth={1.8} />
          </div>
          <span className="text-[7px] font-semibold uppercase tracking-[0.18em] text-white/35 sm:text-[8px]">
            Travel document
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-1.5 w-3/4 rounded-full bg-white/25" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
        </div>
        <div className="mt-5 flex items-center gap-1.5 text-[8px] font-semibold text-white/55 sm:text-[9px]">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Identity document checklist
        </div>
      </div>

      <div className="absolute right-0 top-[10%] z-20 aspect-[1.05] w-full min-w-0 rotate-[1deg] overflow-hidden rounded-[clamp(1rem,2vw,1.75rem)] border border-white/70 bg-[#fbfcfd] p-[clamp(1.15rem,2.8vw,2.75rem)] text-text-dark shadow-[0_42px_90px_-30px_rgba(0,0,0,0.68)] md:right-[-1.5%] md:top-[9%] md:aspect-[1.15] md:w-[clamp(360px,50vw,560px)] md:rotate-[2deg] lg:right-0 lg:top-[6%] lg:aspect-[1.25] lg:w-[clamp(520px,42vw,760px)] lg:rotate-[4deg]">
        <div className="pointer-events-none absolute inset-0 flex rotate-[-22deg] items-center justify-center">
          <span className="select-none text-[clamp(3rem,8vw,7.5rem)] font-black tracking-[0.15em] text-navy/[0.035]">
            SAMPLE
          </span>
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b-2 border-navy/15 pb-[clamp(0.65rem,1.5vw,1.25rem)]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[10px] font-extrabold tracking-[-0.04em] text-white sm:h-11 sm:w-11 sm:text-[12px]">
                TIN
              </div>
              <div>
                <p className="text-[clamp(0.55rem,1vw,0.75rem)] font-bold uppercase tracking-[0.16em] text-navy">
                  ITINFiling Notice
                </p>
                <p className="text-[clamp(0.45rem,0.8vw,0.65rem)] text-text-muted">
                  Decorative client record
                </p>
              </div>
            </div>
            <span className="rounded-full border border-gold/60 bg-gold/15 px-2.5 py-1 text-[clamp(0.45rem,0.75vw,0.625rem)] font-bold uppercase tracking-[0.12em] text-navy">
              Sample
            </span>
          </div>

          <div className="grid flex-1 grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-[clamp(0.8rem,2.5vw,2.5rem)] pt-[clamp(0.8rem,2vw,1.8rem)]">
            <div className="min-w-0">
              <p className="mb-2 text-[clamp(0.48rem,0.85vw,0.7rem)] font-semibold uppercase tracking-[0.12em] text-blue">
                U.S. Tax Identification Notice
              </p>
              <h3 className="text-[clamp(0.9rem,1.8vw,1.65rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-navy">
                Individual Taxpayer Identification Number
              </h3>

              <div className="mt-[clamp(0.75rem,1.8vw,1.5rem)] space-y-1">
                <p className="text-[clamp(0.45rem,0.8vw,0.65rem)] uppercase tracking-[0.12em] text-text-muted">
                  Prepared for
                </p>
                <p className="text-[clamp(0.7rem,1.25vw,1rem)] font-bold text-text-dark">
                  Morgan A. Reed
                </p>
                <p className="text-[clamp(0.48rem,0.82vw,0.68rem)] leading-relaxed text-text-mid">
                  1847 Sample Avenue
                  <br />
                  Portland, OR 97205
                </p>
              </div>

              <div className="mt-[clamp(0.75rem,1.8vw,1.5rem)] rounded-[clamp(0.6rem,1vw,0.9rem)] bg-navy px-[clamp(0.7rem,1.4vw,1.2rem)] py-[clamp(0.55rem,1.2vw,0.95rem)] text-white">
                <p className="text-[clamp(0.42rem,0.72vw,0.58rem)] uppercase tracking-[0.14em] text-white/55">
                  Identification number
                </p>
                <p className="mt-0.5 font-mono text-[clamp(0.8rem,1.7vw,1.35rem)] font-bold tracking-[0.14em]">
                  ***-**-4821
                </p>
              </div>
            </div>

            <div className="min-w-0 border-l border-border pl-[clamp(0.75rem,1.8vw,1.5rem)]">
              <p className="text-[clamp(0.48rem,0.85vw,0.7rem)] font-bold uppercase tracking-[0.12em] text-navy">
                Notice details
              </p>
              <dl className="mt-2 divide-y divide-border">
                {formRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 gap-0.5 py-[clamp(0.35rem,0.8vw,0.65rem)] sm:grid-cols-[0.9fr_1.1fr] sm:gap-2"
                  >
                    <dt className="text-[clamp(0.42rem,0.72vw,0.58rem)] text-text-muted">
                      {label}
                    </dt>
                    <dd className="text-[clamp(0.44rem,0.78vw,0.62rem)] font-semibold text-text-dark sm:text-right">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-[clamp(0.4rem,1vw,0.8rem)] rounded-lg border border-blue/15 bg-blue/[0.055] p-[clamp(0.5rem,1vw,0.8rem)]">
                <p className="text-[clamp(0.42rem,0.72vw,0.58rem)] leading-relaxed text-text-mid">
                  This fictional sample represents a client record prepared for
                  review.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto flex items-center justify-between border-t border-border pt-[clamp(0.55rem,1.2vw,0.9rem)]">
            <span className="text-[clamp(0.4rem,0.68vw,0.55rem)] font-semibold uppercase tracking-[0.15em] text-text-muted">
              Not a government document
            </span>
            <span className="text-[clamp(0.4rem,0.68vw,0.55rem)] font-bold text-blue">
              ITINFiling.com
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-[1%] top-[1%] z-30 flex -rotate-[2deg] items-center gap-2 rounded-[0.9rem] border border-white/15 bg-blue px-[clamp(0.75rem,1.5vw,1.15rem)] py-[clamp(0.6rem,1.1vw,0.85rem)] text-white shadow-[0_20px_45px_-22px_rgba(0,0,0,0.7)] md:right-[6%] lg:right-[10%]">
        <Globe2 className="h-4 w-4 shrink-0 text-gold sm:h-5 sm:w-5" strokeWidth={1.8} />
        <span className="whitespace-nowrap text-[clamp(0.65rem,1.15vw,0.95rem)] font-bold">
          Form W-7 Guidance
        </span>
      </div>

      <div className="absolute bottom-[3%] left-[2%] z-30 flex rotate-[-2deg] items-center gap-2 rounded-[0.9rem] border border-white/15 bg-blue px-[clamp(0.75rem,1.5vw,1.15rem)] py-[clamp(0.6rem,1.1vw,0.85rem)] text-white shadow-[0_20px_45px_-22px_rgba(0,0,0,0.7)] md:bottom-[8%] md:left-[2%] lg:bottom-[1%]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-gold sm:h-5 sm:w-5" strokeWidth={1.8} />
        <span className="whitespace-nowrap text-[clamp(0.65rem,1.15vw,0.95rem)] font-bold">
          Private Preparation Service
        </span>
      </div>
    </div>
  );
}
