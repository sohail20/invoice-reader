"use client";
import { useEffect, useState } from "react";
import { BoxIconLine, FileIcon } from "@/icons";

export const EcommerceMetrics = () => {
  const [analytics, setAnalytics] = useState({
    total_invoices: 0,
    total_processed: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://213.199.62.14:8000/invoices/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics({
          total_invoices: data.total_invoices,
          total_processed: data.total_processed,
        });
      } catch (error) {
        console.error("Error fetching invoice analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Processed Invoices */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Processed Invoices
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {analytics.total_processed}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Invoices */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Invoices
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {analytics.total_invoices}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
