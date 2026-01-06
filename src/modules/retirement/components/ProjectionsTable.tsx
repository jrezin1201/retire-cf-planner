"use client";

import { motion } from "framer-motion";
import type { YearProjection } from "@/lib/types/calculator";

interface ProjectionsTableProps {
  projections: YearProjection[];
}

export function ProjectionsTable({ projections }: ProjectionsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Show every year for the first 10 years, then every 5 years
  const filteredProjections = projections.filter((p, idx) => {
    if (idx < 10) return true;
    return idx % 5 === 0;
  });

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="px-6 py-6 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 bg-clip-text text-transparent">
                Year-by-Year Projections
              </h2>
              <p className="text-blue-200 text-sm">
                Detailed breakdown of your retirement journey
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Portfolio Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Retirement Income
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Spending Target
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProjections.map((projection, idx) => (
                <motion.tr
                  key={projection.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.02 }}
                  className={`transition-all hover:bg-white/5 ${
                    projection.canRetire
                      ? "bg-gradient-to-r from-green-500/10 to-emerald-500/5"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {projection.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                    {projection.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {formatCurrency(projection.portfolioValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-200">
                    {formatCurrency(projection.afterTaxIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-200">
                    {formatCurrency(projection.inflationAdjustedSpending)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {projection.canRetire ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                        <span className="text-green-300 font-semibold">Can Retire</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-amber-400">Not Yet</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
          <p className="text-xs text-blue-300 text-center">
            💡 Projections assume consistent contributions and returns. Actual results may vary based on market conditions.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
