"use client";

import { useRef } from "react";
import { LargeButton } from "./LargeButton";
import { LargeInput } from "./LargeInput";
import { ResultDisplay } from "./ResultDisplay";
import { formatUnitPrice, parseNumber } from "@/lib/storage";

interface CasePriceCalculatorProps {
  casePrice: string;
  quantityInCase: string;
  caseUnitPriceResult: number | null;
  onCasePriceChange: (value: string) => void;
  onQuantityInCaseChange: (value: string) => void;
  onCalculate: (unitPrice: number | null) => void;
}

export function CasePriceCalculator({
  casePrice,
  quantityInCase,
  caseUnitPriceResult,
  onCasePriceChange,
  onQuantityInCaseChange,
  onCalculate,
}: CasePriceCalculatorProps) {
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const price = parseNumber(casePrice);
    const quantity = parseNumber(quantityInCase);

    if (price === null || quantity === null || quantity === 0) {
      onCalculate(null);
      return;
    }

    const unitPrice = Math.round(price / quantity);
    onCalculate(unitPrice);

    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">1個単価</h2>
      </div>

      <div className="flex flex-col gap-5">
        <LargeInput
          label="ケース価格"
          placeholder="4500"
          value={casePrice}
          onChange={(e) => onCasePriceChange(e.target.value)}
        />
        <LargeInput
          label="入数"
          placeholder="50"
          value={quantityInCase}
          onChange={(e) => onQuantityInCaseChange(e.target.value)}
        />
      </div>

      <LargeButton type="button" onClick={handleCalculate}>
        1個単価を計算
      </LargeButton>

      {caseUnitPriceResult !== null && (
        <div ref={resultRef}>
          <ResultDisplay
            prominent
            label="1個単価"
            value={formatUnitPrice(caseUnitPriceResult)}
          />
        </div>
      )}
    </div>
  );
}
