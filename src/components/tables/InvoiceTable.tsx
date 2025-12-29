"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface InvoiceRow {
  id: number;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  totalAmount: string;
  engine: string;
  status: string;
}

const parseExtractedJson = (value: string) => {
  try {
    return JSON.parse(value.replace(/'/g, '"'));
  } catch {
    return null;
  }
};

export default function InvoiceTable() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/invoices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const mapped: InvoiceRow[] = data.map((inv: any) => {
          const extracted = parseExtractedJson(inv.extracted_json);

          return {
            id: inv.id,
            invoiceNumber:
              extracted?.invoice_details?.invoice_number || "-",
            customerName:
              extracted?.customer_details?.customer_name || "-",
            invoiceDate:
              extracted?.invoice_details?.invoice_date || "-",
            totalAmount:
              extracted?.totals?.net_amount_with_vat || "-",
            engine:
              inv?.engine || "-",
            status: inv.status,
          };
        });

        setRows(mapped);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div className="p-4">Loading invoices...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>Invoice #</TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>Customer</TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>Invoice Date</TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>Total Amount</TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>Engine</TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{row.invoiceNumber}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{row.customerName}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{row.invoiceDate}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{row.totalAmount}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{row.engine}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      row.status === "processed"
                        ? "success"
                        : row.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
