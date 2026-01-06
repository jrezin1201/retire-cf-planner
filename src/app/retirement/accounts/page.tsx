"use client";

import { AccountManager } from "@/modules/retirement/components/AccountManager";
import Link from "next/link";

export default function AccountsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/retirement" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Accounts</h1>

        <AccountManager />
      </div>
    </div>
  );
}
