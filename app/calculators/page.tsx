import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorCard } from "@/components/CalculatorCard";
import { calculators, calculatorsByCategory, categories } from "@/lib/calculators";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: "모든 계산기",
  description: "생활틈새 계산기의 세금·소득, 육아·가족, 부동산·임대, 노동·퇴직, 재테크·생활, 기타 계산기 전체 목록입니다.",
  openGraph: {
    title: "모든 계산기 | 생활틈새 계산기",
    description: "한국 생활·금융 계산기 전체 목록",
    images: ["/icon.svg"]
  }
};

const categoryIds = Object.keys(categories) as CategoryId[];

export default async function CalculatorsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const selected = categoryIds.includes(category as CategoryId) ? (category as CategoryId) : undefined;
  const list = selected ? calculatorsByCategory(selected) : calculators;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-mint">전체 목록</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">모든 계산기</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">총 {calculators.length}개 계산기를 카테고리별로 정리했습니다. 실시간 계산이 준비된 항목부터 바로 사용할 수 있습니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={`focus-ring rounded-md px-3 py-2 text-sm font-bold ${!selected ? "bg-ink text-white" : "border border-line bg-white text-slate-700"}`} href="/calculators">
            전체
          </Link>
          {categoryIds.map((id) => (
            <Link key={id} className={`focus-ring rounded-md px-3 py-2 text-sm font-bold ${selected === id ? "bg-ink text-white" : "border border-line bg-white text-slate-700"}`} href={`/calculators?category=${id}`}>
              {categories[id].title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((calculator) => (
          <CalculatorCard calculator={calculator} key={calculator.slug} />
        ))}
      </div>
    </main>
  );
}
