"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { LargeButton } from "./LargeButton";
import { LargeInput } from "./LargeInput";
import {
  DailyHistory,
  ProductCandidate,
  RunningTotalItem,
  createRunningTotalItem,
  formatYen,
  parseNumber,
} from "@/lib/storage";

interface RunningTotalCalculatorProps {
  items: RunningTotalItem[];
  dailyHistories: DailyHistory[];
  productCandidates: ProductCandidate[];
  onAdd: (item: RunningTotalItem) => void;
  onUndo: () => void;
  onClear: () => void;
  onSaveDailyHistory: () => void;
  onUpdateProductCandidate: (product: ProductCandidate) => void;
}

export function RunningTotalCalculator({
  items,
  dailyHistories,
  productCandidates,
  onAdd,
  onUndo,
  onClear,
  onSaveDailyHistory,
  onUpdateProductCandidate,
}: RunningTotalCalculatorProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const filteredCandidates = useMemo(() => {
    const keyword = name.trim();

    if (!keyword) return productCandidates.slice(0, 8);

    return productCandidates
      .filter((product) => product.name.includes(keyword))
      .slice(0, 8);
  }, [name, productCandidates]);

  function handleSelectCandidate(product: ProductCandidate) {
    setName(product.name);
    setImage(product.image ?? "");
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") return;

      setImage(result);

      const productName = name.trim();
      if (!productName) return;

      onUpdateProductCandidate({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: productName,
        image: result,
      });
    };

    reader.readAsDataURL(file);
  }

  function handleAdd() {
    const parsedPrice = parseNumber(price);
    const parsedQuantity = parseNumber(quantity);

    if (parsedPrice === null || parsedQuantity === null) return;
    if (parsedQuantity === 0) return;

    onAdd(createRunningTotalItem(parsedPrice, parsedQuantity, name, image));

    setName("");
    setPrice("");
    setQuantity("");
    setImage("");
  }

  return (
    <div className="flex flex-col gap-6 pb-28">
      <h2 className="text-3xl font-black">合計</h2>

      <div className="flex flex-col gap-5">
        <LargeInput
          label="商品名"
          type="text"
          placeholder="例：トマト"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {filteredCandidates.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filteredCandidates.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectCandidate(product)}
                className="flex min-w-24 flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    🧾
                  </div>
                )}

                <span className="max-w-20 truncate text-sm font-bold">
                  {product.name}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 text-base font-medium text-gray-500">
            商品写真
          </div>

          <div className="flex items-center gap-4">
            {image ? (
              <img
                src={image}
                alt={name || "商品写真"}
                className="h-24 w-24 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-4xl">
                📷
              </div>
            )}

            <label className="flex-1 rounded-2xl bg-gray-900 px-5 py-4 text-center text-lg font-bold text-white">
              写真を選ぶ
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <LargeInput
          label="単価"
          type="number"
          placeholder="1580"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <LargeInput
          label="数量"
          type="number"
          placeholder="5"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <LargeButton type="button" onClick={handleAdd}>
        ＋追加
      </LargeButton>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xl font-bold">計算一覧</h3>

        {items.length === 0 ? (
          <p className="text-gray-400">まだ追加されていません</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => (
              <li key={item.id} className="flex gap-3 border-b pb-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || "商品写真"}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    🧾
                  </div>
                )}

                <div className="flex-1">
                  <div className="text-lg font-bold">
                    {index + 1}. {item.name || "商品名なし"}
                  </div>

                  <div className="flex justify-between text-xl font-bold">
                    <span>
                      {item.price.toLocaleString("ja-JP")} ×{" "}
                      {item.quantity.toLocaleString("ja-JP")}
                    </span>

                    <span>{formatYen(item.total)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl bg-green-600 p-7 text-center text-white">
        <div className="text-xl font-bold">本日の合計</div>
        <div className="mt-2 text-5xl font-black">{formatYen(grandTotal)}</div>
      </div>

      <LargeButton
        type="button"
        variant="secondary"
        onClick={onSaveDailyHistory}
        disabled={items.length === 0}
      >
        📅 今日の履歴を保存
      </LargeButton>

      <div className="grid grid-cols-2 gap-3">
        <LargeButton
          type="button"
          variant="secondary"
          onClick={onUndo}
          disabled={items.length === 0}
        >
          ↩ 最後を取り消し
        </LargeButton>

        <LargeButton
          type="button"
          variant="danger"
          onClick={onClear}
          disabled={items.length === 0}
        >
          🗑 全クリア
        </LargeButton>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xl font-bold">保存履歴</h3>

        {dailyHistories.length === 0 ? (
          <p className="text-gray-400">まだ保存履歴はありません</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {dailyHistories.map((history) => (
              <li
                key={history.id}
                className="flex justify-between border-b pb-3 font-bold"
              >
                <span>{history.date}</span>
                <span>{formatYen(history.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}