import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { categories } from "@/lib/calculators";
import type { CalculatorDefinition } from "@/lib/types";

export function CalculatorCard({ calculator }: { calculator: CalculatorDefinition }) {
  const category = categories[calculator.category];

  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="card-hover focus-ring group flex h-full flex-col rounded-lg border border-line bg-white p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-mint">{category.title}</p>
          <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{calculator.shortTitle}</h3>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700 transition group-hover:bg-ink group-hover:text-white">
          <ArrowRight size={17} aria-hidden />
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{calculator.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
          <BadgeCheck size={14} aria-hidden />
          {calculator.status === "ready" ? "실시간 계산" : "확장 템플릿"}
        </span>
        <span className="font-medium text-slate-500">인기도 {calculator.popularity}</span>
      </div>
    </Link>
  );
}
