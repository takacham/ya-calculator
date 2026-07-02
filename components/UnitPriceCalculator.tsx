"use client";

import { useRef } from "react";
import { LargeButton } from "./LargeButton";
import { LargeInput } from "./LargeInput";
import { ResultDisplay } from "./ResultDisplay";
import { formatYen, parseNumber } from "@/lib/storage";

interface UnitPriceCalculatorProps {
  unitPrice: string;
  salesQuantity: string;
  salesTotalResult: number | null;
  salesExpression: string | null;
  onUnitPriceChange: (value: string) => void;
  onSalesQuantityChange: (value: string) => void;
  onCalculate: (total: number | null, expression: string | null) => void;
}

export function UnitPriceCalculator({
  unitPrice,
  salesQuantity,
  salesTotalResult,
  salesExpression,
  onUnitPriceChange,
  onSalesQuantityChange,
  onCalculate,
}: UnitPriceCalculatorProps) {
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const price = parseNumber(unitPrice);
    const quantity = parseNumber(salesQuantity);

    if (price === null || quantity === null) {
      onCalculate(null, null);
      return;
    }

    const total = price * quantity;
    const expr = `${price.toLocaleString("ja-JP")} × ${quantity.toLocaleString("ja-JP")}`;
    onCalculate(total, expr);

    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">販売</h2>
      </div>

      <div className="flex flex-col gap-5">
        <LargeInput
          label="1個単価"
          placeholder="90"
          value={unitPrice}
          onChange={(e) => onUnitPriceChange(e.target.value)}
        />
        <LargeInput
          label="販売数量"
          placeholder="30"
          value={salesQuantity}
          onChange={(e) => onSalesQuantityChange(e.target.value)}
        />
      </div>

      <LargeButton type="button" onClick={handleCalculate}>
        計算
      </LargeButton>

      {salesTotalResult !== null && (
        <div ref={resultRef}>
          <ResultDisplay
            prominent
            label={salesExpression ?? undefined}
            value={formatYen(salesTotalResult)}
          />
        </div>
      )}
    </div>
  );
}
