"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { calculators, categories } from "@/lib/calculators";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return calculators.slice(0, 6);
    return calculators
      .filter((item) => `${item.title} ${item.description} ${categories[item.category].title}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  return (
    <div className="rounded-lg border border-line bg-white p-3 shadow-soft">
      <label className="flex items-center gap-3 rounded-md border border-line bg-slate-50 px-4 py-3">
        <Search className="text-slate-500" size={20} aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="연봉, 육아휴직, 전세, 실업급여처럼 검색해보세요"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
        />
      </label>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {results.map((item) => (
          <Link key={item.slug} className="focus-ring rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href={`/calculators/${item.slug}`}>
            <span className="font-semibold text-ink">{item.shortTitle}</span>
            <span className="ml-2 text-xs text-muted">{categories[item.category].title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
