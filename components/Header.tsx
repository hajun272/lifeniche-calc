import Link from "next/link";
import { Calculator, Mail, Menu, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md" aria-label="생활틈새 계산기 홈">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-soft">
            <Calculator size={22} aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-ink">생활틈새 계산기</span>
            <span className="hidden text-xs text-muted sm:block">LifeNiche Calc</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          <Link className="focus-ring rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/calculators">
            모든 계산기
          </Link>
          <Link className="focus-ring rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/about">
            사이트 소개
          </Link>
          <Link className="focus-ring rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/contact">
            문의하기
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="focus-ring hidden items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 sm:flex"
            href="/calculators"
          >
            <Sparkles size={16} aria-hidden />
            바로 계산
          </Link>
          <Link className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-line bg-white text-slate-700 md:hidden" href="/calculators" aria-label="계산기 목록 열기">
            <Menu size={20} aria-hidden />
          </Link>
          <Link className="focus-ring hidden h-10 w-10 place-items-center rounded-md border border-line bg-white text-slate-700 sm:grid md:hidden" href="/contact" aria-label="문의하기">
            <Mail size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
