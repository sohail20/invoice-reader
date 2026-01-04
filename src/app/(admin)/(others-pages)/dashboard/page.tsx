'use client'

import RecentOrders from "@/components/ecommerce/RecentOrders";
import KeyMetrics from "@/components/keymetrics/KeyMetrics";
import { useState } from "react";
import GenericSelect from "@/components/form/form-elements/SelectInputs";
import Input from "@/components/form/input/InputField";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Button from "@/components/ui/button/Button";
import { DownloadIcon, UploadIcon } from "@/icons";

export default function Dashboard() {

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const [value, setValue] = useState<string>("");

  return (
    <div>
      <div className="w-full mt-5">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
          {/* Left: Title & Description */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Overview
            </h1>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400 max-w-2xl">
              Monitor OCR usage, pipeline health, and recent document activity across your workspace.
            </p>
          </div>

          {/* Right: Actions */}
          <div className="col-span-12 lg:col-span-4 flex gap-2 justify-start lg:justify-end">
            <Button
              size="sm"
              variant="outline"
              startIcon={<DownloadIcon />}
            >
              Export Report
            </Button>

            <Button
              href="/invoices/create"
              size="sm"
              startIcon={<UploadIcon />}
            >
              Upload New
            </Button>
          </div>
        </div>
      </div>


      {/* <Buttons/> */}
      <div className="grid grid-cols-6 gap-4 md:gap-6 mt-5">
        <Input placeholder="Search recent doc" />
        <GenericSelect
          options={options}
          value={value}
          placeholder="Select Option"
          onChange={(val) => {
            console.log("Selected:", val);
            setValue(val);
          }}
          className="dark:bg-dark-900"
        />
        <div></div>
        <div></div>
        <div></div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <svg
            className="stroke-current fill-white dark:fill-gray-800"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.29004 5.90393H17.7067"
              stroke=""
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.7075 14.0961H2.29085"
              stroke=""
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
              fill=""
              stroke=""
              strokeWidth="1.5"
            />
            <path
              d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
              fill=""
              stroke=""
              strokeWidth="1.5"
            />
          </svg>
          Filter
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 mt-5">

        <div className="col-span-12">
          <KeyMetrics />
        </div>

        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
          <MonthlySalesChart />
        </div> */}

        <div className="col-span-12 xl:col-span-5">
          <DropzoneComponent />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}
      </div>
    </div>
  );
}
