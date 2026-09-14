import { supabase } from "./supabase";

export type Transaction = {
  id: number;
  telegram_user_id: number;
  telegram_message_id: number | null;
  transaction_type: string;
  amount: number;
  currency: string;
  merchant: string | null;
  category: string | null;
  subcategory: string | null;
  transaction_date: string;
  payment_method: string | null;
  description: string | null;
  raw_message: string | null;
  ai_confidence: number | null;
  created_at: string;
};

export type DateRange = "this_month" | "last_month" | "last_3_months" | "all_time";
export type TransactionFilter = "all" | "income" | "expense" | "transfer";

function getDateRange(range: DateRange): { from: string | null; to: string | null } {
  const now = new Date();
  if (range === "all_time") return { from: null, to: null };
  if (range === "this_month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    return { from, to };
  }
  if (range === "last_month") {
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
    const to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];
    return { from, to };
  }
  // last_3_months
  const from = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split("T")[0];
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  return { from, to };
}

export async function fetchTransactions(
  telegramUserId: number,
  dateRange: DateRange,
  filter: TransactionFilter,
  search: string
): Promise<{ data: Transaction[] | null; error: string | null }> {
  let query = supabase
    .from("transactions")
    .select(
      "id, telegram_user_id, telegram_message_id, transaction_type, amount, currency, merchant, category, subcategory, transaction_date, payment_method, description, raw_message, ai_confidence, created_at"
    )
    .eq("telegram_user_id", telegramUserId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  const { from, to } = getDateRange(dateRange);
  if (from) query = query.gte("transaction_date", from);
  if (to) query = query.lte("transaction_date", to);

  if (filter !== "all") {
    query = query.eq("transaction_type", filter);
  }

  if (search.trim()) {
    const s = `%${search.trim()}%`;
    query = query.or(`merchant.ilike.${s},description.ilike.${s},raw_message.ilike.${s}`);
  }

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data: data as Transaction[], error: null };
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  }
  return `${currency} ${amount.toFixed(2)}`;
}

export function computeSummary(transactions: Transaction[]): {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currency: string;
} {
  const inr = transactions.filter((t) => t.currency === "INR");
  const totalIncome = inr
    .filter((t) => t.transaction_type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = inr
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses, currency: "INR" };
}

export function computeCategoryTotals(
  transactions: Transaction[]
): { category: string; amount: number; percentage: number }[] {
  const expenses = transactions.filter(
    (t) => t.transaction_type === "expense" && t.currency === "INR"
  );
  const totals: Record<string, number> = {};
  for (const t of expenses) {
    const cat = t.category || "Uncategorized";
    totals[cat] = (totals[cat] || 0) + Number(t.amount);
  }
  const grand = Object.values(totals).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: grand > 0 ? Math.round((amount / grand) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (sorted.length <= 8) return sorted;

  const top = sorted.slice(0, 7);
  const otherAmount = sorted.slice(7).reduce((s, c) => s + c.amount, 0);
  const otherPct = grand > 0 ? Math.round((otherAmount / grand) * 100) : 0;
  return [...top, { category: "Other", amount: otherAmount, percentage: otherPct }];
}

export type TrendPoint = { label: string; income: number; expenses: number };

export function computeTrendData(
  transactions: Transaction[],
  dateRange: DateRange
): TrendPoint[] {
  const relevant = transactions.filter(
    (t) =>
      t.currency === "INR" &&
      (t.transaction_type === "income" || t.transaction_type === "expense")
  );

  if (dateRange === "this_month" || dateRange === "last_month") {
    const days: Record<string, { income: number; expenses: number }> = {};
    for (const t of relevant) {
      const day = t.transaction_date;
      if (!days[day]) days[day] = { income: 0, expenses: 0 };
      if (t.transaction_type === "income") days[day].income += Number(t.amount);
      else days[day].expenses += Number(t.amount);
    }
    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => {
        const d = new Date(date + "T00:00:00");
        const label = d.getDate() + " " + d.toLocaleString("en-IN", { month: "short" });
        return { label, ...vals };
      });
  }

  // last_3_months and all_time: group by month
  const months: Record<string, { income: number; expenses: number }> = {};
  for (const t of relevant) {
    const prefix = t.transaction_date.slice(0, 7);
    if (!months[prefix]) months[prefix] = { income: 0, expenses: 0 };
    if (t.transaction_type === "income") months[prefix].income += Number(t.amount);
    else months[prefix].expenses += Number(t.amount);
  }
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ym, vals]) => {
      const [year, month] = ym.split("-");
      const d = new Date(Number(year), Number(month) - 1, 1);
      const label =
        d.toLocaleString("en-IN", { month: "short" }) + " " + String(year).slice(2);
      return { label, ...vals };
    });
}
