"use client";

import { useState, useEffect } from "react";
import { Transaction, formatCurrency } from "@/lib/transactions";
import { getMerchantEmoji, getCategoryEmoji } from "@/lib/category-icons";
import { TransactionDetail } from "./transaction-detail";

const PAGE_SIZE = 20;

type Props = { transactions: Transaction[] };

function typeConfig(type: string) {
  if (type === "income")
    return { stripe: "bg-green-400", badge: "bg-green-100 text-green-700", sign: "+", amountCls: "text-green-600" };
  if (type === "expense")
    return { stripe: "bg-red-400", badge: "bg-red-100 text-red-600", sign: "-", amountCls: "text-red-500" };
  return { stripe: "bg-blue-400", badge: "bg-blue-100 text-blue-600", sign: "", amountCls: "text-gray-700" };
}

export function RecentTransactions({ transactions }: Props) {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);

  // Reset to first page whenever the transaction list changes
  useEffect(() => {
    setPage(1);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">No transactions found</p>
          <p className="text-xs mt-1">Try changing the date range or filters.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginated = transactions.slice(start, end);

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Recent Transactions</h2>
          <span className="text-xs text-gray-400">{transactions.length} transactions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {paginated.map((t) => {
            const { stripe, badge, sign, amountCls } = typeConfig(t.transaction_type);
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="w-full flex items-stretch gap-0 text-left hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-inset"
              >
                <div className={`w-1 flex-shrink-0 ${stripe} rounded-l-sm`} />
                <div className="flex flex-1 items-start justify-between gap-4 px-5 py-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                        <span>{getMerchantEmoji(t.merchant, t.category)}</span>
                        {t.merchant || t.category || "—"}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge}`}>
                        {t.transaction_type}
                      </span>
                      {t.category && (
                        <span className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-500 flex items-center gap-1">
                          <span>{getCategoryEmoji(t.category)}</span>
                          {t.category}
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="mt-0.5 text-xs text-gray-500 truncate max-w-xs">
                        {t.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>{t.transaction_date}</span>
                      {t.payment_method && (
                        <>
                          <span>·</span>
                          <span>{t.payment_method}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-sm whitespace-nowrap flex-shrink-0 ${amountCls}`}>
                    {sign}{formatCurrency(Number(t.amount), t.currency)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <span className="text-xs text-gray-500">
              {start + 1}–{Math.min(end, transactions.length)} of {transactions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionDetail transaction={selected} onClose={() => setSelected(null)} />
    </>
  );
}
