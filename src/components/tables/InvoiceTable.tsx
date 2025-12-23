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
        const res = await fetch("http://localhost:8000/invoices");
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
              <TableCell isHeader>Invoice #</TableCell>
              <TableCell isHeader>Customer</TableCell>
              <TableCell isHeader>Invoice Date</TableCell>
              <TableCell isHeader>Total Amount</TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.invoiceNumber}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.invoiceDate}</TableCell>
                <TableCell>{row.totalAmount}</TableCell>
                <TableCell>
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
