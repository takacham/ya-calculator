"use client";

import { useState } from "react";
import { LargeButton } from "./LargeButton";
import { LargeInput } from "./LargeInput";
import { ResultDisplay } from "./ResultDisplay";
import {
  RunningTotalItem,
  createRunningTotalItem,
  formatYen,
  parseNumber,
} from "@/lib/storage";

interface RunningTotalCalculatorProps {
  items: RunningTotalItem[];
  onAdd: (item: RunningTotalItem) => void;
  onUndo: () => void;
  onClear: () => void;
}

export function RunningTotalCalculator({
  items,
  onAdd,
  onUndo,
  onClear,
}: RunningTotalCalculatorProps) {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  function handleAdd() {
    const parsedPrice = parseNumber(price);
    const parsedQuantity = parseNumber(quantity);

    if (parsedPrice === null || parsedQuantity === null) return;

    onAdd(createRunningTotalItem(parsedPrice, parsedQuantity));
    setPrice("");
    setQuantity("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">合計</h2>
      </div>

      <div className="flex flex-col gap-5">
        <LargeInput
          label="単価"
          placeholder="1580"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <LargeInput
          label="数量"
          placeholder="5"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <LargeButton type="button" onClick={handleAdd}>
        追加
      </LargeButton>

      {items.length > 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-400">明細</h3>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="text-xl font-semibold text-gray-800"
              >
                {item.price.toLocaleString("ja-JP")}×
                {item.quantity.toLocaleString("ja-JP")}=
                {item.total.toLocaleString("ja-JP")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
        <ResultDisplay label="合計" value={formatYen(grandTotal)} prominent />
      )}

      <div className="flex flex-col gap-3">
        <LargeButton
          type="button"
          variant="secondary"
          onClick={onUndo}
          disabled={items.length === 0}
        >
          1つ戻す
        </LargeButton>
        <LargeButton
          type="button"
          variant="danger"
          onClick={onClear}
          disabled={items.length === 0}
        >
          すべてクリア
        </LargeButton>
      </div>
    </div>
  );
}
