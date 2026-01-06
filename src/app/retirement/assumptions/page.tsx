"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AssumptionsForm } from "@/modules/retirement/components/AssumptionsForm";
import Link from "next/link";

interface Assumptions {
  annualSpendingTarget: number;
  inflationRate: number;
  retirementTaxRate: number;
  withdrawalRate: number;
  retirementGrowthRate: number;
  currentAge: number;
  desiredRetirementAge?: number | null;
  lifeExpectancy?: number;
  investmentFeeRate: number;
}

export default function AssumptionsPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Assumptions | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssumptions();
  }, []);

  const fetchAssumptions = async () => {
    try {
      const response = await fetch("/api/assumptions");
      if (response.ok) {
        const data = await response.json();
        setInitialData(data);
      }
    } catch (error) {
      console.error("Failed to fetch assumptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    router.push("/retirement");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/retirement" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Retirement Assumptions</h1>

        <AssumptionsForm initialData={initialData} onSave={handleSave} />
      </div>
    </div>
  );
}
