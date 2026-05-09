import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "생활틈새 계산기의 취지와 계산 원칙을 소개합니다."
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-mint">About</p>
      <h1 className="mt-2 text-4xl font-black text-ink">검색은 많은데, 계산은 늘 아쉬웠던 것들</h1>
      <div className="mt-6 grid gap-5 text-base leading-8 text-muted">
        <p>
          생활틈새 계산기는 한국에서 실제로 자주 검색하지만 쓸 만한 계산기가 흩어져 있는 생활·금융 주제를 한곳에 모은 프로젝트입니다. 프리랜서, 직장인, 예비부모, 임차인, 사회초년생이
          빠르게 방향을 잡을 수 있도록 만들었습니다.
        </p>
        <p>
          모든 계산기는 클라이언트 사이드에서 즉시 동작하고, 입력값은 사용자의 브라우저에만 저장됩니다. 세금·노동·복지 제도는 공식기관 링크를 함께 제공해 최종 확인까지 이어지도록
          설계했습니다.
        </p>
        <p>
          계산 결과는 모의계산입니다. 실제 신고, 신청, 계약, 대출 심사에서는 세부 요건과 예외가 중요하므로 공식 기관 안내와 전문가 검토를 함께 확인해 주세요.
        </p>
      </div>
    </main>
  );
}
