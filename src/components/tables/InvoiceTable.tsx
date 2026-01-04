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
import Button from "../ui/button/Button";
import { EyeIcon } from "@/icons";

interface InvoiceRow {
  id: number;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  totalAmount: string;
  engine: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  type: string;
  pages: string;
  source: string;
  processedAt?: string;
  status: "Processed" | "Pending" | "Canceled";
  image?: string;
}

const parseExtractedJson = (value: string) => {
  try {
    return JSON.parse(value.replace(/'/g, '"'));
  } catch {
    return null;
  }
};

export default function InvoiceTable() {
  const [tableData, setTableData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        //213.199.62.14
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices?limit=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const mapped: Product[] = data.map((inv: any) => {
          const extracted = parseExtractedJson(inv.extracted_json);

          return {
            id: inv.id,
            name:
              extracted?.invoice_details?.invoice_number ||
              inv.file_name ||
              "Invoice",
            type: "pdf",
            pages:
              extracted?.invoice_details?.page_count?.toString() || "-",
            source: inv.engine || "OLM OCR",
            processedAt:
              extracted?.invoice_details?.invoice_date || "-",
            status:
              inv.status === "processed"
                ? "Processed"
                : inv.status === "pending"
                  ? "Pending"
                  : "Canceled",
          };
        });

        setTableData(mapped);
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
    <div className="overflow-hidden bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Document</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Pages</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Source</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Processed At</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <p className="font-medium">{product.name}</p>
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{product.type}</TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Processed"
                        ? "success"
                        : product.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{product.pages}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{product.source}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{product.processedAt}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Button size="sm" variant="outline" startIcon={<EyeIcon/>} href={`/invoices/${product.id}`}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
