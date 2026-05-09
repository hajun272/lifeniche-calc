import { CalculatorCard } from "@/components/CalculatorCard";
import { popularCalculators } from "@/lib/calculators";

export function PopularCarousel() {
  return (
    <div className="overflow-x-auto pb-3 [scrollbar-width:thin]">
      <div className="flex min-w-full gap-4">
        {popularCalculators.map((calculator) => (
          <div className="w-[82vw] shrink-0 sm:w-[360px]" key={calculator.slug}>
            <CalculatorCard calculator={calculator} />
          </div>
        ))}
      </div>
    </div>
  );
}
