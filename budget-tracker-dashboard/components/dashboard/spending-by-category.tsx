"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/transactions";
import { getCategoryEmoji } from "@/lib/category-icons";

type CategoryTotal = { category: string; amount: number; percentage: number };

export const CATEGORY_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6",
];

type Props = { categories: CategoryTotal[]; currency: string };

const CustomTooltip = ({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  currency: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-600 mt-0.5">{formatCurrency(payload[0].value, currency)}</p>
    </div>
  );
};

export function SpendingByCategory({ categories, currency }: Props) {
  const total = categories.reduce((s, c) => s + c.amount, 0);

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Spending by Category</h2>
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className="text-sm">No expense data for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Spending by Category</h2>

      {/* Donut chart with center total */}
      <div className="flex justify-center mb-4">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                strokeWidth={0}
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip currency={currency} />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-gray-900 leading-tight">
              {formatCurrency(total, currency)}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">Total spending</span>
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.category}>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                />
                <span className="font-medium text-gray-700 truncate flex items-center gap-1">
                  <span>{getCategoryEmoji(cat.category)}</span>
                  {cat.category}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-xs text-gray-400">{cat.percentage}%</span>
                <span className="text-xs font-semibold text-gray-800">
                  {formatCurrency(cat.amount, currency)}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
