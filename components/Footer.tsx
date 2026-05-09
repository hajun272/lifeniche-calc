import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-lg font-bold text-ink">생활틈새 계산기</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            검색은 많은데 제대로 된 계산기가 없는 것들만 모았습니다. 모든 결과는 빠른 판단을 돕는 모의계산이며, 신고·신청·계약 전에는 공식 기관과 전문가 확인이 필요합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="focus-ring rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/calculators">
            모든 계산기
          </Link>
          <Link className="focus-ring rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/about">
            About
          </Link>
          <Link className="focus-ring rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/contact">
            문의하기
          </Link>
        </div>
      </div>
    </footer>
  );
}
