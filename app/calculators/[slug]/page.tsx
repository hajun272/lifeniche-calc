import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { CalculatorExperience } from "@/components/CalculatorExperience";
import { calculators, categories, getCalculator } from "@/lib/calculators";
import type { CalculatorDefinition } from "@/lib/types";

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};

  return {
    title: calculator.title,
    description: calculator.description,
    alternates: {
      canonical: `/calculators/${calculator.slug}`
    },
    openGraph: {
      title: `${calculator.title} | 생활틈새 계산기`,
      description: calculator.description,
      url: `/calculators/${calculator.slug}`,
      siteName: "생활틈새 계산기",
      locale: "ko_KR",
      type: "website",
      images: [`/calculators/${calculator.slug}/opengraph-image`]
    }
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();

  const related = (calculator.relatedSlugs ?? [])
    .map((relatedSlug) => getCalculator(relatedSlug))
    .filter((item): item is CalculatorDefinition => Boolean(item));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-muted" aria-label="현재 위치">
        <Link className="focus-ring rounded-md hover:text-ink" href="/calculators">
          모든 계산기
        </Link>
        <ChevronRight size={15} aria-hidden />
        <Link className="focus-ring rounded-md hover:text-ink" href={`/calculators?category=${calculator.category}`}>
          {categories[calculator.category].title}
        </Link>
      </nav>

      <section className="pb-8 pt-6">
        <p className="text-sm font-semibold text-mint">{categories[calculator.category].title}</p>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black leading-tight text-ink sm:text-5xl">{calculator.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{calculator.description}</p>
          </div>
          <span className="w-fit rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-slate-600">
            {calculator.status === "ready" ? "실시간 계산 가능" : "확장 템플릿"}
          </span>
        </div>
      </section>

      <CalculatorExperience slug={calculator.slug} />

      {related.length ? (
        <section className="mt-10">
          <h2 className="text-2xl font-black text-ink">함께 보면 좋은 계산기</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CalculatorCard key={item.slug} calculator={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
