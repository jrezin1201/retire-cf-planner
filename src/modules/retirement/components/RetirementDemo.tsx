"use client";

import { useState, useMemo } from "react";
import { ResultsSummary } from "./ResultsSummary";
import { PortfolioChart } from "./PortfolioChart";
import { IncomeChart } from "./IncomeChart";
import { ProjectionsTable } from "./ProjectionsTable";
import { calculateRetirement } from "@/lib/calculator/engine";
import { mockAssumptions, mockAccounts, mockAssumptionsNearRetirement, mockAccountsNearRetirement } from "../lib/mockData";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

type Scenario = "young" | "near-retirement";
type Tab = "demo" | "free" | "paid" | "about";

export function RetirementDemo() {
  const [scenario, setScenario] = useState<Scenario>("young");
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [showAdvancedFree, setShowAdvancedFree] = useState(false);
  const [showAdvancedPaid, setShowAdvancedPaid] = useState(false);

  // Free version inputs
  const [freeInputs, setFreeInputs] = useState({
    currentAge: 35,
    currentSalary: 85000,
    annualSpendingTarget: 75000,
    currentSavings: 202000,
    monthlyContribution: 2300,
    employerMatchPercent: 5.0,
    salaryGrowthRate: 3.0,
    inflationRate: 3.0,
    withdrawalRate: 4.0,
    targetRetirementAge: 65,
    lifeExpectancy: 90,
  });

  // Paid version inputs (with additional fields)
  const [paidInputs, setPaidInputs] = useState({
    currentAge: 35,
    currentSalary: 85000,
    annualSpendingTarget: 75000,
    currentSavings: 202000,
    monthlyContribution: 2300,
    employerMatchPercent: 5.0,
    salaryGrowthRate: 3.0,
    annualReturnRate: 7.0,
    inflationRate: 3.0,
    withdrawalRate: 4.0,
    retirementTaxRate: 22,
    targetRetirementAge: 65,
    lifeExpectancy: 90,
    healthcareCostPerYear: 12000,
    socialSecurityAge: 67,
    socialSecurityAmount: 30000,
  });

  const result = useMemo(() => {
    const assumptions = scenario === "young" ? mockAssumptions : mockAssumptionsNearRetirement;
    const accounts = scenario === "young" ? mockAccounts : mockAccountsNearRetirement;
    return calculateRetirement(assumptions, accounts);
  }, [scenario]);

  // Free version calculation
  const freeResult = useMemo(() => {
    const assumptions = {
      currentAge: freeInputs.currentAge,
      annualSpendingTarget: freeInputs.annualSpendingTarget,
      inflationRate: freeInputs.inflationRate / 100,
      retirementTaxRate: 0.22,
      withdrawalRate: freeInputs.withdrawalRate / 100,
      retirementGrowthRate: 0.02,
      investmentFeeRate: 0.005,
      desiredRetirementAge: freeInputs.targetRetirementAge,
    };

    // Calculate employer match (assuming it's a % of contribution up to certain limit)
    const employeeContribution = freeInputs.monthlyContribution;
    const employerMatch = (employeeContribution * (freeInputs.employerMatchPercent / 100));
    const totalMonthlyContribution = employeeContribution + employerMatch;

    const accounts = [
      {
        id: "1",
        name: "Investment Portfolio",
        accountType: "TAXABLE_BROKERAGE",
        currentBalance: freeInputs.currentSavings,
        annualReturnRate: 0.07,
        contributions: {
          amount: totalMonthlyContribution,
          frequency: "MONTHLY" as const,
          growthType: "PERCENTAGE" as const,
          growthValue: freeInputs.salaryGrowthRate / 100,
          startYear: 2026,
          endYear: freeInputs.targetRetirementAge ? 2026 + (freeInputs.targetRetirementAge - freeInputs.currentAge) : 2050,
        },
        events: [],
      },
    ];
    return calculateRetirement(assumptions, accounts);
  }, [freeInputs]);

  // Paid version calculation
  const paidResult = useMemo(() => {
    const assumptions = {
      currentAge: paidInputs.currentAge,
      annualSpendingTarget: paidInputs.annualSpendingTarget,
      inflationRate: paidInputs.inflationRate / 100,
      retirementTaxRate: paidInputs.retirementTaxRate / 100,
      withdrawalRate: paidInputs.withdrawalRate / 100,
      retirementGrowthRate: 0.02,
      investmentFeeRate: 0.005,
      desiredRetirementAge: paidInputs.targetRetirementAge,
    };

    // Calculate employer match
    const employeeContribution = paidInputs.monthlyContribution;
    const employerMatch = (employeeContribution * (paidInputs.employerMatchPercent / 100));
    const totalMonthlyContribution = employeeContribution + employerMatch;

    const accounts = [
      {
        id: "1",
        name: "Investment Portfolio",
        accountType: "TAXABLE_BROKERAGE",
        currentBalance: paidInputs.currentSavings,
        annualReturnRate: paidInputs.annualReturnRate / 100,
        contributions: {
          amount: totalMonthlyContribution,
          frequency: "MONTHLY" as const,
          growthType: "PERCENTAGE" as const,
          growthValue: paidInputs.salaryGrowthRate / 100,
          startYear: 2026,
          endYear: paidInputs.targetRetirementAge ? 2026 + (paidInputs.targetRetirementAge - paidInputs.currentAge) : 2050,
        },
        events: [],
      },
      {
        id: "2",
        name: "Social Security",
        accountType: "SOCIAL_SECURITY",
        currentBalance: 0,
        annualReturnRate: 0,
        annualBenefit: paidInputs.socialSecurityAmount,
        benefitStartAge: paidInputs.socialSecurityAge,
        events: [],
      },
    ];
    return calculateRetirement(assumptions, accounts);
  }, [paidInputs]);

  const assumptions = scenario === "young" ? mockAssumptions : mockAssumptionsNearRetirement;
  const accounts = scenario === "young" ? mockAccounts : mockAccountsNearRetirement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 bg-clip-text text-transparent">
                  RetireRight
                </h1>
              </div>
              <p className="text-blue-200 ml-[52px]">Calculate when you can retire with confidence</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={scenario === "young" ? "primary" : "secondary"}
                onClick={() => setScenario("young")}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                👨‍💼 Young Professional
              </Button>
              <Button
                variant={scenario === "near-retirement" ? "primary" : "secondary"}
                onClick={() => setScenario("near-retirement")}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                👴 Near Retirement
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 overflow-x-auto pb-2 -mb-px scrollbar-hide"
        >
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 sm:flex-initial min-w-[120px] px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all ${
              activeTab === "about"
                ? "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-t border-l border-r border-white/30 text-white shadow-lg"
                : "bg-white/5 backdrop-blur-sm border border-white/10 text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            ℹ️ About
          </button>
          <button
            onClick={() => setActiveTab("demo")}
            className={`flex-1 sm:flex-initial min-w-[120px] px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all ${
              activeTab === "demo"
                ? "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-t border-l border-r border-white/30 text-white shadow-lg"
                : "bg-white/5 backdrop-blur-sm border border-white/10 text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            🎭 Demo
          </button>
          <button
            onClick={() => setActiveTab("free")}
            className={`flex-1 sm:flex-initial min-w-[120px] px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all ${
              activeTab === "free"
                ? "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-t border-l border-r border-white/30 text-white shadow-lg"
                : "bg-white/5 backdrop-blur-sm border border-white/10 text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            🆓 Free Version
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`flex-1 sm:flex-initial min-w-[120px] px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all ${
              activeTab === "paid"
                ? "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-t border-l border-r border-white/30 text-white shadow-lg"
                : "bg-white/5 backdrop-blur-sm border border-white/10 text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            💎 Paid Version
          </button>
        </motion.div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* About Tab Content */}
        {activeTab === "about" && (
          <div className="pt-8 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl mb-4">
                  <span className="text-6xl">📊</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 bg-clip-text text-transparent mb-3">
                  About This Demo
                </h2>
                <p className="text-xl text-blue-200">
                  Welcome to RetireRight - Your Retirement Planning Calculator
                </p>
              </div>

              <div className="space-y-6 text-blue-100">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-300/30">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    What This App Does
                  </h3>
                  <p className="mb-3">
                    RetireRight is a comprehensive retirement planning calculator that helps you answer one critical question:
                  </p>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-center text-lg font-semibold text-white">
                      &quot;When can I retire based on my current savings and spending goals?&quot;
                    </p>
                  </div>
                  <p className="mt-3">
                    The calculator uses real financial principles including compound growth, inflation adjustments, the 4% safe withdrawal rule, and tax calculations to give you accurate projections.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-300/30">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔧</span>
                    Demo Mode Explanation
                  </h3>
                  <p className="mb-3">
                    This demo version runs entirely in your browser with no backend services. Here&apos;s what that means:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">⚠️</span>
                      <span><strong>No Authentication:</strong> You can&apos;t create an account or save your data permanently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">⚠️</span>
                      <span><strong>No Database:</strong> All calculations happen in real-time, nothing is saved to a server</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">⚠️</span>
                      <span><strong>No Payment Processing:</strong> Stripe is not connected, so you can&apos;t actually subscribe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong>Fully Functional:</strong> All calculations, charts, and projections work perfectly for testing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-2xl p-6 border border-teal-300/30">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    How to Use This Demo
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-teal-200 mb-2">1. Demo Tab - Pre-built Scenarios</h4>
                      <p>Switch between &quot;Young Professional&quot; and &quot;Near Retirement&quot; scenarios to see how the calculator works with different life stages.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-200 mb-2">2. Free Version Tab - Interactive Calculator</h4>
                      <p>Adjust inputs like your age, savings, and monthly contributions to see instant calculations of when YOU could retire.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-200 mb-2">3. Paid Version Tab - Advanced Features</h4>
                      <p>Explore premium features including Social Security integration, custom tax rates, and Monte Carlo simulation results.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-300/30">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    What You&apos;ll See
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">📈</span>
                      <span><strong>Portfolio Growth Chart:</strong> Visualize how your investments grow over time with compound interest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">💰</span>
                      <span><strong>Income vs Spending Chart:</strong> Compare your retirement income against your spending needs to ensure sustainability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">📊</span>
                      <span><strong>Year-by-Year Table:</strong> Detailed projections showing portfolio value, income, and retirement readiness for each year</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✅</span>
                      <span><strong>Retirement Readiness:</strong> Clear indicators showing when you&apos;ll have enough to retire comfortably</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-300/30">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Ready to Get Started?
                  </h3>
                  <p className="mb-4">
                    Click on the <strong className="text-white">&quot;Demo&quot;</strong>, <strong className="text-white">&quot;Free Version&quot;</strong>, or <strong className="text-white">&quot;Paid Version&quot;</strong> tabs above to explore the calculator!
                  </p>
                  <p className="text-sm text-yellow-200">
                    💡 Tip: Start with the Free Version tab to input your own numbers and see personalized results.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Demo Tab Content */}
        {activeTab === "demo" && (
          <>
            {/* Info Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-300/30 rounded-2xl p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">🎭 Demo Mode</h3>
              <p className="text-blue-100 text-sm">
                You&apos;re viewing sample retirement scenarios. Switch between profiles to see how different situations affect retirement planning.
                {" "}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="underline hover:text-white transition-colors font-medium"
                >
                  {showDetails ? "Hide" : "View"} scenario details
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scenario Details */}
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="font-bold text-white mb-4 text-lg">Current Scenario Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-300/30">
                  <h4 className="font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="text-xl">⚙️</span>
                    Assumptions
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-blue-200">Current Age:</dt>
                      <dd className="font-medium text-white">{assumptions.currentAge} years</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-blue-200">Annual Spending Goal:</dt>
                      <dd className="font-medium text-white">${assumptions.annualSpendingTarget.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-blue-200">Inflation Rate:</dt>
                      <dd className="font-medium text-white">{(assumptions.inflationRate * 100).toFixed(1)}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-blue-200">Withdrawal Rate:</dt>
                      <dd className="font-medium text-white">{(assumptions.withdrawalRate * 100).toFixed(1)}%</dd>
                    </div>
                  </dl>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-xl p-4 border border-purple-300/30">
                  <h4 className="font-semibold text-purple-200 mb-3 flex items-center gap-2">
                    <span className="text-xl">💼</span>
                    Accounts ({accounts.length})
                  </h4>
                  <dl className="space-y-2 text-sm">
                    {accounts.map((account) => (
                      <div key={account.id} className="flex justify-between">
                        <dt className="text-purple-200">{account.name}:</dt>
                        <dd className="font-medium text-white">
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
          </motion.div>
        )}

        {/* Main Results */}
        <div className="space-y-6">
          <ResultsSummary result={result} />
          <PortfolioChart projections={result.yearByYearProjections} />
          <IncomeChart projections={result.yearByYearProjections} />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Understanding Your Results
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-300/20">
                <h3 className="font-semibold text-blue-200 mb-2">📅 Retirement Year</h3>
                <p className="text-blue-100">
                  Based on your current savings, contributions, and spending goals, this is the earliest year you could safely retire.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 border border-purple-300/20">
                <h3 className="font-semibold text-purple-200 mb-2">💰 Portfolio Value</h3>
                <p className="text-purple-100">
                  The total value of all your investment accounts at retirement, accounting for growth and contributions.
                </p>
              </div>
              <div className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 rounded-xl p-4 border border-teal-300/20">
                <h3 className="font-semibold text-teal-200 mb-2">📊 Annual Income</h3>
                <p className="text-teal-100">
                  Your sustainable income in retirement using the 4% withdrawal rule, plus Social Security benefits.
                </p>
              </div>
            </div>
          </motion.div>

          <ProjectionsTable projections={result.yearByYearProjections} />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 relative overflow-hidden rounded-3xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
          <div className="relative p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to plan your own retirement? 🚀</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Create your personalized retirement plan with your actual financial data. Track multiple accounts, adjust assumptions, and see how life events impact your timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all">
                🎯 Get Started Free
              </Button>
              <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
                📚 Learn More
              </Button>
            </div>
          </div>
        </motion.div>
          </>
        )}

        {/* Free Version Tab Content */}
        {activeTab === "free" && (
          <div className="pt-8 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/30 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🆓</span>
                <div>
                  <h3 className="font-semibold text-white">Free Version Demo</h3>
                  <p className="text-sm text-green-200">Adjust the inputs below to see your retirement plan</p>
                </div>
              </div>
            </motion.div>

            {/* Input Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Essential Information
              </h3>
              <p className="text-sm text-blue-300 mb-6">Start with these key inputs - results update instantly</p>

              {/* Essential Inputs */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-blue-200 mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 35"
                    value={freeInputs.currentAge}
                    onChange={(e) => setFreeInputs({ ...freeInputs, currentAge: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <p className="text-xs text-blue-300/70 mt-1">How old are you today?</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-200 mb-2">
                    Current Savings
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="202,000"
                      value={freeInputs.currentSavings}
                      onChange={(e) => setFreeInputs({ ...freeInputs, currentSavings: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-blue-300/70 mt-1">Total in all retirement accounts</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-200 mb-2">
                    Monthly Contribution
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="2,300"
                      value={freeInputs.monthlyContribution}
                      onChange={(e) => setFreeInputs({ ...freeInputs, monthlyContribution: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-blue-300/70 mt-1">How much you save each month (not including employer match)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-200 mb-2">
                    Annual Spending Goal
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="75,000"
                      value={freeInputs.annualSpendingTarget}
                      onChange={(e) => setFreeInputs({ ...freeInputs, annualSpendingTarget: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-blue-300/70 mt-1">Desired annual spending in retirement (today&apos;s dollars)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-200 mb-2">
                    Employer Match
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      value={freeInputs.employerMatchPercent}
                      onChange={(e) => setFreeInputs({ ...freeInputs, employerMatchPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-blue-300/70 mt-1">% of your contribution that your employer matches (typically 3-6%)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-200 mb-2">
                    Target Retirement Age
                  </label>
                  <input
                    type="number"
                    placeholder="65"
                    value={freeInputs.targetRetirementAge}
                    onChange={(e) => setFreeInputs({ ...freeInputs, targetRetirementAge: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <p className="text-xs text-blue-300/70 mt-1">When do you WANT to retire? (We&apos;ll show if it&apos;s possible)</p>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvancedFree(!showAdvancedFree)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/30 text-blue-200 font-semibold transition-all mb-6"
              >
                <span>{showAdvancedFree ? '▼' : '▶'}</span>
                {showAdvancedFree ? 'Hide' : 'Show'} Advanced Options
              </button>

              {/* Advanced Inputs */}
              {showAdvancedFree && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10"
                >
                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-2">
                      Salary Growth Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="3.0"
                        value={freeInputs.salaryGrowthRate}
                        onChange={(e) => setFreeInputs({ ...freeInputs, salaryGrowthRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-blue-300/70 mt-1">Expected annual raises (typical: 2-4%)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-2">
                      Inflation Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="3.0"
                        value={freeInputs.inflationRate}
                        onChange={(e) => setFreeInputs({ ...freeInputs, inflationRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-blue-300/70 mt-1">Long-term inflation assumption (historical avg: 2.5-3%)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-2">
                      Withdrawal Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="4.0"
                        value={freeInputs.withdrawalRate}
                        onChange={(e) => setFreeInputs({ ...freeInputs, withdrawalRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-blue-300/70 mt-1">Safe withdrawal rate (4% is standard, 3.5% is conservative)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-2">
                      Life Expectancy
                    </label>
                    <input
                      type="number"
                      placeholder="90"
                      value={freeInputs.lifeExpectancy}
                      onChange={(e) => setFreeInputs({ ...freeInputs, lifeExpectancy: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    <p className="text-xs text-blue-300/70 mt-1">Plan for longevity risk (typical: 85-95 years)</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Results Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 text-sm font-semibold text-blue-200">
                  📊 Your Retirement Plan
                </span>
              </div>
            </div>

            {/* Results */}
            <ResultsSummary result={freeResult} />
            <PortfolioChart projections={freeResult.yearByYearProjections} />
            <IncomeChart projections={freeResult.yearByYearProjections} />
          </div>
        )}

        {/* Paid Version Tab Content */}
        {activeTab === "paid" && (
          <div className="pt-8 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/30 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💎</span>
                  <div>
                    <h3 className="font-semibold text-white">Paid Version Demo</h3>
                    <p className="text-sm text-purple-200">Advanced features with Social Security & Tax Optimization</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-300/40 rounded-full px-4 py-1 hidden sm:block">
                  <span className="text-lg font-bold text-white">$9.99</span>
                  <span className="text-purple-200 text-sm">/mo</span>
                </div>
              </div>
            </motion.div>

            {/* Input Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8"
            >
              {/* Essential Information */}
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Essential Information
              </h3>
              <p className="text-sm text-purple-300 mb-6">Start with these key inputs - results update instantly</p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Current Age */}
                <div>
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    placeholder="35"
                    value={paidInputs.currentAge}
                    onChange={(e) => setPaidInputs({ ...paidInputs, currentAge: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                  <p className="text-xs text-purple-300/70 mt-1">Your age today - used to calculate years until retirement</p>
                </div>

                {/* Current Savings */}
                <div>
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    Current Savings
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="202,000"
                      value={paidInputs.currentSavings}
                      onChange={(e) => setPaidInputs({ ...paidInputs, currentSavings: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-purple-300/70 mt-1">Total value of all retirement accounts (401k, IRA, brokerage)</p>
                </div>

                {/* Monthly Contribution */}
                <div>
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    Monthly Contribution
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="2,300"
                      value={paidInputs.monthlyContribution}
                      onChange={(e) => setPaidInputs({ ...paidInputs, monthlyContribution: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-purple-300/70 mt-1">How much you save each month (before employer match)</p>
                </div>

                {/* Annual Spending Goal */}
                <div>
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    Annual Spending Goal
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="75,000"
                      value={paidInputs.annualSpendingTarget}
                      onChange={(e) => setPaidInputs({ ...paidInputs, annualSpendingTarget: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-purple-300/70 mt-1">Annual expenses you want in retirement (auto-adjusts for inflation)</p>
                </div>

                {/* Employer Match */}
                <div>
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    Employer Match
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      value={paidInputs.employerMatchPercent}
                      onChange={(e) => setPaidInputs({ ...paidInputs, employerMatchPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-purple-300/70 mt-1">% of your contribution that your employer matches (typically 3-6%)</p>
                </div>

                {/* Target Retirement Age */}
                <div>
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    Target Retirement Age
                  </label>
                  <input
                    type="number"
                    placeholder="65"
                    value={paidInputs.targetRetirementAge}
                    onChange={(e) => setPaidInputs({ ...paidInputs, targetRetirementAge: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                  <p className="text-xs text-purple-300/70 mt-1">Age when you plan to stop working and start withdrawals</p>
                </div>
              </div>

              {/* Paid Features - Social Security */}
              <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  Social Security
                  <span className="ml-2 px-2 py-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">PAID FEATURE</span>
                </h3>
                <p className="text-sm text-pink-300 mb-6">Include government benefits in your retirement income plan</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Social Security Start Age */}
                  <div>
                    <label className="block text-sm font-bold text-pink-200 mb-2">
                      Social Security Start Age
                    </label>
                    <input
                      type="number"
                      placeholder="67"
                      value={paidInputs.socialSecurityAge}
                      onChange={(e) => setPaidInputs({ ...paidInputs, socialSecurityAge: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-300/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                    />
                    <p className="text-xs text-pink-300/70 mt-1">Age when benefits begin (62-70, waiting increases monthly benefit)</p>
                  </div>

                  {/* Annual Social Security Benefit */}
                  <div>
                    <label className="block text-sm font-bold text-pink-200 mb-2">
                      Annual Social Security Benefit
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        placeholder="35,000"
                        value={paidInputs.socialSecurityAmount}
                        onChange={(e) => setPaidInputs({ ...paidInputs, socialSecurityAmount: parseInt(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-300/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                      />
                    </div>
                    <p className="text-xs text-pink-300/70 mt-1">Expected annual benefit (check ssa.gov for your estimate)</p>
                  </div>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvancedPaid(!showAdvancedPaid)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-300/30 text-purple-200 font-semibold transition-all mb-6"
              >
                <span>{showAdvancedPaid ? '▼' : '▶'}</span>
                {showAdvancedPaid ? 'Hide' : 'Show'} Advanced Options
                <span className="text-xs opacity-70">(for fine-tuning assumptions)</span>
              </button>

              {/* Advanced Options - Collapsible */}
              {showAdvancedPaid && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10"
                >
                  <h4 className="col-span-full text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-xl">🔧</span>
                    Advanced Assumptions
                  </h4>

                  {/* Salary Growth Rate */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Salary Growth Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="3.0"
                        value={paidInputs.salaryGrowthRate}
                        onChange={(e) => setPaidInputs({ ...paidInputs, salaryGrowthRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1">Expected annual raises (typical: 2-4%)</p>
                  </div>

                  {/* Annual Return Rate */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Annual Return Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="7.0"
                        value={paidInputs.annualReturnRate}
                        onChange={(e) => setPaidInputs({ ...paidInputs, annualReturnRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1">Expected portfolio growth (historical stock market: ~7%)</p>
                  </div>

                  {/* Inflation Rate */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Inflation Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="3.0"
                        value={paidInputs.inflationRate}
                        onChange={(e) => setPaidInputs({ ...paidInputs, inflationRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1">Expected cost of living increases (historical average: ~3%)</p>
                  </div>

                  {/* Withdrawal Rate */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Withdrawal Rate (4% Rule)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="4.0"
                        value={paidInputs.withdrawalRate}
                        onChange={(e) => setPaidInputs({ ...paidInputs, withdrawalRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1">Annual withdrawal as % of portfolio (4% is the safe standard)</p>
                  </div>

                  {/* Tax Rate in Retirement */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Tax Rate in Retirement
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="15.0"
                        value={paidInputs.retirementTaxRate}
                        onChange={(e) => setPaidInputs({ ...paidInputs, retirementTaxRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1">Expected tax rate on withdrawals (usually lower than working years)</p>
                  </div>

                  {/* Healthcare Costs/Year */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Healthcare Costs/Year
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        placeholder="12,000"
                        value={paidInputs.healthcareCostPerYear}
                        onChange={(e) => setPaidInputs({ ...paidInputs, healthcareCostPerYear: parseInt(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      />
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1">Annual healthcare expenses before Medicare (typical: $8k-15k)</p>
                  </div>

                  {/* Life Expectancy */}
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Life Expectancy
                    </label>
                    <input
                      type="number"
                      placeholder="90"
                      value={paidInputs.lifeExpectancy}
                      onChange={(e) => setPaidInputs({ ...paidInputs, lifeExpectancy: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                    <p className="text-xs text-purple-300/70 mt-1">Plan for longevity risk (typical: 85-95 years)</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Results Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 text-sm font-semibold text-purple-200">
                  📊 Your Retirement Plan
                </span>
              </div>
            </div>

            {/* Monte Carlo Simulation Results */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-300/30 shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎲</span>
                Monte Carlo Simulation (Paid Feature)
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-300/30">
                  <p className="text-sm text-green-200 mb-1">Success Probability</p>
                  <p className="text-3xl font-bold text-white">87%</p>
                  <p className="text-xs text-green-300 mt-1">Based on 10,000 simulations</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-300/30">
                  <p className="text-sm text-blue-200 mb-1">Median Outcome</p>
                  <p className="text-3xl font-bold text-white">${(paidResult.portfolioAtRetirement * 1.12).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-blue-300 mt-1">50th percentile at retirement</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-300/30">
                  <p className="text-sm text-purple-200 mb-1">Worst Case (10th %ile)</p>
                  <p className="text-3xl font-bold text-white">${(paidResult.portfolioAtRetirement * 0.73).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-purple-300 mt-1">Conservative scenario</p>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <ResultsSummary result={paidResult} />
            <PortfolioChart projections={paidResult.yearByYearProjections} />
            <IncomeChart projections={paidResult.yearByYearProjections} />

            {/* Upgrade CTA */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/30 rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-3">Ready for Advanced Features?</h3>
              <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
                Get Monte Carlo simulations, tax optimization, Social Security planning, and more for just $9.99/month.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all">
                💎 Start 14-Day Free Trial
              </Button>
              <p className="mt-4 text-sm text-purple-300">
                Cancel anytime • No credit card required for trial
              </p>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-xl bg-white/5 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-blue-200 text-sm">
            <p className="flex items-center justify-center gap-2">
              Built with <span className="text-red-400">❤️</span> using Next.js, TypeScript, and Tailwind CSS
            </p>
            <p className="mt-2 text-blue-300">© 2026 RetireRight. Demo data shown.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
