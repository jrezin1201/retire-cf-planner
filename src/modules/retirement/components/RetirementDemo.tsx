"use client";

import { useState, useMemo } from "react";
import { ResultsSummary } from "./ResultsSummary";
import { PortfolioChart } from "./PortfolioChart";
import { ProjectionsTable } from "./ProjectionsTable";
import { calculateRetirement } from "@/lib/calculator/engine";
import { mockAssumptions, mockAccounts, mockAssumptionsNearRetirement, mockAccountsNearRetirement } from "../lib/mockData";
import { Button } from "@/components/ui/Button";

type Scenario = "young" | "near-retirement";

export function RetirementDemo() {
  const [scenario, setScenario] = useState<Scenario>("young");
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => {
    const assumptions = scenario === "young" ? mockAssumptions : mockAssumptionsNearRetirement;
    const accounts = scenario === "young" ? mockAccounts : mockAccountsNearRetirement;
    return calculateRetirement(assumptions, accounts);
  }, [scenario]);

  const assumptions = scenario === "young" ? mockAssumptions : mockAssumptionsNearRetirement;
  const accounts = scenario === "young" ? mockAccounts : mockAccountsNearRetirement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RetireRight</h1>
              <p className="text-gray-600 mt-1">Calculate when you can retire with confidence</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={scenario === "young" ? "primary" : "secondary"}
                onClick={() => setScenario("young")}
              >
                Young Professional
              </Button>
              <Button
                variant={scenario === "near-retirement" ? "primary" : "secondary"}
                onClick={() => setScenario("near-retirement")}
              >
                Near Retirement
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode</h3>
              <p className="text-blue-800 text-sm">
                You&apos;re viewing sample retirement scenarios. Switch between profiles to see how different situations affect retirement planning.
                {" "}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="underline hover:text-blue-900"
                >
                  {showDetails ? "Hide" : "View"} scenario details
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Details */}
        {showDetails && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Current Scenario Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Assumptions</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Current Age:</dt>
                    <dd className="font-medium">{assumptions.currentAge} years</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Annual Spending Goal:</dt>
                    <dd className="font-medium">${assumptions.annualSpendingTarget.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Inflation Rate:</dt>
                    <dd className="font-medium">{(assumptions.inflationRate * 100).toFixed(1)}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Withdrawal Rate:</dt>
                    <dd className="font-medium">{(assumptions.withdrawalRate * 100).toFixed(1)}%</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Accounts ({accounts.length})</h4>
                <dl className="space-y-2 text-sm">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex justify-between">
                      <dt className="text-gray-600">{account.name}:</dt>
                      <dd className="font-medium">
                        {account.currentBalance > 0
                          ? `$${account.currentBalance.toLocaleString()}`
                          : `$${account.annualBenefit?.toLocaleString()}/yr`
                        }
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Main Results */}
        <div className="space-y-6">
          <ResultsSummary result={result} />
          <PortfolioChart projections={result.yearByYearProjections} />

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Your Results</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Retirement Year</h3>
                <p className="text-gray-600">
                  Based on your current savings, contributions, and spending goals, this is the earliest year you could safely retire.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Portfolio Value</h3>
                <p className="text-gray-600">
                  The total value of all your investment accounts at retirement, accounting for growth and contributions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Annual Income</h3>
                <p className="text-gray-600">
                  Your sustainable income in retirement using the 4% withdrawal rule, plus Social Security benefits.
                </p>
              </div>
            </div>
          </div>

          <ProjectionsTable projections={result.yearByYearProjections} />
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to plan your own retirement?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Create your personalized retirement plan with your actual financial data. Track multiple accounts, adjust assumptions, and see how life events impact your timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button size="lg" variant="secondary" className="bg-blue-500 hover:bg-blue-400">
              Learn More
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
            <p className="mt-2">© 2026 RetireRight. Demo data shown.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
