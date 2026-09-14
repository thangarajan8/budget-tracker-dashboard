"use client";
import { formatCurrency } from "@/lib/transactions";

type Props = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currency: string;
};

export function SummaryCards({ totalIncome, totalExpenses, balance, currency }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-xl">
          💰
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</p>
          <p className="mt-0.5 text-xl font-bold text-gray-900">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-4 border-l-4 border-l-red-400">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-xl">
          💸
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</p>
          <p className="mt-0.5 text-xl font-bold text-gray-900">
            {formatCurrency(totalExpenses, currency)}
          </p>
        </div>
      </div>

      <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-4 border-l-4 ${balance >= 0 ? "border-l-blue-500" : "border-l-red-500"}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-xl ${balance >= 0 ? "bg-blue-50" : "bg-red-50"}`}>
          ⚖️
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Net Balance</p>
          <p className={`mt-0.5 text-xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-500"}`}>
            {formatCurrency(balance, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
