"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import type { SearchResult } from "@/server/vault/types";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!deferredQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    void fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}`)
      .then((response) => response.json())
      .then((payload: SearchResult[]) => {
        if (!cancelled) {
          setResults(payload);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  return (
    <div className="search-shell">
      <input
        aria-label="Global search"
        className="search-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tasks or projects"
        value={query}
      />
      {results.length > 0 ? (
        <div className="search-results">
          {results.map((result) => (
            <Link href={result.href} key={`${result.type}-${result.id}`}>
              <strong>{result.title}</strong>
              <span>{result.subtitle}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
