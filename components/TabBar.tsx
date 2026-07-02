"use client";

export type TabId = "case" | "unit" | "total";

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; shortLabel: string }[] = [
  { id: "case", shortLabel: "1個単価" },
  { id: "unit", shortLabel: "販売" },
  { id: "total", shortLabel: "合計" },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 transition ${
                isActive ? "text-accent" : "text-gray-400"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isActive ? "bg-accent text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.shortLabel.charAt(0)}
              </span>
              <span className="text-xs font-semibold">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
