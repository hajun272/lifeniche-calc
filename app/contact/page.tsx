import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "문의하기",
  description: "생활틈새 계산기 오류 제보, 제도 업데이트, 신규 계산기 제안을 보내주세요."
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-mint">문의하기</p>
      <h1 className="mt-2 text-4xl font-black text-ink">오류 제보와 계산기 제안을 기다립니다</h1>
      <div className="mt-8 rounded-lg border border-line bg-white p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-slate-100 text-ink">
            <Mail size={22} aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">제보할 때 포함하면 좋은 내용</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              <li>· 계산기 이름과 입력값</li>
              <li>· 기대한 결과와 실제 결과</li>
              <li>· 참고한 공식 자료 링크</li>
              <li>· 추가되면 좋은 생활 틈새 계산기 아이디어</li>
            </ul>
            <a className="focus-ring mt-5 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-slate-800" href="mailto:hello@lifeniche.calc">
              hello@lifeniche.calc
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
