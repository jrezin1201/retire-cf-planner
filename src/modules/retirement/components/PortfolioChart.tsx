"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { YearProjection } from "@/lib/types/calculator";

interface PortfolioChartProps {
  projections: YearProjection[];
}

export function PortfolioChart({ projections }: PortfolioChartProps) {
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
    portfolio: p.portfolioValue,
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 pointer-events-none" />

      <div className="relative p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📈</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 bg-clip-text text-transparent">
              Portfolio Growth Over Time
            </h2>
          </div>
          <p className="text-blue-200 text-sm ml-[52px]">
            Track your total investment portfolio value as it grows toward retirement
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl p-6 border border-white/10">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
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
                dataKey="portfolio"
                stroke="url(#portfolioGradient)"
                strokeWidth={3}
                name="Portfolio Value"
                dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart explanation */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-300/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded" />
              <span className="text-sm font-semibold text-blue-200">Portfolio Value</span>
            </div>
            <p className="text-xs text-blue-100">Shows the total value of all your investment accounts over time, including contributions, compound growth at your expected return rate, and any one-time events. This is your total nest egg growing toward retirement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
