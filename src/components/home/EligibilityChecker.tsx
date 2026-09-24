"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/motion";

const questions = [
  {
    id: "q1",
    question: "Are you a non-U.S. citizen or non-permanent resident?",
  },
  {
    id: "q2",
    question: "Do you have a U.S. tax filing requirement or are you claimed as a dependent on a U.S. return?",
  },
  {
    id: "q3",
    question: "Are you ineligible for a Social Security Number?",
  },
  {
    id: "q4",
    question: "Do you have a valid passport or accepted government-issued ID available?",
  },
];

export function EligibilityChecker() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const progress = Math.round((current / questions.length) * 100);

  function answer(yes: boolean) {
    const next = [...answers, yes];
    setAnswers(next);
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  }

  function reset() {
    setCurrent(0);
    setAnswers([]);
    setDone(false);
  }

  const eligible = done && answers.every(Boolean);

  return (
    <SectionContainer id="eligibility" className="bg-white">
      <div className="section-stack items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Eligibility"
            title={
              <>
                Check if you{" "}
                <em className="font-serif font-bold italic text-blue">
                  qualify
                </em>
              </>
            }
            subtitle="Answer four quick questions to find out if you're eligible for an ITIN."
          />
        </Reveal>

        <Reveal
          delay={0.1}
          className="w-full min-w-0 max-w-[600px] flex flex-col gap-5 sm:gap-6"
        >
          {!done ? (
            <>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11.5px] sm:text-[12.5px] font-semibold text-text-muted">
                  <span>Question {current + 1} of {questions.length}</span>
                  <span>{progress}% complete</span>
                </div>
                <ProgressBar value={progress} label="Eligibility quiz progress" />
              </div>

              <div className="w-full min-w-0 bg-bg-light rounded-card p-[clamp(1.25rem,3vw,2rem)] flex flex-col gap-5 sm:gap-6">
                <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold text-text-dark leading-[1.4]">
                  {questions[current].question}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="md" fullWidth onClick={() => answer(true)}>
                    Yes
                  </Button>
                  <Button variant="outline" size="md" fullWidth onClick={() => answer(false)}>
                    No
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full min-w-0 bg-bg-light rounded-card p-[clamp(1.25rem,3vw,2rem)] flex flex-col gap-4 sm:gap-5 text-center items-center">
              <div className="text-4xl">{eligible ? "✅" : "ℹ️"}</div>
              <h3 className="text-[20px] sm:text-[22px] font-extrabold text-text-dark">
                {eligible ? "You appear to be eligible for an ITIN!" : "You may not need an ITIN"}
              </h3>
              <p className="reading-width text-[14px] sm:text-[15px] text-text-mid leading-[1.6]">
                {eligible
                  ? "Your answers suggest you may have a federal tax purpose. Review the current IRS requirements before submitting Form W-7."
                  : "Based on your answers, an ITIN may not be required. Contact our support team if you have questions."}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                {eligible && (
                  <Link href="/packages">
                    <Button variant="primary" size="md">Apply now - $99.9</Button>
                  </Link>
                )}
                <Button variant="outline" size="md" onClick={reset}>Start over</Button>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </SectionContainer>
  );
}
