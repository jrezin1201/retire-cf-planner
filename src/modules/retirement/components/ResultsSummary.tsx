"use client";

import { motion } from "framer-motion";
import type { RetirementResult } from "@/lib/types/calculator";

interface ResultsSummaryProps {
  result: RetirementResult;
  showTaxNote?: boolean;
  taxRate?: number;
}

export function ResultsSummary({ result, showTaxNote = false, taxRate = 22 }: ResultsSummaryProps) {
  const isOnTrack = result.annualIncomeAtRetirement >= result.targetSpendingAtRetirement;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      useGrouping: true, // Explicitly enable thousand separators (commas)
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10" />

      <div className="relative p-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <p className="text-blue-200 text-sm font-medium mb-2 tracking-wide uppercase">
              Your Retirement Projection
            </p>
            <h2 className="text-5xl md:text-6xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 bg-clip-text text-transparent">
                {result.retirementYear}
              </span>
            </h2>
            <p className="text-2xl text-blue-100">
              Age <span className="font-semibold text-white">{result.retirementAge}</span>
            </p>
          </motion.div>
        </div>

        <div className="space-y-3 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-2xl border border-blue-300/30 shadow-lg hover:shadow-2xl transition-shadow group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="relative flex flex-col items-center justify-center py-4">
              <span className="text-3xl mb-2">💼</span>
              <p className="text-xs font-semibold text-blue-200 mb-2 uppercase tracking-wider text-center">Portfolio at Retirement</p>
              <p className="text-3xl font-bold text-white text-center">
                {formatCurrency(result.portfolioAtRetirement)}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-600/10 backdrop-blur-xl rounded-2xl border border-green-300/30 shadow-lg hover:shadow-2xl transition-shadow group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="relative flex flex-col items-center justify-center py-4">
              <span className="text-3xl mb-2">💰</span>
              <p className="text-xs font-semibold text-green-200 mb-2 uppercase tracking-wider text-center">Annual Income (After-Tax)</p>
              <p className="text-3xl font-bold text-white text-center">
                {formatCurrency(result.annualIncomeAtRetirement)}
              </p>
              {showTaxNote && (
                <p className="text-[10px] text-green-300/70 mt-2 text-center">
                  Assumes {taxRate}% tax on withdrawals
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-600/10 backdrop-blur-xl rounded-2xl border border-purple-300/30 shadow-lg hover:shadow-2xl transition-shadow group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="relative flex flex-col items-center justify-center py-4">
              <span className="text-3xl mb-2">🎯</span>
              <p className="text-xs font-semibold text-purple-200 mb-2 uppercase tracking-wider text-center">Target Spending</p>
              <p className="text-3xl font-bold text-white text-center">
                {formatCurrency(result.targetSpendingAtRetirement)}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`relative overflow-hidden rounded-2xl p-6 shadow-xl ${
            isOnTrack
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/40"
              : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-300/40"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{isOnTrack ? "✅" : "⚠️"}</span>
            <div className="text-center">
              <p className={`text-xl font-bold ${isOnTrack ? "text-green-100" : "text-yellow-100"}`}>
                {isOnTrack ? "You're On Track!" : "Needs Adjustment"}
              </p>
              {!isOnTrack && (
                <p className="text-sm text-yellow-200 mt-1">
                  Your projected income is below your target spending. Consider adjusting your assumptions or savings.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
