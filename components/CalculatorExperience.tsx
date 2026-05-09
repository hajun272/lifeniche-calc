"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, History, MessageCircle, RotateCcw, Share2 } from "lucide-react";
import { calculators, getCalculator } from "@/lib/calculators";
import { calculate, formatWon, type InputValues } from "@/lib/calc-engine";
import type { CalculatorDefinition, CalculatorResult } from "@/lib/types";

type HistoryItem = {
  slug: string;
  title: string;
  value: string;
  date: string;
};

function initialValues(calculator: CalculatorDefinition): InputValues {
  return Object.fromEntries(calculator.fields.map((field) => [field.name, field.defaultValue]));
}

function resultValue(result: CalculatorResult) {
  if (typeof result.value === "number") return result.unit === "원" ? formatWon(result.value) : String(result.value);
  return `${result.value}${result.unit && result.unit !== "원" ? result.unit : ""}`;
}

export function CalculatorExperience({ slug }: { slug: string }) {
  const calculator = getCalculator(slug) ?? calculators[0];
  const [inputs, setInputs] = useState<InputValues>(() => initialValues(calculator));
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    setInputs((current) => {
      const next = { ...current };
      calculator.fields.forEach((field) => {
        const value = params.get(field.name);
        if (value !== null) next[field.name] = field.type === "number" ? Number(value) : value;
      });
      return next;
    });
  }, [calculator]);

  const result = useMemo(() => calculate(calculator.slug, inputs), [calculator.slug, inputs]);
  const displayValue = resultValue(result);

  useEffect(() => {
    const saved = window.localStorage.getItem("lifeniche-history");
    if (saved) setHistory(JSON.parse(saved).slice(0, 5));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const item: HistoryItem = {
        slug: calculator.slug,
        title: calculator.shortTitle,
        value: displayValue,
        date: new Date().toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      };
      const next = [item, ...history.filter((historyItem) => historyItem.slug !== calculator.slug)].slice(0, 6);
      window.localStorage.setItem("lifeniche-history", JSON.stringify(next));
    }, 800);
    return () => window.clearTimeout(timer);
  }, [calculator.shortTitle, calculator.slug, displayValue, history]);

  const updateInput = (name: string, value: string) => {
    const field = calculator.fields.find((item) => item.name === name);
    setInputs((current) => ({
      ...current,
      [name]: field?.type === "number" ? Number(value) : value
    }));
  };

  const shareUrl = () => {
    const url = new URL(window.location.href);
    url.search = "";
    Object.entries(inputs).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    return url.toString();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const kakaoShare = () => {
    const text = encodeURIComponent(`${calculator.shortTitle} 결과: ${displayValue}`);
    const url = encodeURIComponent(shareUrl());
    window.open(`https://story.kakao.com/share?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-6" aria-label={`${calculator.shortTitle} 입력 폼`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-mint">입력값</p>
            <h2 className="mt-1 text-xl font-bold text-ink">내 조건 넣기</h2>
          </div>
          <button
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-slate-600 hover:bg-slate-100"
            type="button"
            onClick={() => setInputs(initialValues(calculator))}
            aria-label="입력값 초기화"
            title="입력값 초기화"
          >
            <RotateCcw size={18} aria-hidden />
          </button>
        </div>

        <div className="mt-6 grid gap-5">
          {calculator.fields.map((field) => (
            <label key={field.name} className="grid gap-2">
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                {field.label}
                {field.unit ? <span className="text-xs font-medium text-muted">{field.unit}</span> : null}
              </span>
              {field.type === "select" ? (
                <select
                  value={String(inputs[field.name])}
                  onChange={(event) => updateInput(field.name, event.target.value)}
                  className="focus-ring h-12 rounded-md border border-line bg-slate-50 px-4 text-sm text-ink"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={String(inputs[field.name])}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                  onChange={(event) => updateInput(field.name, event.target.value)}
                  className="focus-ring h-12 rounded-md border border-line bg-slate-50 px-4 text-sm text-ink"
                />
              )}
              {field.helper ? <span className="text-xs text-muted">{field.helper}</span> : null}
            </label>
          ))}
        </div>
      </section>

      <aside className="grid gap-6">
        <section className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft sm:p-6" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/70">{result.headline}</p>
              <p className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{displayValue}</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white/10">
              <Share2 size={21} aria-hidden />
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/72">{result.summary}</p>
          <div className="mt-5 grid gap-2">
            {result.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-md bg-white/8 px-3 py-2 text-sm">
                <span className="text-white/70">{item.label}</span>
                <span className={item.tone === "good" ? "font-semibold text-mint" : item.tone === "warn" ? "font-semibold text-warm" : "font-semibold text-white"}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-ink" type="button" onClick={copyLink}>
              <Copy size={16} aria-hidden />
              {copied ? "복사됨" : "링크 복사"}
            </button>
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/18 px-4 py-3 text-sm font-bold text-white hover:bg-white/10" type="button" onClick={kakaoShare}>
              <MessageCircle size={16} aria-hidden />
              카카오 공유
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <History size={17} aria-hidden />
            최근 계산 기록
          </div>
          <div className="mt-4 grid gap-2">
            {history.length ? (
              history.map((item) => (
                <Link key={`${item.slug}-${item.date}`} href={`/calculators/${item.slug}`} className="focus-ring flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100">
                  <span>
                    <span className="block font-semibold text-ink">{item.title}</span>
                    <span className="text-xs text-muted">{item.date}</span>
                  </span>
                  <span className="text-right font-semibold text-slate-700">{item.value}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">계산하면 이 브라우저에 최근 기록이 저장됩니다.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-base font-bold text-ink">상세 설명</h2>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-muted">
            {calculator.explanation.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-base font-bold text-ink">주의사항</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
            {calculator.caution.map((text) => (
              <li key={text}>· {text}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {calculator.lawLinks.map((link) => (
              <a
                key={link.href}
                className="focus-ring inline-flex items-center gap-1 rounded-md border border-line px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ExternalLink size={13} aria-hidden />
              </a>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
