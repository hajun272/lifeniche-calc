import type { CalculatorDefinition, CategoryId } from "@/lib/types";

export const categories: Record<CategoryId, { title: string; description: string }> = {
  tax: {
    title: "세금·소득",
    description: "프리랜서, 직장인, 사업자가 가장 자주 헷갈리는 소득과 공제 계산"
  },
  family: {
    title: "육아·가족",
    description: "육아휴직, 출산휴가, 보육비처럼 제도 변화가 잦은 가족 비용 계산"
  },
  realEstate: {
    title: "부동산·임대",
    description: "전월세 전환, 세금, 수익률, 중개보수까지 계약 전 확인할 숫자"
  },
  work: {
    title: "노동·퇴직",
    description: "퇴직금, 실업급여, 연차처럼 일하는 사람이 꼭 알아야 할 권리"
  },
  money: {
    title: "재테크·생활",
    description: "대출, DSR, 예적금, 물가상승률, 청년 지원금을 빠르게 모의계산"
  },
  etc: {
    title: "기타",
    description: "군 복무, 등록금처럼 검색은 많은데 좋은 계산기가 드문 영역"
  }
};

const taxLinks = [
  { label: "국세청", href: "https://www.nts.go.kr/" },
  { label: "국가법령정보센터", href: "https://www.law.go.kr/" }
];

const laborLinks = [
  { label: "고용24", href: "https://www.work24.go.kr/" },
  { label: "고용노동부", href: "https://www.moel.go.kr/" },
  { label: "국가법령정보센터", href: "https://www.law.go.kr/" }
];

const insuranceLinks = [
  { label: "4대사회보험 정보연계센터", href: "https://www.4insure.or.kr/" },
  { label: "국민연금공단", href: "https://www.nps.or.kr/" },
  { label: "국민건강보험", href: "https://www.nhis.or.kr/" }
];

const realEstateLinks = [
  { label: "국토교통부", href: "https://www.molit.go.kr/" },
  { label: "위택스", href: "https://www.wetax.go.kr/" },
  { label: "한국공인중개사협회", href: "https://www.kar.or.kr/" }
];

export const calculators: CalculatorDefinition[] = [
  {
    slug: "freelancer-income-tax",
    title: "프리랜서 종합소득세 계산기",
    shortTitle: "프리랜서 종소세",
    category: "tax",
    description: "3.3% 원천징수액과 장부·경비 반영 후 예상 종합소득세를 비교합니다.",
    popularity: 98,
    status: "ready",
    fields: [
      { name: "income", label: "연간 프리랜서 매출", type: "number", unit: "원", defaultValue: 36000000, step: 100000 },
      { name: "expenseRate", label: "필요경비율", type: "number", unit: "%", defaultValue: 45, min: 0, max: 95 },
      { name: "deduction", label: "인적·기타 공제 합계", type: "number", unit: "원", defaultValue: 3000000, step: 100000 }
    ],
    explanation: [
      "프리랜서에게 흔한 3.3% 원천징수는 최종세금이 아니라 미리 낸 세금입니다.",
      "매출에서 필요경비와 공제를 뺀 과세표준에 종합소득세 누진세율과 지방소득세 10%를 적용합니다."
    ],
    caution: ["업종별 단순경비율·기준경비율, 장부 작성 여부, 세액공제에 따라 실제 신고세액은 달라집니다."],
    lawLinks: taxLinks,
    relatedSlugs: ["salary-net-pay", "year-end-tax-refund"]
  },
  {
    slug: "salary-net-pay",
    title: "연봉 실수령액 계산기",
    shortTitle: "연봉 실수령액",
    category: "tax",
    description: "2026년 국민연금·건강보험·고용보험과 근로소득세를 반영한 월 실수령액입니다.",
    popularity: 100,
    status: "ready",
    fields: [
      { name: "annualSalary", label: "계약 연봉", type: "number", unit: "원", defaultValue: 50000000, step: 1000000 },
      { name: "nonTaxableMonthly", label: "월 비과세액", type: "number", unit: "원", defaultValue: 200000, step: 10000 },
      { name: "dependents", label: "부양가족 수", type: "number", unit: "명", defaultValue: 1, min: 1, max: 10 }
    ],
    explanation: [
      "월 급여에서 비과세액을 제외한 보수월액을 기준으로 4대보험 근로자 부담분을 계산합니다.",
      "근로소득세는 연간 과세표준을 단순화해 산정하므로, 간이세액표와 완전히 같지는 않을 수 있습니다."
    ],
    caution: ["성과급, 식대 외 비과세 항목, 회사별 공제 방식, 간이세액표 선택률에 따라 실제 급여명세서와 차이가 날 수 있습니다."],
    lawLinks: [...taxLinks, ...insuranceLinks],
    relatedSlugs: ["four-insurance", "earned-income-tax-refund"]
  },
  {
    slug: "earned-income-tax-refund",
    title: "근로소득세·연말정산 환급액 계산기",
    shortTitle: "연말정산 환급액",
    category: "tax",
    description: "이미 낸 근로소득세와 예상 결정세액을 비교해 환급·추가납부를 추정합니다.",
    popularity: 87,
    status: "ready",
    fields: [
      { name: "annualSalary", label: "총급여", type: "number", unit: "원", defaultValue: 52000000, step: 1000000 },
      { name: "paidTax", label: "이미 낸 소득세+지방세", type: "number", unit: "원", defaultValue: 2400000, step: 10000 },
      { name: "extraDeduction", label: "추가 공제·세액공제", type: "number", unit: "원", defaultValue: 1200000, step: 10000 }
    ],
    explanation: ["연봉 실수령액 계산과 같은 근로소득세 모델에 추가 공제를 차감해 환급 예상액을 계산합니다."],
    caution: ["카드공제, 의료비, 월세세액공제 등 항목별 한도는 간소화했습니다. 최종 신고 전 홈택스 자료로 확인하세요."],
    lawLinks: taxLinks,
    relatedSlugs: ["salary-net-pay"]
  },
  {
    slug: "four-insurance",
    title: "4대보험료 계산기",
    shortTitle: "4대보험료",
    category: "tax",
    description: "근로자/사업자 부담을 나눠 2026년 4대보험 월 보험료를 계산합니다.",
    popularity: 93,
    status: "ready",
    fields: [
      { name: "monthlyPay", label: "월 보수", type: "number", unit: "원", defaultValue: 3200000, step: 100000 },
      {
        name: "role",
        label: "계산 대상",
        type: "select",
        defaultValue: "employee",
        options: [
          { label: "근로자 부담", value: "employee" },
          { label: "사업자 부담", value: "employer" },
          { label: "근로자+사업자 합계", value: "both" }
        ]
      }
    ],
    explanation: [
      "2026년 국민연금 보험료율은 총 9.5%, 사업장 가입자는 근로자와 사업주가 각각 4.75% 부담합니다.",
      "건강보험은 보수월액 7.19%를 절반씩 부담하고, 장기요양보험은 건강보험료에 연동해 계산합니다."
    ],
    caution: ["산재보험은 업종별 요율 차이가 커서 사업자 부담 항목에 기본 0.7% 가정치를 사용했습니다."],
    lawLinks: insuranceLinks,
    relatedSlugs: ["salary-net-pay"]
  },
  {
    slug: "parental-leave-pay",
    title: "육아휴직 급여 계산기",
    shortTitle: "육아휴직 급여",
    category: "family",
    description: "2026년 일반 육아휴직 급여 상한액과 기간별 지급률을 적용합니다.",
    popularity: 96,
    status: "ready",
    fields: [
      { name: "monthlyWage", label: "월 통상임금", type: "number", unit: "원", defaultValue: 3200000, step: 100000 },
      { name: "months", label: "육아휴직 개월 수", type: "number", unit: "개월", defaultValue: 12, min: 1, max: 18 }
    ],
    explanation: [
      "2026년 일반 육아휴직급여는 1~3개월 100%(상한 250만원), 4~6개월 100%(상한 200만원), 7개월 이후 80%(상한 160만원) 구조로 계산했습니다.",
      "하한액은 월 70만원을 적용했습니다."
    ],
    caution: ["고용보험 피보험 단위기간, 회사 신청 절차, 자녀 연령 요건에 따라 수급 가능 여부가 달라집니다."],
    lawLinks: laborLinks,
    relatedSlugs: ["parental-leave-66", "maternity-leave-pay"]
  },
  {
    slug: "maternity-leave-pay",
    title: "출산휴가 급여 계산기",
    shortTitle: "출산휴가 급여",
    category: "family",
    description: "출산전후휴가 90일·다태아 120일 기준으로 정부 지원액을 모의계산합니다.",
    popularity: 74,
    status: "ready",
    fields: [
      { name: "monthlyWage", label: "월 통상임금", type: "number", unit: "원", defaultValue: 3000000, step: 100000 },
      {
        name: "birthType",
        label: "출산 유형",
        type: "select",
        defaultValue: "single",
        options: [
          { label: "단태아 90일", value: "single" },
          { label: "다태아 120일", value: "multiple" }
        ]
      },
      {
        name: "companyType",
        label: "사업장 유형",
        type: "select",
        defaultValue: "priority",
        options: [
          { label: "우선지원대상기업", value: "priority" },
          { label: "대규모기업", value: "large" }
        ]
      }
    ],
    explanation: ["휴가 일수와 사업장 유형에 따라 고용보험 지원 대상 기간을 나눠 월 통상임금과 상한액 중 낮은 금액을 적용합니다."],
    caution: ["회사 지급분과 고용보험 지급분의 분담은 사업장 유형·취업규칙에 따라 달라질 수 있습니다."],
    lawLinks: laborLinks,
    relatedSlugs: ["parental-leave-pay"]
  },
  {
    slug: "parental-leave-66",
    title: "부모 육아휴직 급여 계산기",
    shortTitle: "6+6 부모육아휴직",
    category: "family",
    description: "6+6 부모함께육아휴직제의 월별 상한액과 일반 급여 전환 구간을 계산합니다.",
    popularity: 89,
    status: "ready",
    fields: [
      { name: "parentA", label: "부모 A 월 통상임금", type: "number", unit: "원", defaultValue: 3300000, step: 100000 },
      { name: "parentB", label: "부모 B 월 통상임금", type: "number", unit: "원", defaultValue: 2800000, step: 100000 },
      { name: "commonMonths", label: "공통 적용 개월", type: "number", unit: "개월", defaultValue: 6, min: 1, max: 6 }
    ],
    explanation: ["부모가 각각 사용한 기간 중 공통 적용 가능한 첫 6개월에 월 통상임금 100%와 월별 상한액을 적용합니다."],
    caution: ["자녀 생후 18개월 이내 육아휴직 개시 등 요건을 충족해야 하며, 첫 번째 사용자에게는 사후 정산이 발생할 수 있습니다."],
    lawLinks: laborLinks,
    relatedSlugs: ["parental-leave-pay"]
  },
  {
    slug: "childcare-cost",
    title: "어린이집·유치원 비용 계산기",
    shortTitle: "보육·교육비",
    category: "family",
    description: "월 보육료, 특별활동비, 차량비, 정부 지원금을 반영한 실제 부담액입니다.",
    popularity: 62,
    status: "ready",
    fields: [
      { name: "baseFee", label: "월 기본 보육·교육비", type: "number", unit: "원", defaultValue: 550000, step: 10000 },
      { name: "extraFee", label: "특별활동·차량·간식비", type: "number", unit: "원", defaultValue: 180000, step: 10000 },
      { name: "support", label: "정부·지자체 지원금", type: "number", unit: "원", defaultValue: 280000, step: 10000 }
    ],
    explanation: ["월 기본 비용과 추가 비용을 더한 뒤 확정 지원금을 차감해 가구 부담액을 계산합니다."],
    caution: ["나이, 기관 유형, 지역 지원사업, 방과후 과정 여부에 따라 지원액은 달라집니다."],
    lawLinks: [{ label: "복지로", href: "https://www.bokjiro.go.kr/" }]
  },
  {
    slug: "jeonse-to-rent",
    title: "전세 → 월세 환산 계산기",
    shortTitle: "전세→월세",
    category: "realEstate",
    description: "전세보증금을 월세로 바꿀 때 전월세 전환율과 보증금 조정분을 적용합니다.",
    popularity: 94,
    status: "ready",
    fields: [
      { name: "jeonseDeposit", label: "기존 전세보증금", type: "number", unit: "원", defaultValue: 300000000, step: 1000000 },
      { name: "newDeposit", label: "전환 후 보증금", type: "number", unit: "원", defaultValue: 50000000, step: 1000000 },
      { name: "rate", label: "전월세 전환율", type: "number", unit: "%", defaultValue: 5.5, step: 0.1 }
    ],
    explanation: ["줄어드는 보증금에 연 전환율을 곱하고 12개월로 나눠 적정 월세를 계산합니다."],
    caution: ["법정 상한 전환율, 지역 시세, 관리비 포함 여부를 반드시 함께 확인하세요."],
    lawLinks: realEstateLinks,
    relatedSlugs: ["rent-to-jeonse"]
  },
  {
    slug: "rent-to-jeonse",
    title: "월세 → 전세 환산 계산기",
    shortTitle: "월세→전세",
    category: "realEstate",
    description: "현재 보증금과 월세를 전세금으로 환산해 계약 조건을 비교합니다.",
    popularity: 82,
    status: "ready",
    fields: [
      { name: "deposit", label: "현재 보증금", type: "number", unit: "원", defaultValue: 30000000, step: 1000000 },
      { name: "monthlyRent", label: "월세", type: "number", unit: "원", defaultValue: 800000, step: 10000 },
      { name: "rate", label: "전월세 전환율", type: "number", unit: "%", defaultValue: 5.5, step: 0.1 }
    ],
    explanation: ["월세의 연간 금액을 전환율로 나눠 보증금 가치로 바꾼 뒤 현재 보증금을 더합니다."],
    caution: ["전환율은 계약 협의와 법정 상한에 따라 달라질 수 있습니다."],
    lawLinks: realEstateLinks,
    relatedSlugs: ["jeonse-to-rent"]
  },
  {
    slug: "rental-yield",
    title: "임대수익률 계산기",
    shortTitle: "임대수익률",
    category: "realEstate",
    description: "매입가, 보증금, 월세, 비용을 반영해 연 임대수익률을 계산합니다.",
    popularity: 78,
    status: "ready",
    fields: [
      { name: "purchasePrice", label: "매입가", type: "number", unit: "원", defaultValue: 450000000, step: 1000000 },
      { name: "deposit", label: "임대보증금", type: "number", unit: "원", defaultValue: 30000000, step: 1000000 },
      { name: "monthlyRent", label: "월세", type: "number", unit: "원", defaultValue: 1200000, step: 10000 },
      { name: "annualCost", label: "연 관리·세금·수선비", type: "number", unit: "원", defaultValue: 1800000, step: 10000 }
    ],
    explanation: ["연 순임대수익을 실투자금으로 나눠 단순 수익률을 계산합니다."],
    caution: ["공실, 대출이자, 취득세, 양도세, 감가상각은 별도로 검토해야 합니다."],
    lawLinks: realEstateLinks,
    relatedSlugs: ["loan-dsr-interest"]
  },
  {
    slug: "capital-gains-tax-home",
    title: "양도소득세 계산기",
    shortTitle: "양도소득세",
    category: "realEstate",
    description: "주택·다주택자 양도차익에 기본공제와 장기보유공제 가정을 적용합니다.",
    popularity: 76,
    status: "template",
    fields: [
      { name: "sellPrice", label: "양도가액", type: "number", unit: "원", defaultValue: 700000000, step: 1000000 },
      { name: "buyPrice", label: "취득가액", type: "number", unit: "원", defaultValue: 500000000, step: 1000000 },
      { name: "holdingYears", label: "보유기간", type: "number", unit: "년", defaultValue: 5, min: 0, max: 30 }
    ],
    explanation: ["양도가액에서 취득가액과 필요경비를 차감한 뒤 보유기간에 따른 공제율을 단순 적용합니다."],
    caution: ["1세대 1주택 비과세, 조정대상지역, 거주요건, 중과 배제 여부에 따라 실제 세액 차이가 매우 큽니다."],
    lawLinks: taxLinks
  },
  {
    slug: "property-holding-tax",
    title: "보유세 계산기",
    shortTitle: "재산세+종부세",
    category: "realEstate",
    description: "공시가격 기반 재산세와 종합부동산세를 간단히 모의계산합니다.",
    popularity: 70,
    status: "template",
    fields: [
      { name: "officialPrice", label: "공시가격 합계", type: "number", unit: "원", defaultValue: 900000000, step: 1000000 },
      { name: "fairRate", label: "공정시장가액비율", type: "number", unit: "%", defaultValue: 60, step: 1 }
    ],
    explanation: ["공시가격에 공정시장가액비율을 적용한 과세표준으로 보유세를 추정합니다."],
    caution: ["세부담상한, 고령자·장기보유 공제, 1세대 1주택 특례는 별도 확인이 필요합니다."],
    lawLinks: realEstateLinks
  },
  {
    slug: "acquisition-tax",
    title: "취득세 계산기",
    shortTitle: "취득세",
    category: "realEstate",
    description: "주택 취득가액과 보유 주택 수에 따른 취득세를 추정합니다.",
    popularity: 81,
    status: "ready",
    fields: [
      { name: "price", label: "취득가액", type: "number", unit: "원", defaultValue: 650000000, step: 1000000 },
      {
        name: "homeCount",
        label: "취득 후 주택 수",
        type: "select",
        defaultValue: "one",
        options: [
          { label: "1주택", value: "one" },
          { label: "2주택", value: "two" },
          { label: "3주택 이상", value: "multi" }
        ]
      }
    ],
    explanation: ["1주택 기본세율 구간과 다주택 중과 가정을 적용해 취득세 본세를 추정합니다."],
    caution: ["지역, 면적, 생애최초 감면, 일시적 2주택, 농어촌특별세·지방교육세는 별도 확인하세요."],
    lawLinks: realEstateLinks
  },
  {
    slug: "severance-pay",
    title: "퇴직금 계산기",
    shortTitle: "퇴직금",
    category: "work",
    description: "최근 3개월 평균임금과 계속근로기간으로 법정 퇴직금을 계산합니다.",
    popularity: 91,
    status: "ready",
    fields: [
      { name: "monthlyAverage", label: "최근 3개월 월평균임금", type: "number", unit: "원", defaultValue: 3600000, step: 100000 },
      { name: "years", label: "근속 연수", type: "number", unit: "년", defaultValue: 4, min: 0 },
      { name: "months", label: "추가 근속 개월", type: "number", unit: "개월", defaultValue: 3, min: 0, max: 11 }
    ],
    explanation: ["계속근로 1년에 대해 30일분 평균임금을 지급하는 법정 산식을 사용했습니다."],
    caution: ["상여금·연차수당 포함 여부, 퇴직연금 제도, 평균임금 산정기간 예외를 확인하세요."],
    lawLinks: laborLinks,
    relatedSlugs: ["unemployment-benefit"]
  },
  {
    slug: "unemployment-benefit",
    title: "실업급여 계산기",
    shortTitle: "실업급여",
    category: "work",
    description: "2026년 구직급여 일 상한·하한액과 가입기간별 지급일수를 적용합니다.",
    popularity: 95,
    status: "ready",
    fields: [
      { name: "monthlyAverage", label: "퇴직 전 3개월 월평균임금", type: "number", unit: "원", defaultValue: 3000000, step: 100000 },
      {
        name: "insuredPeriod",
        label: "고용보험 가입기간",
        type: "select",
        defaultValue: "1-3",
        options: [
          { label: "1년 미만", value: "under1" },
          { label: "1년 이상~3년 미만", value: "1-3" },
          { label: "3년 이상~5년 미만", value: "3-5" },
          { label: "5년 이상~10년 미만", value: "5-10" },
          { label: "10년 이상", value: "over10" }
        ]
      },
      {
        name: "ageGroup",
        label: "연령",
        type: "select",
        defaultValue: "under50",
        options: [
          { label: "50세 미만", value: "under50" },
          { label: "50세 이상 또는 장애인", value: "over50" }
        ]
      }
    ],
    explanation: ["1일 구직급여는 평균임금의 60%에 2026년 상한 68,100원, 8시간 기준 하한 66,048원을 적용했습니다."],
    caution: ["비자발적 이직, 피보험 단위기간 180일 이상, 적극적 재취업활동 등 수급요건을 충족해야 합니다."],
    lawLinks: laborLinks,
    relatedSlugs: ["severance-pay"]
  },
  {
    slug: "annual-leave-days",
    title: "연차휴가일수 계산기",
    shortTitle: "연차휴가일수",
    category: "work",
    description: "입사일과 근속기간에 따른 연차 발생일수를 계산합니다.",
    popularity: 84,
    status: "ready",
    fields: [
      { name: "years", label: "근속 연수", type: "number", unit: "년", defaultValue: 3, min: 0, max: 25 },
      { name: "attendanceRate", label: "출근율", type: "number", unit: "%", defaultValue: 80, min: 0, max: 100 }
    ],
    explanation: ["1년 이상 근속자는 기본 15일에 2년마다 1일을 가산하되 최대 25일로 제한합니다."],
    caution: ["1년 미만 근로자, 회계연도 기준 부여, 육아휴직·병가 처리 방식은 회사 운영 기준을 함께 확인하세요."],
    lawLinks: laborLinks
  },
  {
    slug: "loan-dsr-interest",
    title: "대출 이자·DSR 계산기",
    shortTitle: "대출 이자·DSR",
    category: "money",
    description: "원리금균등 월 상환액과 연소득 대비 DSR을 동시에 계산합니다.",
    popularity: 97,
    status: "ready",
    fields: [
      { name: "principal", label: "대출원금", type: "number", unit: "원", defaultValue: 200000000, step: 1000000 },
      { name: "annualRate", label: "연 이자율", type: "number", unit: "%", defaultValue: 4.2, step: 0.1 },
      { name: "years", label: "상환기간", type: "number", unit: "년", defaultValue: 30, min: 1, max: 50 },
      { name: "annualIncome", label: "연소득", type: "number", unit: "원", defaultValue: 60000000, step: 1000000 }
    ],
    explanation: ["원리금균등 상환 공식으로 월 납입액을 계산하고, 연간 원리금 상환액을 연소득으로 나눠 DSR을 산출합니다."],
    caution: ["기존 대출, 카드론, 스트레스 DSR, 만기일시상환 등 금융기관 심사 방식은 별도 반영이 필요합니다."],
    lawLinks: [{ label: "금융위원회", href: "https://www.fsc.go.kr/" }],
    relatedSlugs: ["rental-yield"]
  },
  {
    slug: "savings-deposit-maturity",
    title: "적금·예금 만기액 계산기",
    shortTitle: "예적금 만기액",
    category: "money",
    description: "예금·적금 만기 원리금과 이자소득세 차감 후 수령액을 계산합니다.",
    popularity: 88,
    status: "ready",
    fields: [
      {
        name: "productType",
        label: "상품 유형",
        type: "select",
        defaultValue: "savings",
        options: [
          { label: "월 적금", value: "savings" },
          { label: "거치식 예금", value: "deposit" }
        ]
      },
      { name: "amount", label: "월 납입액 또는 예치금", type: "number", unit: "원", defaultValue: 500000, step: 10000 },
      { name: "annualRate", label: "연 이자율", type: "number", unit: "%", defaultValue: 3.5, step: 0.1 },
      { name: "months", label: "기간", type: "number", unit: "개월", defaultValue: 12, min: 1, max: 120 }
    ],
    explanation: ["일반과세 이자소득세 15.4%를 차감한 세후 만기액을 보여줍니다."],
    caution: ["우대금리 조건, 비과세·세금우대, 중도해지 이율은 반영하지 않습니다."],
    lawLinks: [{ label: "금융감독원 금융상품한눈에", href: "https://finlife.fss.or.kr/" }]
  },
  {
    slug: "real-return-inflation",
    title: "물가상승률 실질수익률 계산기",
    shortTitle: "실질수익률",
    category: "money",
    description: "명목수익률에서 물가상승률을 반영해 실제 구매력 기준 수익률을 계산합니다.",
    popularity: 69,
    status: "ready",
    fields: [
      { name: "nominalRate", label: "명목수익률", type: "number", unit: "%", defaultValue: 5, step: 0.1 },
      { name: "inflationRate", label: "물가상승률", type: "number", unit: "%", defaultValue: 2.8, step: 0.1 },
      { name: "principal", label: "투자금", type: "number", unit: "원", defaultValue: 10000000, step: 100000 }
    ],
    explanation: ["피셔 방정식에 가까운 (1+명목수익률)/(1+물가상승률)-1 방식으로 계산합니다."],
    caution: ["개인별 소비 바구니와 세금, 수수료를 반영하면 체감 수익률은 달라질 수 있습니다."],
    lawLinks: [{ label: "한국은행 경제통계시스템", href: "https://ecos.bok.or.kr/" }]
  },
  {
    slug: "youth-rent-support",
    title: "청년월세 지원금 모의계산",
    shortTitle: "청년월세 지원",
    category: "money",
    description: "월세와 거주기간을 바탕으로 청년월세 지원 가능 금액을 간단히 추정합니다.",
    popularity: 73,
    status: "ready",
    fields: [
      { name: "monthlyRent", label: "월세", type: "number", unit: "원", defaultValue: 450000, step: 10000 },
      { name: "months", label: "지원 예상 개월", type: "number", unit: "개월", defaultValue: 12, min: 1, max: 24 },
      { name: "incomeEligible", label: "소득요건 충족", type: "select", defaultValue: "yes", options: [{ label: "예", value: "yes" }, { label: "아니오", value: "no" }] }
    ],
    explanation: ["월 최대 20만원, 최대 12개월 지원이라는 일반 구조를 기준으로 모의계산합니다."],
    caution: ["연령, 소득·재산, 보증금·월세 한도, 지자체 사업별 기준이 다릅니다. 신청 전 복지로 공고를 확인하세요."],
    lawLinks: [{ label: "복지로", href: "https://www.bokjiro.go.kr/" }]
  },
  {
    slug: "brokerage-fee",
    title: "중개수수료 계산기",
    shortTitle: "중개수수료",
    category: "money",
    description: "주택 매매·전월세 거래금액에 따른 법정 중개보수 상한을 계산합니다.",
    popularity: 90,
    status: "ready",
    fields: [
      {
        name: "dealType",
        label: "거래 유형",
        type: "select",
        defaultValue: "lease",
        options: [
          { label: "전월세", value: "lease" },
          { label: "매매", value: "sale" }
        ]
      },
      { name: "amount", label: "거래금액", type: "number", unit: "원", defaultValue: 350000000, step: 1000000 }
    ],
    explanation: ["주택 거래의 거래금액 구간별 상한요율과 한도액을 적용해 최대 중개보수를 산출합니다."],
    caution: ["중개보수는 상한 내 협의 사항이며, 오피스텔·상가·토지는 다른 요율이 적용될 수 있습니다."],
    lawLinks: realEstateLinks
  },
  {
    slug: "military-discharge",
    title: "군 복무 기간·전역일 계산기",
    shortTitle: "전역일",
    category: "etc",
    description: "입대일과 복무 유형을 입력해 예상 전역일과 남은 기간을 계산합니다.",
    popularity: 67,
    status: "ready",
    fields: [
      { name: "startDate", label: "입대일", type: "date", defaultValue: "2026-03-02" },
      {
        name: "serviceType",
        label: "복무 유형",
        type: "select",
        defaultValue: "army",
        options: [
          { label: "육군/해병/상근 18개월", value: "army" },
          { label: "해군 20개월", value: "navy" },
          { label: "공군 21개월", value: "airforce" },
          { label: "사회복무요원 21개월", value: "social" }
        ]
      }
    ],
    explanation: ["입대일에 복무 유형별 개월 수를 더하고 하루를 뺀 날짜를 전역 예정일로 계산합니다."],
    caution: ["징계, 복무연장, 제도 개편, 개인별 보충역 편입 사유가 있으면 실제 전역일이 달라질 수 있습니다."],
    lawLinks: [{ label: "병무청", href: "https://www.mma.go.kr/" }]
  },
  {
    slug: "tuition-loan-interest",
    title: "대학 등록금·학자금 대출 이자 계산기",
    shortTitle: "학자금 이자",
    category: "etc",
    description: "등록금 대출 원금과 거치기간의 예상 이자를 계산합니다.",
    popularity: 61,
    status: "ready",
    fields: [
      { name: "principal", label: "대출원금", type: "number", unit: "원", defaultValue: 8000000, step: 100000 },
      { name: "annualRate", label: "연 이자율", type: "number", unit: "%", defaultValue: 1.7, step: 0.1 },
      { name: "months", label: "이자 발생 기간", type: "number", unit: "개월", defaultValue: 12, min: 1, max: 120 }
    ],
    explanation: ["단리 기준으로 거치기간 동안 발생하는 이자를 계산합니다."],
    caution: ["취업 후 상환 학자금대출은 소득 발생 이후 의무상환액 구조가 별도로 적용됩니다."],
    lawLinks: [{ label: "한국장학재단", href: "https://www.kosaf.go.kr/" }]
  }
];

export const getCalculator = (slug: string) => calculators.find((calculator) => calculator.slug === slug);

export const calculatorsByCategory = (category: CategoryId) =>
  calculators.filter((calculator) => calculator.category === category);

export const popularCalculators = calculators
  .filter((calculator) => calculator.status === "ready")
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 8);
