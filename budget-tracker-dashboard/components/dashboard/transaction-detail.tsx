"use client";

import { useEffect, useRef, useState } from "react";
import { Transaction, formatCurrency } from "@/lib/transactions";
import { getMerchantEmoji, getCategoryEmoji, getTypeEmoji } from "@/lib/category-icons";

type Props = {
  transaction: Transaction | null;
  onClose: () => void;
};

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900 break-words">{String(value)}</dd>
    </div>
  );
}

function typeStyle(type: string) {
  if (type === "income") return { badge: "bg-green-100 text-green-700", stripe: "bg-green-500" };
  if (type === "expense") return { badge: "bg-red-100 text-red-600", stripe: "bg-red-500" };
  return { badge: "bg-blue-100 text-blue-600", stripe: "bg-blue-500" };
}

export function TransactionDetail({ transaction, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!transaction) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [transaction, onClose]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!transaction) return null;

  const { badge, stripe } = typeStyle(transaction.transaction_type);
  const sign =
    transaction.transaction_type === "income"
      ? "+"
      : transaction.transaction_type === "expense"
      ? "-"
      : "";
  const amountColor =
    transaction.transaction_type === "income"
      ? "text-green-600"
      : transaction.transaction_type === "expense"
      ? "text-red-500"
      : "text-gray-700";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Color stripe */}
        <div className={`h-1 w-full rounded-t-2xl sm:rounded-t-2xl ${stripe}`} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">{getMerchantEmoji(transaction.merchant, transaction.category)}</span>
              {transaction.merchant || "Transaction"}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge}`}>
                {getTypeEmoji(transaction.transaction_type)} {transaction.transaction_type}
              </span>
              {transaction.category && (
                <span className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600 flex items-center gap-1">
                  <span>{getCategoryEmoji(transaction.category)}</span>
                  {transaction.category}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount */}
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</p>
          <p className={`text-2xl font-bold mt-0.5 ${amountColor}`}>
            {sign}{formatCurrency(Number(transaction.amount), transaction.currency)}
          </p>
        </div>

        {/* Details */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Date" value={transaction.transaction_date} />
            <Field label="Payment Method" value={transaction.payment_method} />
            <Field label="Category" value={transaction.category ? `${getCategoryEmoji(transaction.category)} ${transaction.category}` : null} />
            <Field label="Subcategory" value={transaction.subcategory} />
            <Field label="Currency" value={transaction.currency} />
            {transaction.ai_confidence != null && (
              <Field
                label="AI Confidence"
                value={`${Math.round(Number(transaction.ai_confidence) * 100)}%`}
              />
            )}
          </dl>
          {transaction.description && (
            <div className="mt-4">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{transaction.description}</dd>
            </div>
          )}
          {transaction.raw_message && (
            <div className="mt-4">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Raw Message</dt>
              <dd className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 font-mono leading-relaxed">
                {transaction.raw_message}
              </dd>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => setToast("Edit is coming soon")}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setToast("Delete is coming soon")}
            className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-gray-800 px-4 py-2 text-xs text-white shadow-lg whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
