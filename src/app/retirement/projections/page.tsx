"use client";

import { useRetirementData } from "@/modules/retirement/hooks/useRetirementData";
import { ProjectionsTable } from "@/modules/retirement/components/ProjectionsTable";
import Link from "next/link";

export default function ProjectionsPage() {
  const { result, loading, error } = useRetirementData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "No data available"}</p>
          <Link href="/retirement/assumptions" className="text-blue-600 hover:text-blue-700">
            Set up your assumptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/retirement" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Year-by-Year Projections</h1>

        <ProjectionsTable projections={result.yearByYearProjections} />
      </div>
    </div>
  );
}
