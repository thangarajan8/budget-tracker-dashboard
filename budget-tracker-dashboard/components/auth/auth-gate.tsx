"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./login-form";
import { Dashboard } from "@/components/dashboard/dashboard";

export function AuthGate() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  const telegramUserIdStr = process.env.NEXT_PUBLIC_TELEGRAM_USER_ID;

  if (!telegramUserIdStr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
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
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">💰 Budget Tracker</h1>
            <p className="text-sm text-gray-500">Your personal finance dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Dashboard telegramUserId={telegramUserId} />
      </main>
    </div>
  );
}
