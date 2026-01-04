"use client";

import React, { useEffect, useState } from "react";
import ChartTab from "../common/ChartTab";

interface AnalyticsResponse {
  total_invoices: number;
  total_processed: number;
  total_pending: number;
  total_amount: number;
  pages_processed: number;
  extract_success: number;
  avg_latency: number;
  active_users: number;
}

export default function KeyMetrics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token"); // adjust key if needed

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const json: AnalyticsResponse = await res.json();
        setData(json);
      } catch (error) {
        console.error("Analytics API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Key metrics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            OCR pages, success rate, and processing latency
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {/* Pages Processed */}
        <MetricCard
          label="Pages Processed"
          value={data?.pages_processed ?? 0}
        />

        {/* Extract Success */}
        <MetricCard
          label="Extract Success"
          value={`${data?.extract_success ?? 0}%`}
        />

        {/* Avg Latency */}
        <MetricCard
          label="Avg. Latency"
          value={`${data?.avg_latency ?? 0} ms`}
        />

        {/* Active Users */}
        <MetricCard
          label="Active Users"
          value={data?.active_users ?? 0}
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {value}
      </h4>
    </div>
  );
}
