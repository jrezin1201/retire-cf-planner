"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { YearProjection } from "@/lib/types/calculator";

interface IncomeChartProps {
  projections: YearProjection[];
}

export function IncomeChart({ projections }: IncomeChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(value);
  };

  // Sample every few years for cleaner chart
  const chartData = projections.filter((_, idx) => idx % 2 === 0).map((p) => ({
    year: p.year,
    income: p.afterTaxIncome,
    spending: p.inflationAdjustedSpending,
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 pointer-events-none" />

      <div className="relative p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent">
              Income vs Spending
            </h2>
          </div>
          <p className="text-green-200 text-sm ml-[52px]">
            Compare your retirement income against your spending needs
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl p-6 border border-white/10">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis
                dataKey="year"
                stroke="#93c5fd"
                style={{ fontSize: '12px', fill: '#93c5fd' }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                stroke="#93c5fd"
                style={{ fontSize: '12px', fill: '#93c5fd' }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  color: '#e0f2fe',
                  padding: '12px',
                }}
                labelStyle={{ color: '#bae6fd', fontWeight: 'bold', marginBottom: '8px' }}
                itemStyle={{ color: '#e0f2fe' }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  color: '#bae6fd'
                }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="url(#incomeGradient)"
                strokeWidth={3}
                name="Retirement Income"
                dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="url(#spendingGradient)"
                strokeWidth={3}
                name="Spending Target"
                dot={{ fill: '#fb923c', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#fb923c', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart legend explanation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-300/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded" />
              <span className="text-sm font-semibold text-green-200">Retirement Income</span>
            </div>
            <p className="text-xs text-green-100">Sustainable annual income from your portfolio withdrawals (4% rule) plus Social Security and pension benefits</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm rounded-xl p-4 border border-orange-300/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded" />
              <span className="text-sm font-semibold text-orange-200">Spending Target</span>
            </div>
            <p className="text-xs text-orange-100">Your desired annual spending, adjusted for inflation over time to maintain purchasing power</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
