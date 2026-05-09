import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, ShieldCheck } from "lucide-react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { HomeSearch } from "@/components/HomeSearch";
import { PopularCarousel } from "@/components/PopularCarousel";
import { calculatorsByCategory, categories } from "@/lib/calculators";
import type { CategoryId } from "@/lib/types";

const categoryIds = Object.keys(categories) as CategoryId[];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pt-18 lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <ShieldCheck size={16} className="text-mint" aria-hidden />
            2026년 제도값 반영
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
            생활틈새 계산기
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            검색은 많은데 제대로 된 계산기가 없는 것들만 모았습니다
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            프리랜서 세금, 육아휴직 급여, 전월세 전환, 실업급여, DSR처럼 한국 생활에서 바로 필요한 숫자를 빠르게 확인하세요.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-white shadow-soft hover:bg-slate-800" href="/calculators">
              모든 계산기 보기
              <ArrowRight size={17} aria-hidden />
            </Link>
            <Link className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100" href="/about">
              사이트 취지
            </Link>
          </div>
        </div>
        <div className="self-end">
          <HomeSearch />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: BarChart3, label: "24개 계산기" },
              { icon: Clock3, label: "실시간 계산" },
              { icon: ShieldCheck, label: "공식 링크" }
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-white/78 p-3 text-center shadow-sm">
                <item.icon className="mx-auto text-mint" size={20} aria-hidden />
                <p className="mt-2 text-xs font-bold text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-mint">인기 계산기</p>
            <h2 className="mt-1 text-2xl font-black text-ink">가장 많이 찾는 계산기</h2>
          </div>
          <Link className="focus-ring rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-white" href="/calculators">
            전체 보기
          </Link>
        </div>
        <PopularCarousel />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-mint">카테고리</p>
          <h2 className="mt-1 text-2xl font-black text-ink">생활 상황별로 고르기</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryIds.map((id) => {
            const sample = calculatorsByCategory(id)[0];
            return (
              <Link key={id} href={`/calculators?category=${id}`} className="card-hover focus-ring rounded-lg border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-ink">{categories[id].title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{categories[id].description}</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{calculatorsByCategory(id).length}개</span>
                </div>
                {sample ? <p className="mt-5 text-sm font-semibold text-slate-700">대표: {sample.shortTitle}</p> : null}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-mint">추천</p>
          <h2 className="mt-1 text-2xl font-black text-ink">오늘 바로 쓸 만한 계산기</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["salary-net-pay", "parental-leave-pay", "jeonse-to-rent", "unemployment-benefit", "loan-dsr-interest", "brokerage-fee"].map((slug) => {
            const calculator = categoryIds.flatMap((id) => calculatorsByCategory(id)).find((item) => item.slug === slug);
            return calculator ? <CalculatorCard key={slug} calculator={calculator} /> : null;
          })}
        </div>
      </section>
    </main>
  );
}
