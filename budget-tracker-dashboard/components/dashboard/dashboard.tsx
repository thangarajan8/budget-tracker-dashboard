"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchTransactions,
  computeSummary,
  computeCategoryTotals,
  Transaction,
  DateRange,
  TransactionFilter,
} from "@/lib/transactions";
import { SummaryCards } from "./summary-cards";
import { SpendingByCategory } from "./spending-by-category";
import { RecentTransactions } from "./recent-transactions";
import { TransactionFilters } from "./transaction-filters";
import { MonthlyTrend } from "./monthly-trend";
import { SummaryCardsSkeleton, ChartSkeleton, TransactionListSkeleton } from "./skeleton";

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange>("this_month");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchTransactions(dateRange, filter, search);
    if (err) {
      setError(err);
    } else {
      setTransactions(data ?? []);
    }
    setLoading(false);
  }, [dateRange, filter, search]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const summary = computeSummary(transactions);
  const categories = computeCategoryTotals(transactions);

  return (
    <div className="space-y-6">
      {loading && transactions.length === 0 ? (
        <SummaryCardsSkeleton />
      ) : (
        <SummaryCards {...summary} />
      )}

      <TransactionFilters
        filter={filter}
        dateRange={dateRange}
        search={search}
        onFilterChange={setFilter}
        onDateRangeChange={setDateRange}
        onSearchChange={setSearch}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          <strong>Error loading transactions:</strong> {error}
          {(error.toLowerCase().includes("row-level") ||
            error.toLowerCase().includes("permission")) && (
            <p className="mt-1 text-xs">
              This may be a Row Level Security issue. Ensure the Supabase{" "}
              <code>transactions</code> table has an RLS policy allowing reads with the anon key
              for your telegram_user_id.
            </p>
          )}
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <ChartSkeleton height={160} />
            <ChartSkeleton height={200} />
          </div>
          <div className="lg:col-span-2">
            <TransactionListSkeleton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <MonthlyTrend transactions={transactions} dateRange={dateRange} />
            <SpendingByCategory categories={categories} currency="INR" />
          </div>
          <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      )}
    </div>
  );
}
