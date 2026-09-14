export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 w-24 rounded bg-gray-200 mb-3" />
      <div className="h-7 w-36 rounded bg-gray-200" />
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 w-40 rounded bg-gray-200 mb-4" />
      <div className="rounded-lg bg-gray-100" style={{ height }} />
    </div>
  );
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 animate-pulse">
      <div className="w-1 self-stretch rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-3 w-48 rounded bg-gray-100" />
        <div className="h-3 w-24 rounded bg-gray-100" />
      </div>
      <div className="h-5 w-20 rounded bg-gray-200" />
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="h-5 w-40 rounded bg-gray-200" />
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
