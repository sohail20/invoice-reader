"use client";

import React, { useEffect, useState } from "react";
import GenericTable, { Column } from "@/components/common/GenericTable";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { EyeIcon } from "@/icons";
import { formatDateDDMMYYYY } from "@/utils/helper";

interface Product {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: string;
  roles: string[]
  status: "Processed" | "Pending" | "Canceled";
}

export default function UsersTable() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = await res.json();

      const mapped: Product[] = raw.map((user: any) => ({
        id: user.id,
        name: user.name || "Invoice",
        email: user.email,
        created_at: formatDateDDMMYYYY(user.created_at) || "-",
        is_active: user.is_active || "OCR",
        roles: user.roles || "-",
      }));

      setData(mapped);
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  const columns: Column<Product>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => <p className="font-medium">{row.id}</p>,
    },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "created_at", header: "Create At" },
    { key: "is_active", header: "Active" },
    {
      key: "roles",
      header: "Status",
      render: (row) => (
        <Badge
          size="sm"
          color={
            row?.roles?.length > 1 ? "success" : "warning"
          }
        >
          {row?.roles?.length > 1 ? "Multiple Roles" : row?.roles[0] || "-"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          startIcon={<EyeIcon />}
          href={`/users/${row.id}`}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) return <div className="p-4">Loading invoices...</div>;

  return (
    <div className="overflow-hidden bg-white px-4 pb-3 pt-4 dark:bg-white/[0.03] sm:px-6">
      <GenericTable
        data={data}
        columns={columns}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
