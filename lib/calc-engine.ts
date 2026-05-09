import { getCalculator } from "@/lib/calculators";
import type { CalculatorResult } from "@/lib/types";

export type InputValues = Record<string, string | number>;

const WON = new Intl.NumberFormat("ko-KR");
const PERCENT = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 });

export const formatWon = (value: number) => `${WON.format(Math.round(value))}원`;
const formatPercent = (value: number) => `${PERCENT.format(value)}%`;

const num = (inputs: InputValues, key: string) => Number(inputs[key] ?? 0);
const str = (inputs: InputValues, key: string) => String(inputs[key] ?? "");
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const taxBrackets = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.4, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 }
];

function progressiveIncomeTax(taxBase: number) {
  const base = Math.max(0, taxBase);
  const bracket = taxBrackets.find((item) => base <= item.limit) ?? taxBrackets[taxBrackets.length - 1];
  return Math.max(0, base * bracket.rate - bracket.deduction);
}

function earnedIncomeDeduction(grossSalary: number) {
  // 근로소득공제는 총급여 구간별로 달라집니다. 실시간 계산 속도를 위해 국세청 산식을 단순 함수화했습니다.
  if (grossSalary <= 5000000) return grossSalary * 0.7;
  if (grossSalary <= 15000000) return 3500000 + (grossSalary - 5000000) * 0.4;
  if (grossSalary <= 45000000) return 7500000 + (grossSalary - 15000000) * 0.15;
  if (grossSalary <= 100000000) return 12000000 + (grossSalary - 45000000) * 0.05;
  return 14750000 + (grossSalary - 100000000) * 0.02;
}

function salaryTax(annualSalary: number, dependents = 1, extraCredit = 0) {
  const incomeDeduction = earnedIncomeDeduction(annualSalary);
  const personalDeduction = Math.max(1, dependents) * 1500000;
  const taxBase = Math.max(0, annualSalary - incomeDeduction - personalDeduction);
  const calculated = progressiveIncomeTax(taxBase);
  const earnedTaxCredit = calculated <= 1300000 ? calculated * 0.55 : 715000 + (calculated - 1300000) * 0.3;
  const nationalTax = Math.max(0, calculated - Math.min(earnedTaxCredit, 740000) - extraCredit);
  return {
    taxBase,
    nationalTax,
    localTax: nationalTax * 0.1,
    totalTax: nationalTax * 1.1
  };
}

function socialInsurance(monthlyPay: number, role: string) {
  // 2026년 공식 안내 기준: 국민연금 총 9.5%(근로자 4.75%), 건강보험 7.19%, 고용보험 근로자 0.9%.
  const pensionTotal = monthlyPay * 0.095;
  const healthTotal = monthlyPay * 0.0719;
  const longTermTotal = healthTotal * 0.1138;
  const employmentEmployee = monthlyPay * 0.009;
  const employmentEmployer = monthlyPay * 0.0115;
  const industrialAccident = monthlyPay * 0.007;

  const employee = pensionTotal / 2 + healthTotal / 2 + longTermTotal / 2 + employmentEmployee;
  const employer = pensionTotal / 2 + healthTotal / 2 + longTermTotal / 2 + employmentEmployer + industrialAccident;

  return {
    pensionTotal,
    healthTotal,
    longTermTotal,
    employmentEmployee,
    employmentEmployer,
    industrialAccident,
    employee: role === "employer" ? 0 : employee,
    employer: role === "employee" ? 0 : employer,
    total: role === "employee" ? employee : role === "employer" ? employer : employee + employer
  };
}

function commonResult(headline: string, value: number | string, summary: string, items: CalculatorResult["items"], unit = "원"): CalculatorResult {
  return { headline, value, unit, summary, items };
}

export function calculate(slug: string, inputs: InputValues): CalculatorResult {
  switch (slug) {
    case "freelancer-income-tax": {
      const income = num(inputs, "income");
      const expenses = income * (num(inputs, "expenseRate") / 100);
      const taxBase = Math.max(0, income - expenses - num(inputs, "deduction"));
      const nationalTax = progressiveIncomeTax(taxBase);
      const localTax = nationalTax * 0.1;
      const prepaid = income * 0.033;
      const finalTax = nationalTax + localTax;
      const diff = prepaid - finalTax;
      return commonResult(
        diff >= 0 ? "예상 환급액" : "예상 추가납부액",
        Math.abs(diff),
        `3.3%로 미리 낸 세금과 예상 종합소득세를 비교했습니다.`,
        [
          { label: "3.3% 원천징수", value: formatWon(prepaid) },
          { label: "필요경비", value: formatWon(expenses) },
          { label: "과세표준", value: formatWon(taxBase) },
          { label: "예상 결정세액", value: formatWon(finalTax), tone: "warn" }
        ]
      );
    }
    case "salary-net-pay": {
      const annual = num(inputs, "annualSalary");
      const monthlyGross = annual / 12;
      const taxableMonthly = Math.max(0, monthlyGross - num(inputs, "nonTaxableMonthly"));
      const insurance = socialInsurance(taxableMonthly, "employee");
      const tax = salaryTax(annual - num(inputs, "nonTaxableMonthly") * 12, num(inputs, "dependents"));
      const monthlyTax = tax.totalTax / 12;
      const net = monthlyGross - insurance.total - monthlyTax;
      return commonResult("예상 월 실수령액", net, "4대보험과 근로소득세를 반영한 월 기준 추정치입니다.", [
        { label: "월 세전 급여", value: formatWon(monthlyGross) },
        { label: "4대보험 근로자 부담", value: formatWon(insurance.total), tone: "warn" },
        { label: "월 소득세+지방세", value: formatWon(monthlyTax), tone: "warn" },
        { label: "연 실수령액", value: formatWon(net * 12), tone: "good" }
      ]);
    }
    case "earned-income-tax-refund": {
      const tax = salaryTax(num(inputs, "annualSalary"), 1, num(inputs, "extraDeduction"));
      const paid = num(inputs, "paidTax");
      const diff = paid - tax.totalTax;
      return commonResult(diff >= 0 ? "예상 환급액" : "예상 추가납부액", Math.abs(diff), "이미 낸 세금과 예상 결정세액을 비교했습니다.", [
        { label: "이미 낸 세금", value: formatWon(paid) },
        { label: "예상 결정세액", value: formatWon(tax.totalTax), tone: "warn" },
        { label: "과세표준", value: formatWon(tax.taxBase) }
      ]);
    }
    case "four-insurance": {
      const monthlyPay = num(inputs, "monthlyPay");
      const insurance = socialInsurance(monthlyPay, str(inputs, "role"));
      return commonResult("월 보험료 합계", insurance.total, "2026년 보험료율 기준 월 부담액입니다.", [
        { label: "국민연금 총액", value: formatWon(insurance.pensionTotal) },
        { label: "건강보험 총액", value: formatWon(insurance.healthTotal) },
        { label: "장기요양보험 총액", value: formatWon(insurance.longTermTotal) },
        { label: "근로자 부담", value: formatWon(insurance.employee), tone: "warn" },
        { label: "사업자 부담", value: formatWon(insurance.employer), tone: "warn" }
      ]);
    }
    case "parental-leave-pay": {
      const wage = num(inputs, "monthlyWage");
      const months = Math.floor(num(inputs, "months"));
      let total = 0;
      const buckets = [0, 0, 0];
      for (let month = 1; month <= months; month += 1) {
        const amount =
          month <= 3 ? clamp(wage, 700000, 2500000) : month <= 6 ? clamp(wage, 700000, 2000000) : clamp(wage * 0.8, 700000, 1600000);
        total += amount;
        buckets[month <= 3 ? 0 : month <= 6 ? 1 : 2] += amount;
      }
      return commonResult("예상 총 육아휴직급여", total, "2026년 일반 육아휴직 급여 구간을 월별로 적용했습니다.", [
        { label: "1~3개월 구간", value: formatWon(buckets[0]) },
        { label: "4~6개월 구간", value: formatWon(buckets[1]) },
        { label: "7개월 이후 구간", value: formatWon(buckets[2]) },
        { label: "월평균", value: formatWon(months ? total / months : 0), tone: "good" }
      ]);
    }
    case "maternity-leave-pay": {
      const wage = num(inputs, "monthlyWage");
      const days = str(inputs, "birthType") === "multiple" ? 120 : 90;
      const supportedDays = str(inputs, "companyType") === "priority" ? days : Math.max(0, days - 60);
      const monthlyCap = 2100000;
      const government = Math.min(wage, monthlyCap) * (supportedDays / 30);
      const employerDays = Math.max(0, days - supportedDays);
      const employer = wage * (employerDays / 30);
      return commonResult("예상 휴가 급여 합계", government + employer, "고용보험 지원분과 회사 지급 가정분을 나누어 계산했습니다.", [
        { label: "휴가 일수", value: `${days}일` },
        { label: "고용보험 지원 추정", value: formatWon(government), tone: "good" },
        { label: "회사 지급 가정", value: formatWon(employer) }
      ]);
    }
    case "parental-leave-66": {
      // 6+6 부모함께육아휴직제는 공통 적용 개월별 상한액이 달라집니다.
      // 고용노동부 1350 안내 기준: 1개월 200만원, 2개월 250만원, 3~6개월 300/350/400/450만원.
      const caps = [2000000, 2500000, 3000000, 3500000, 4000000, 4500000];
      const months = Math.floor(clamp(num(inputs, "commonMonths"), 1, 6));
      const a = num(inputs, "parentA");
      const b = num(inputs, "parentB");
      let totalA = 0;
      let totalB = 0;
      for (let i = 0; i < months; i += 1) {
        totalA += Math.min(a, caps[i]);
        totalB += Math.min(b, caps[i]);
      }
      return commonResult("부모 합산 예상 급여", totalA + totalB, "6+6 부모함께육아휴직제의 공통 적용 개월에 월별 상한액을 적용했습니다.", [
        { label: "부모 A 예상액", value: formatWon(totalA) },
        { label: "부모 B 예상액", value: formatWon(totalB) },
        { label: "적용 개월", value: `${months}개월` },
        { label: "월평균 합산", value: formatWon((totalA + totalB) / months), tone: "good" }
      ]);
    }
    case "childcare-cost": {
      const total = num(inputs, "baseFee") + num(inputs, "extraFee");
      const support = num(inputs, "support");
      return commonResult("월 실제 부담액", Math.max(0, total - support), "기관 비용에서 확정 지원금을 차감했습니다.", [
        { label: "월 총 비용", value: formatWon(total) },
        { label: "월 지원금", value: formatWon(support), tone: "good" },
        { label: "연 부담액", value: formatWon(Math.max(0, total - support) * 12) }
      ]);
    }
    case "jeonse-to-rent": {
      const delta = Math.max(0, num(inputs, "jeonseDeposit") - num(inputs, "newDeposit"));
      const monthly = (delta * (num(inputs, "rate") / 100)) / 12;
      return commonResult("환산 월세", monthly, "줄어든 보증금에 연 전환율을 적용했습니다.", [
        { label: "보증금 감소분", value: formatWon(delta) },
        { label: "연 환산 임대료", value: formatWon(monthly * 12) },
        { label: "적용 전환율", value: formatPercent(num(inputs, "rate")) }
      ]);
    }
    case "rent-to-jeonse": {
      const converted = num(inputs, "deposit") + (num(inputs, "monthlyRent") * 12) / (num(inputs, "rate") / 100);
      return commonResult("환산 전세금", converted, "월세를 보증금 가치로 바꿔 현재 보증금에 더했습니다.", [
        { label: "현재 보증금", value: formatWon(num(inputs, "deposit")) },
        { label: "월세의 보증금 환산액", value: formatWon(converted - num(inputs, "deposit")) },
        { label: "적용 전환율", value: formatPercent(num(inputs, "rate")) }
      ]);
    }
    case "rental-yield": {
      const annualNet = num(inputs, "monthlyRent") * 12 - num(inputs, "annualCost");
      const invested = Math.max(1, num(inputs, "purchasePrice") - num(inputs, "deposit"));
      const yieldRate = (annualNet / invested) * 100;
      return commonResult("연 임대수익률", formatPercent(yieldRate), "실투자금 대비 연 순임대수익률입니다.", [
        { label: "연 순임대수익", value: formatWon(annualNet), tone: "good" },
        { label: "실투자금", value: formatWon(invested) },
        { label: "월평균 순수익", value: formatWon(annualNet / 12) }
      ], "");
    }
    case "capital-gains-tax-home": {
      const gain = Math.max(0, num(inputs, "sellPrice") - num(inputs, "buyPrice"));
      const longTermDeduction = gain * Math.min(0.3, num(inputs, "holdingYears") * 0.02);
      const taxBase = Math.max(0, gain - longTermDeduction - 2500000);
      const tax = progressiveIncomeTax(taxBase) * 1.1;
      return commonResult("예상 양도소득세", tax, "양도차익에 장기보유공제 가정을 적용한 단순 추정입니다.", [
        { label: "양도차익", value: formatWon(gain) },
        { label: "장기보유공제 가정", value: formatWon(longTermDeduction), tone: "good" },
        { label: "과세표준", value: formatWon(taxBase) }
      ]);
    }
    case "property-holding-tax": {
      const base = num(inputs, "officialPrice") * (num(inputs, "fairRate") / 100);
      const propertyTax = base * 0.0025;
      const comprehensive = Math.max(0, base - 900000000) * 0.006;
      return commonResult("예상 보유세", propertyTax + comprehensive, "재산세와 종합부동산세를 단순 합산했습니다.", [
        { label: "과세표준 가정", value: formatWon(base) },
        { label: "재산세 추정", value: formatWon(propertyTax) },
        { label: "종부세 추정", value: formatWon(comprehensive), tone: "warn" }
      ]);
    }
    case "acquisition-tax": {
      const price = num(inputs, "price");
      const homeCount = str(inputs, "homeCount");
      const rate = homeCount === "multi" ? 0.12 : homeCount === "two" ? 0.08 : price <= 600000000 ? 0.01 : price <= 900000000 ? 0.02 : 0.03;
      return commonResult("취득세 본세 추정", price * rate, "주택 수와 취득가액 구간별 기본세율을 적용했습니다.", [
        { label: "적용 세율", value: formatPercent(rate * 100) },
        { label: "취득가액", value: formatWon(price) },
        { label: "부가세 제외 본세", value: formatWon(price * rate), tone: "warn" }
      ]);
    }
    case "severance-pay": {
      const totalYears = num(inputs, "years") + num(inputs, "months") / 12;
      const severance = num(inputs, "monthlyAverage") * totalYears;
      return commonResult("예상 퇴직금", severance, "1년당 30일분 평균임금 기준으로 계산했습니다.", [
        { label: "총 근속기간", value: `${PERCENT.format(totalYears)}년` },
        { label: "1일 평균임금 가정", value: formatWon(num(inputs, "monthlyAverage") / 30) },
        { label: "세전 퇴직금", value: formatWon(severance), tone: "good" }
      ]);
    }
    case "unemployment-benefit": {
      const dailyAverage = num(inputs, "monthlyAverage") / 30;
      const dailyBenefit = clamp(dailyAverage * 0.6, 66048, 68100);
      const table: Record<string, [number, number]> = {
        under1: [120, 120],
        "1-3": [150, 180],
        "3-5": [180, 210],
        "5-10": [210, 240],
        over10: [240, 270]
      };
      const days = table[str(inputs, "insuredPeriod")]?.[str(inputs, "ageGroup") === "over50" ? 1 : 0] ?? 150;
      return commonResult("예상 총 실업급여", dailyBenefit * days, "2026년 구직급여 상·하한과 소정급여일수를 적용했습니다.", [
        { label: "1일 구직급여", value: formatWon(dailyBenefit) },
        { label: "예상 지급일수", value: `${days}일` },
        { label: "30일 환산", value: formatWon(dailyBenefit * 30), tone: "good" }
      ]);
    }
    case "annual-leave-days": {
      const years = num(inputs, "years");
      const attendance = num(inputs, "attendanceRate");
      const days = attendance < 80 ? 0 : years < 1 ? 11 : Math.min(25, 15 + Math.floor((years - 1) / 2));
      return commonResult("예상 연차휴가", `${days}일`, "근속연수와 출근율 기준으로 법정 기본 연차를 계산했습니다.", [
        { label: "출근율", value: formatPercent(attendance) },
        { label: "근속연수", value: `${years}년` },
        { label: "최대 법정 한도", value: "25일" }
      ], "");
    }
    case "loan-dsr-interest": {
      const principal = num(inputs, "principal");
      const monthlyRate = num(inputs, "annualRate") / 100 / 12;
      const months = num(inputs, "years") * 12;
      const monthlyPayment = monthlyRate === 0 ? principal / months : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
      const dsr = ((monthlyPayment * 12) / Math.max(1, num(inputs, "annualIncome"))) * 100;
      return commonResult("월 원리금 상환액", monthlyPayment, "원리금균등 상환 기준 월 납입액과 DSR입니다.", [
        { label: "예상 DSR", value: formatPercent(dsr), tone: dsr > 40 ? "warn" : "good" },
        { label: "총 상환액", value: formatWon(monthlyPayment * months) },
        { label: "총 이자", value: formatWon(monthlyPayment * months - principal), tone: "warn" }
      ]);
    }
    case "savings-deposit-maturity": {
      const amount = num(inputs, "amount");
      const rate = num(inputs, "annualRate") / 100;
      const months = num(inputs, "months");
      const isSavings = str(inputs, "productType") === "savings";
      const principal = isSavings ? amount * months : amount;
      const interest = isSavings ? amount * rate * (months + 1) / 2 / 12 : amount * rate * months / 12;
      const tax = interest * 0.154;
      return commonResult("세후 만기수령액", principal + interest - tax, "일반과세 15.4%를 차감한 만기 예상액입니다.", [
        { label: "원금 합계", value: formatWon(principal) },
        { label: "세전 이자", value: formatWon(interest), tone: "good" },
        { label: "이자소득세", value: formatWon(tax), tone: "warn" }
      ]);
    }
    case "real-return-inflation": {
      const nominal = num(inputs, "nominalRate") / 100;
      const inflation = num(inputs, "inflationRate") / 100;
      const real = ((1 + nominal) / (1 + inflation) - 1) * 100;
      const realGain = num(inputs, "principal") * (real / 100);
      return commonResult("실질수익률", formatPercent(real), "물가상승률을 반영한 구매력 기준 수익률입니다.", [
        { label: "명목 평가이익", value: formatWon(num(inputs, "principal") * nominal) },
        { label: "실질 평가이익", value: formatWon(realGain), tone: realGain >= 0 ? "good" : "warn" },
        { label: "물가상승률", value: formatPercent(inflation * 100) }
      ], "");
    }
    case "youth-rent-support": {
      const eligible = str(inputs, "incomeEligible") === "yes";
      const months = Math.min(12, num(inputs, "months"));
      const monthly = eligible ? Math.min(200000, num(inputs, "monthlyRent")) : 0;
      return commonResult("예상 지원금", monthly * months, eligible ? "월 최대 20만원 기준으로 계산했습니다." : "소득요건 미충족 선택으로 지원금을 0원 처리했습니다.", [
        { label: "월 지원 추정", value: formatWon(monthly), tone: "good" },
        { label: "지원 개월", value: `${months}개월` },
        { label: "본인 월 부담", value: formatWon(Math.max(0, num(inputs, "monthlyRent") - monthly)) }
      ]);
    }
    case "brokerage-fee": {
      const amount = num(inputs, "amount");
      const sale = str(inputs, "dealType") === "sale";
      const rate = sale
        ? amount < 50000000 ? 0.006 : amount < 200000000 ? 0.005 : amount < 900000000 ? 0.004 : amount < 1200000000 ? 0.005 : amount < 1500000000 ? 0.006 : 0.007
        : amount < 50000000 ? 0.005 : amount < 100000000 ? 0.004 : amount < 600000000 ? 0.003 : amount < 1200000000 ? 0.004 : amount < 1500000000 ? 0.005 : 0.006;
      const raw = amount * rate;
      const cap = sale ? (amount < 50000000 ? 250000 : amount < 200000000 ? 800000 : Infinity) : amount < 50000000 ? 200000 : amount < 100000000 ? 300000 : Infinity;
      const fee = Math.min(raw, cap);
      return commonResult("법정 중개보수 상한", fee, "주택 거래금액 구간별 상한요율과 한도액을 적용했습니다.", [
        { label: "적용 상한요율", value: formatPercent(rate * 100) },
        { label: "거래금액", value: formatWon(amount) },
        { label: "한도 적용 전", value: formatWon(raw) }
      ]);
    }
    case "military-discharge": {
      const start = new Date(str(inputs, "startDate"));
      const monthsMap: Record<string, number> = { army: 18, navy: 20, airforce: 21, social: 21 };
      const months = monthsMap[str(inputs, "serviceType")] ?? 18;
      const discharge = new Date(start);
      discharge.setMonth(discharge.getMonth() + months);
      discharge.setDate(discharge.getDate() - 1);
      const today = new Date();
      const remaining = Math.max(0, Math.ceil((discharge.getTime() - today.getTime()) / 86400000));
      return commonResult("예상 전역일", discharge.toLocaleDateString("ko-KR"), "입대일에 복무기간을 더해 계산했습니다.", [
        { label: "복무기간", value: `${months}개월` },
        { label: "오늘 기준 남은 날", value: `${remaining}일` },
        { label: "입대일", value: start.toLocaleDateString("ko-KR") }
      ], "");
    }
    case "tuition-loan-interest": {
      const interest = num(inputs, "principal") * (num(inputs, "annualRate") / 100) * (num(inputs, "months") / 12);
      return commonResult("예상 발생 이자", interest, "단리 기준 거치기간 이자입니다.", [
        { label: "대출원금", value: formatWon(num(inputs, "principal")) },
        { label: "월평균 이자", value: formatWon(interest / Math.max(1, num(inputs, "months"))) },
        { label: "원금+이자", value: formatWon(num(inputs, "principal") + interest) }
      ]);
    }
    default: {
      const calculator = getCalculator(slug);
      return commonResult("계산 준비 중", "-", `${calculator?.shortTitle ?? "계산기"}는 같은 입력 스키마로 확장할 수 있습니다.`, [
        { label: "상태", value: "템플릿 구성 완료" }
      ], "");
    }
  }
}
