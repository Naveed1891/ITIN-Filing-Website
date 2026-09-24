"use client";

import { useId, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

interface CountryComboboxProps {
  id: string;
  value: string;
  onChange: (country: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

const inputClass =
  "h-12 w-full rounded-btn border bg-white px-3.5 pr-10 text-sm text-text-dark transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/30";

/**
 * Searchable country picker (WAI-ARIA combobox). Type to filter, use the
 * arrow keys + Enter or click to choose. Only names from the country list can
 * be committed, so free-text values never reach the form.
 */
export function CountryCombobox({ id, value, onChange, onBlur, invalid, placeholder = "Select your country…", autoComplete }: CountryComboboxProps) {
  const listId = useId();
  const [query, setQuery] = useState<string | null>(null); // null = show the committed value
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const text = query ?? value;
  const matches = useMemo(() => {
    const needle = (query ?? "").trim().toLowerCase();
    if (!needle) return COUNTRIES;
    const starts = COUNTRIES.filter((c) => c.name.toLowerCase().startsWith(needle));
    const rest = COUNTRIES.filter((c) => !c.name.toLowerCase().startsWith(needle) && c.name.toLowerCase().includes(needle));
    return [...starts, ...rest];
  }, [query]);

  function commit(name: string) {
    onChange(name);
    setQuery(null);
    setOpen(false);
  }

  function scrollTo(index: number) {
    listRef.current?.children[index]?.scrollIntoView({ block: "nearest" });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const next = Math.min(matches.length - 1, Math.max(0, active + (e.key === "ArrowDown" ? 1 : -1)));
      setActive(next);
      scrollTo(next);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      if (matches[active]) commit(matches[active].name);
    } else if (e.key === "Escape") {
      setQuery(null);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid}
        aria-activedescendant={open && matches[active] ? `${listId}-${active}` : undefined}
        autoComplete={autoComplete ?? "off"}
        placeholder={placeholder}
        value={text}
        className={`${inputClass} ${invalid ? "border-error" : "border-border-mid"}`}
        onFocus={(e) => {
          e.currentTarget.select();
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setQuery(null); // discard uncommitted text; keep the last valid selection
          setOpen(false);
          onBlur?.();
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">▾</span>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-btn border border-border-mid bg-white py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-text-muted" role="presentation">No matching country</li>
          ) : (
            matches.map((c, i) => (
              <li
                key={`${c.iso2}-${c.name}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={c.name === value}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep focus so blur doesn't discard the click
                  commit(c.name);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3.5 py-2.5 text-sm ${i === active ? "bg-blue/10 text-text-dark" : "text-text-dark"} ${c.name === value ? "font-semibold" : ""}`}
              >
                {c.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
