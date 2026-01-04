"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "@/icons";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import Button from "@/components/ui/button/Button";

export default function SelectInputs() {
  const options = [
    { value: "olmocr", label: "OLM OCR" },
    { value: "tesseract", label: "Tesseract OCR" },
    { value: "paddle", label: "Paddle OCR" }, // future
  ];

  const [engine, setEngine] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleSelectChange = (value: string) => {
    setEngine(value);
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
  };

  const handleProcess = async () => {
    if (!engine) {
      setError("Please select OCR engine");
      return;
    }
    if (!file) {
      setError("Please upload an invoice file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("engine", engine);
      formData.append("file", file);
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/ocr`, {
        method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // IMPORTANT
          },
        body: formData,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "OCR request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Create Invoice">
      <div className="space-y-6">
        {/* OCR Engine */}
        <div>
          <Label>Select OCR Engine</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select Option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <FileInputExample
            title="Upload Invoice"
            onFileSelect={handleFileChange} // make sure component supports this
          />
        </div>

        {/* Action */}
        <Button
          variant="outline"
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? "Processing..." : "Process Invoice"}
        </Button>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Result */}
        {result && (
          <pre className="mt-4 max-h-96 overflow-auto rounded bg-gray-900 p-4 text-green-400 text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </ComponentCard>
  );
}
