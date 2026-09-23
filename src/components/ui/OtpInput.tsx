"use client";

import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  name?: string;
  disabled?: boolean;
  onComplete?: (code: string) => void;
}

export function OtpInput({ length = 6, name = "code", disabled, onComplete }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function update(index: number, value: string) {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < length - 1) refs.current[index + 1]?.focus();
    const code = next.join("");
    if (code.length === length && /^\d+$/.test(code)) onComplete?.(code);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      update(index - 1, "");
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    const next = [...digits];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    refs.current[Math.min(text.length, length - 1)]?.focus();
    const code = next.join("");
    if (code.length === length && /^\d+$/.test(code)) onComplete?.(code);
  }

  return (
    <div>
      <div className="otp-grid">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            className="otp-box"
            onChange={(e) => update(i, e.target.value.replace(/\D/g, "").slice(-1))}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      <input type="hidden" name={name} value={digits.join("")} />
    </div>
  );
}
