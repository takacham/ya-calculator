export interface RunningTotalItem {
  id: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AppState {
  casePrice: string;
  quantityInCase: string;
  caseUnitPriceResult: number | null;
  unitPrice: string;
  salesQuantity: string;
  salesTotalResult: number | null;
  salesExpression: string | null;
  runningTotalItems: RunningTotalItem[];
}

const STORAGE_KEY = "ya-calculator-state";

export const defaultState: AppState = {
  casePrice: "",
  quantityInCase: "",
  caseUnitPriceResult: null,
  unitPrice: "",
  salesQuantity: "",
  salesTotalResult: null,
  salesExpression: null,
  runningTotalItems: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      runningTotalItems: parsed.runningTotalItems ?? [],
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function parseNumber(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/[０-９]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    )
    .replace(/,/g, "");

  if (!normalized) return null;

  const num = Number(normalized);
  if (!Number.isFinite(num) || num < 0) return null;
  return num;
}

export function formatYen(value: number): string {
  return `${value.toLocaleString("ja-JP")}円`;
}

export function formatUnitPrice(value: number): string {
  return `${value.toLocaleString("ja-JP")}円`;
}

export function createRunningTotalItem(
  price: number,
  quantity: number
): RunningTotalItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    price,
    quantity,
    total: price * quantity,
  };
}
