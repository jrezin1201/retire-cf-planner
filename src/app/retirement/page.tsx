"use client";

import { useRetirementData } from "@/modules/retirement/hooks/useRetirementData";
import { ResultsSummary } from "@/modules/retirement/components/ResultsSummary";
import { PortfolioChart } from "@/modules/retirement/components/PortfolioChart";
import Link from "next/link";

export default function RetirementDashboard() {
  const { result, loading, error } = useRetirementData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your retirement plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Required</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                href="/retirement/assumptions"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Set Up Assumptions
              </Link>
              <Link
                href="/retirement/accounts"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Add Accounts
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Retirement Dashboard</h1>
          <p className="text-gray-600">Your personalized retirement planning overview</p>
        </div>

        <nav className="mb-8 flex gap-4">
          <Link
            href="/retirement"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Dashboard
          </Link>
          <Link
            href="/retirement/assumptions"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Assumptions
          </Link>
          <Link
            href="/retirement/accounts"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Accounts
          </Link>
          <Link
            href="/retirement/projections"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Projections
          </Link>
        </nav>

        <div className="space-y-6">
          <ResultsSummary result={result} />
          <PortfolioChart projections={result.yearByYearProjections} />
        </div>
      </div>
    </div>
  );
}
