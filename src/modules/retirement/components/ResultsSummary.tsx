"use client";

import type { RetirementResult } from "@/lib/types/calculator";

interface ResultsSummaryProps {
  result: RetirementResult;
}

export function ResultsSummary({ result }: ResultsSummaryProps) {
  const isOnTrack = result.annualIncomeAtRetirement >= result.targetSpendingAtRetirement;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          You can retire in: {result.retirementYear}
        </h2>
        <p className="text-2xl text-gray-600">Age {result.retirementAge}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600 mb-2">Portfolio at Retirement</p>
          <p className="text-3xl font-bold text-blue-900">
            {formatCurrency(result.portfolioAtRetirement)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600 mb-2">Annual Income</p>
          <p className="text-3xl font-bold text-green-900">
            {formatCurrency(result.annualIncomeAtRetirement)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <p className="text-sm font-medium text-purple-600 mb-2">Target Spending</p>
          <p className="text-3xl font-bold text-purple-900">
            {formatCurrency(result.targetSpendingAtRetirement)}
          </p>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded-lg ${isOnTrack ? "bg-green-100" : "bg-yellow-100"}`}>
        <p className={`text-center font-semibold ${isOnTrack ? "text-green-800" : "text-yellow-800"}`}>
          {isOnTrack ? "✓ On Track!" : "⚠ Needs Adjustment"}
        </p>
        {!isOnTrack && (
          <p className="text-sm text-center text-yellow-700 mt-2">
            Your projected income is below your target spending. Consider adjusting your assumptions or savings.
          </p>
        )}
      </div>
    </div>
  );
}
