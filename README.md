# 생활틈새 계산기

**슬로건:** "검색은 많은데 제대로 된 계산기가 없는 것들만 모았습니다"

생활틈새 계산기는 한국인 20~45세가 실제 생활에서 자주 마주치는 세금, 소득, 육아, 부동산, 노동, 재테크 계산을 한곳에서 빠르게 확인할 수 있도록 만든 Next.js 기반 계산기 모음 웹사이트입니다.

프리랜서 종합소득세, 연봉 실수령액, 육아휴직 급여, 전월세 환산, 실업급여, 대출 DSR, 중개수수료처럼 검색량은 많지만 신뢰도 높은 UX로 정리된 계산기가 부족한 주제를 중심으로 구성했습니다.

## 기술 스택

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- React 19
- 클라이언트 사이드 실시간 계산
- PWA manifest + service worker
- localStorage 최근 계산 기록
- URL 파라미터 기반 결과 공유
- 계산기별 SEO metadata + 동적 Open Graph 이미지

## 주요 페이지

- `/` 홈: 인기 계산기 캐러셀, 카테고리 카드, 검색 기능
- `/calculators` 모든 계산기 목록
- `/calculators/[slug]` 계산기 상세 페이지
- `/about` 사이트 취지
- `/contact` 문의하기
- `/sitemap.xml` 사이트맵
- `/robots.txt` 검색엔진 크롤링 정책

## 로컬 개발 실행

```bash
npm install
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```bash
http://localhost:3000
```

배포 전 로컬 검증은 아래 명령을 권장합니다.

```bash
npm run typecheck
npm run build
```

## Vercel 배포 방법

가장 쉬운 방식은 GitHub 저장소를 Vercel에 연결하는 것입니다. 이 프로젝트는 Vercel의 Next.js zero-config 배포를 기준으로 정리되어 있어 별도 `vercel.json`이 필요하지 않습니다.

1. GitHub에 새 Repository를 만듭니다.
2. 이 프로젝트 파일을 Repository에 push합니다.
3. [Vercel Dashboard](https://vercel.com/dashboard)에서 **Add New... > Project**를 선택합니다.
4. GitHub 계정을 연결하고 방금 push한 Repository를 선택합니다.
5. Framework Preset이 **Next.js**로 자동 감지되는지 확인합니다.
6. Build Command는 기본값인 `next build`를 사용합니다.
7. Install Command는 기본값인 `npm install`을 사용합니다.
8. Output Directory는 비워둡니다. Next.js App Router는 Vercel이 `.next`를 자동 처리합니다.
9. **Deploy**를 누릅니다.

배포가 완료되면 Vercel이 `*.vercel.app` 형태의 기본 도메인을 제공합니다.

## 환경변수

현재 프로젝트는 필수 환경변수가 없습니다.

다만 운영 도메인을 확정한 뒤 SEO canonical URL을 더 정확하게 관리하고 싶다면 추후 다음처럼 공개 환경변수를 추가할 수 있습니다.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

현재 코드는 환경변수 없이도 빌드와 배포가 가능합니다.

## Vercel 설정 권장값

Project Settings에서 아래 항목을 확인하세요.

- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Install Command:** `npm install`
- **Output Directory:** 비워두기
- **Node.js Version:** 20.x 이상
- **Root Directory:** 저장소 루트
- **Production Branch:** `main` 또는 실제 운영 브랜치
- **Automatically expose System Environment Variables:** 기본값 유지

Vercel에서 켜두면 좋은 기능은 다음과 같습니다.

- **Analytics:** 방문자, 인기 페이지, 검색 유입 흐름 확인
- **Speed Insights:** Core Web Vitals와 실제 사용자 성능 확인
- **Custom Domain:** `lifenichecalc.com` 같은 브랜드 도메인 연결
- **Preview Deployments:** PR마다 미리보기 URL 생성
- **Deployment Protection:** 공개 전 Preview 배포 보호
- **Notifications:** 빌드 실패 알림 설정

## next.config.mjs 정책

이 프로젝트는 Vercel zero-config를 우선합니다.

- `output`은 설정하지 않습니다. Vercel이 Next.js 빌드 출력을 자동 최적화합니다.
- `basePath`는 설정하지 않습니다. 루트 도메인 배포를 기준으로 합니다.
- `vercel.json`은 만들지 않습니다. 현재 구조에서는 불필요합니다.
- 이미지 설정은 Vercel 이미지 최적화와 호환되도록 AVIF/WebP 포맷을 활성화했습니다.
- `poweredByHeader`는 보안과 노출 최소화를 위해 비활성화했습니다.

## 계산기 업데이트 시 주의사항

세금, 복지, 고용보험, 4대보험, 부동산 세율은 매년 또는 정책 발표에 따라 바뀔 수 있습니다. 계산 로직을 수정할 때는 반드시 공식 기관 자료를 먼저 확인하세요.

주요 확인처:

- 국세청
- 고용노동부
- 고용24
- 국민연금공단
- 국민건강보험
- 국토교통부
- 위택스
- 복지로
- 국가법령정보센터

업데이트 절차:

1. `lib/calculators.ts`에서 계산기 설명, 주의사항, 공식 링크를 수정합니다.
2. `lib/calc-engine.ts`에서 실제 산식을 수정합니다.
3. 계산 기준 연도와 상한액, 하한액, 세율을 코드 주석에 남깁니다.
4. `npm run typecheck`로 타입 오류를 확인합니다.
5. `npm run build`로 Next.js production build를 확인합니다.
6. 정책 변경이 큰 계산기는 상세 설명과 주의사항을 함께 업데이트합니다.

## 배포 전 체크리스트

- TypeScript 오류가 없는지 `npm run typecheck`로 확인
- Production build가 통과하는지 `npm run build`로 확인
- 홈, 모든 계산기, 대표 계산기 상세 페이지가 정상 렌더링되는지 확인
- 모바일 화면에서 입력 폼과 결과 카드가 겹치지 않는지 확인
- 계산 결과 URL 공유가 정상 동작하는지 확인
- localStorage 최근 계산 기록이 브라우저에서 정상 저장되는지 확인
- 각 계산기 title, description, Open Graph 이미지가 생성되는지 확인
- `/sitemap.xml`과 `/robots.txt`가 접근 가능한지 확인
- PWA manifest가 정상 응답하는지 확인
- 공식기관 링크가 깨지지 않았는지 확인
- 제도 기준값이 최신인지 확인

## 배포 후 추천 설정

배포가 끝난 뒤에는 Vercel Dashboard에서 아래를 순서대로 설정하는 것을 권장합니다.

1. **Analytics 활성화**
   인기 계산기, 이탈률, 유입 경로를 확인해 우선 개선할 계산기를 찾습니다.

2. **Speed Insights 활성화**
   실제 사용자 기준 Core Web Vitals를 확인합니다. 모바일 사용자가 많은 서비스라 특히 중요합니다.

3. **Custom Domain 연결**
   브랜드 신뢰도를 위해 `www` 포함 도메인과 apex 도메인을 함께 연결합니다.

4. **Production Branch 확인**
   운영 배포 브랜치가 `main`인지 확인합니다.

5. **Preview Deployment 활용**
   계산식이나 제도값을 수정할 때 PR Preview URL에서 먼저 검증합니다.

6. **검색엔진 등록**
   Google Search Console과 네이버 서치어드바이저에 사이트맵을 제출합니다.

## 현재 구현된 계산기

총 24개 계산기 메타데이터가 구성되어 있고, 22개 계산기는 실시간 계산 로직이 구현되어 있습니다.

- 프리랜서 종합소득세 계산기
- 연봉 실수령액 계산기
- 근로소득세·연말정산 환급액 계산기
- 4대보험료 계산기
- 육아휴직 급여 계산기
- 출산휴가 급여 계산기
- 부모 육아휴직 급여 계산기
- 어린이집·유치원 비용 계산기
- 전세 → 월세 환산 계산기
- 월세 → 전세 환산 계산기
- 임대수익률 계산기
- 양도소득세 계산기
- 보유세 계산기
- 취득세 계산기
- 퇴직금 계산기
- 실업급여 계산기
- 연차휴가일수 계산기
- 대출 이자·DSR 계산기
- 적금·예금 만기액 계산기
- 물가상승률 실질수익률 계산기
- 청년월세 지원금 모의계산
- 중개수수료 계산기
- 군 복무 기간·전역일 계산기
- 대학 등록금·학자금 대출 이자 계산기

## 마지막 안내

이제 GitHub에 push한 뒤 Vercel에서 Repository를 연결하면 1~2분 안에 배포 완료됩니다.
