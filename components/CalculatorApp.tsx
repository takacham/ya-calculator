"use client";

import { useCallback, useEffect, useState } from "react";
import { CasePriceCalculator } from "@/components/CasePriceCalculator";
import { RunningTotalCalculator } from "@/components/RunningTotalCalculator";
import { TabBar, TabId } from "@/components/TabBar";
import { UnitPriceCalculator } from "@/components/UnitPriceCalculator";
import {
  AppState,
  DailyHistory,
  RunningTotalItem,
  defaultState,
  loadState,
  saveState,
} from "@/lib/storage";

export function CalculatorApp() {
  const [activeTab, setActiveTab] = useState<TabId>("case");
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const updateField = useCallback(
    <K extends keyof AppState>(key: K, value: AppState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleCaseCalculate = useCallback((unitPrice: number | null) => {
    setState((prev) => ({ ...prev, caseUnitPriceResult: unitPrice }));
  }, []);

  const handleSalesCalculate = useCallback(
    (total: number | null, expression: string | null) => {
      setState((prev) => ({
        ...prev,
        salesTotalResult: total,
        salesExpression: expression,
      }));
    },
    []
  );

  const handleAddItem = useCallback((item: RunningTotalItem) => {
    setState((prev) => ({
      ...prev,
      runningTotalItems: [...prev.runningTotalItems, item],
    }));
  }, []);

  const handleUndo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      runningTotalItems: prev.runningTotalItems.slice(0, -1),
    }));
  }, []);

  const handleClear = useCallback(() => {
    setState((prev) => ({ ...prev, runningTotalItems: [] }));
  }, []);

  const handleSaveDailyHistory = useCallback(() => {
    setState((prev) => {
      const total = prev.runningTotalItems.reduce((sum, item) => sum + item.total, 0);
      if (prev.runningTotalItems.length === 0 || total === 0) return prev;

      const today = new Date().toLocaleDateString("ja-JP");

      const history: DailyHistory = {
        id: `${Date.now()}`,
        date: today,
        total,
        items: prev.runningTotalItems,
      };

      return {
        ...prev,
        dailyHistories: [history, ...prev.dailyHistories],
        runningTotalItems: [],
      };
    });
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-6 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] backdrop-blur-md">
        <h1 className="text-3xl font-bold text-gray-900">YA Calculator</h1>
        <p className="text-sm text-gray-500">青果市場専用</p>
      </header>

      <main className="flex-1 px-6 py-6 pb-32">
        {activeTab === "case" && (
          <CasePriceCalculator
            casePrice={state.casePrice}
            quantityInCase={state.quantityInCase}
            caseUnitPriceResult={state.caseUnitPriceResult}
            onCasePriceChange={(v) => updateField("casePrice", v)}
            onQuantityInCaseChange={(v) => updateField("quantityInCase", v)}
            onCalculate={handleCaseCalculate}
          />
        )}

        {activeTab === "unit" && (
          <UnitPriceCalculator
            unitPrice={state.unitPrice}
            salesQuantity={state.salesQuantity}
            salesTotalResult={state.salesTotalResult}
            salesExpression={state.salesExpression}
            onUnitPriceChange={(v) => updateField("unitPrice", v)}
            onSalesQuantityChange={(v) => updateField("salesQuantity", v)}
            onCalculate={handleSalesCalculate}
          />
        )}

        {activeTab === "total" && (
          <RunningTotalCalculator
            items={state.runningTotalItems}
            dailyHistories={state.dailyHistories}
            onAdd={handleAddItem}
            onUndo={handleUndo}
            onClear={handleClear}
            onSaveDailyHistory={handleSaveDailyHistory}
          />
        )}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}