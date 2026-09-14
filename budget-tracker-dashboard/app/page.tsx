import { Dashboard } from "@/components/dashboard/dashboard";

export default function Home() {
  const telegramUserIdStr = process.env.NEXT_PUBLIC_TELEGRAM_USER_ID;

  if (!telegramUserIdStr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-amber-800">Development Setup Required</h1>
          <p className="mt-3 text-sm text-amber-700">
            Add{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_TELEGRAM_USER_ID
            </code>{" "}
            to your{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.env.local</code>{" "}
            to view your transactions.
          </p>
          <p className="mt-2 text-xs text-amber-600">
            This prevents exposing all users&apos; data in development.
          </p>
        </div>
      </div>
    );
  }

  const telegramUserId = parseInt(telegramUserIdStr, 10);

  if (isNaN(telegramUserId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-red-800">Invalid Configuration</h1>
          <p className="mt-3 text-sm text-red-700">
            <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_TELEGRAM_USER_ID
            </code>{" "}
            must be a valid number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm px-4 sm:px-6 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight">Budget Tracker</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="hidden sm:inline">User</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 font-mono text-gray-600 text-xs">
              {telegramUserId}
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Dashboard telegramUserId={telegramUserId} />
      </main>
    </div>
  );
}
