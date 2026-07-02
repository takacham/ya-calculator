"use client";

import { useState } from "react";
import { LargeButton } from "./LargeButton";
import { LargeInput } from "./LargeInput";
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

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  function handleAdd() {
    const parsedPrice = parseNumber(price);
    const parsedQuantity = parseNumber(quantity);

    if (parsedPrice === null || parsedQuantity === null) return;
    if (parsedQuantity === 0) return;

    onAdd(
      createRunningTotalItem(
        parsedPrice,
        parsedQuantity,
        name
      )
    );

    setName("");
    setPrice("");
    setQuantity("");
  }

  return (
    <div className="flex flex-col gap-6 pb-28">

      <h2 className="text-3xl font-black">合計</h2>

      <div className="flex flex-col gap-5">

        <LargeInput
          label="商品名"
          placeholder="例：トマト"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <LargeInput
          label="単価"
          placeholder="1580"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />

        <LargeInput
          label="数量"
          placeholder="5"
          value={quantity}
          onChange={(e)=>setQuantity(e.target.value)}
        />

      </div>

      <LargeButton type="button" onClick={handleAdd}>
        ＋追加
      </LargeButton>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

        <h3 className="mb-4 text-xl font-bold">
          計算一覧
        </h3>

        {items.length===0 ? (

          <p className="text-gray-400">
            まだ追加されていません
          </p>

        ) : (

          <ul className="flex flex-col gap-3">

            {items.map((item,index)=>(

              <li
                key={item.id}
                className="border-b pb-3"
              >

                <div className="text-lg font-bold">
                  {index+1}. {item.name || "商品名なし"}
                </div>

                <div className="flex justify-between text-xl font-bold">

                  <span>
                    {item.price.toLocaleString()} × {item.quantity}
                  </span>

                  <span>
                    {formatYen(item.total)}
                  </span>

                </div>

              </li>

            ))}

          </ul>

        )}

      </div>

      <div className="rounded-3xl bg-green-600 p-7 text-center text-white">

        <div className="text-xl font-bold">
          本日の合計
        </div>

        <div className="mt-2 text-5xl font-black">
          {formatYen(grandTotal)}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <LargeButton
          type="button"
          variant="secondary"
          onClick={onUndo}
        >
          ↩ 最後を取り消し
        </LargeButton>

        <LargeButton
          type="button"
          variant="danger"
          onClick={onClear}
        >
          🗑 全クリア
        </LargeButton>

      </div>

    </div>
  );
}