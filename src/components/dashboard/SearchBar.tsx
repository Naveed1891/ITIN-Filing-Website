import Link from "next/link";

/**
 * Server-rendered search box. Submits a GET request with `?q=`, so it works
 * without client JS and keeps results shareable/bookmarkable.
 */
export function SearchBar({ q, placeholder, clearHref }: { q?: string; placeholder: string; clearHref: string }) {
  return (
    <form method="get" role="search" className="dash-search">
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        aria-label={placeholder}
        className="dash-input dash-search__input"
        maxLength={100}
      />
      <button type="submit" className="dash-btn dash-btn--primary">Search</button>
      {q ? <Link href={clearHref} className="dash-btn">Clear</Link> : null}
    </form>
  );
}

/** Normalises the `q` search param into a trimmed string (or undefined). */
export function readQuery(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim().slice(0, 100);
  return trimmed || undefined;
}
