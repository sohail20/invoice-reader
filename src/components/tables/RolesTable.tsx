"use client";

import React, { useEffect } from "react";
import GenericTable, { Column } from "@/components/common/GenericTable";
import Button from "../ui/button/Button";
import { EyeIcon } from "@/icons";
import { formatDateDDMMYYYY } from "@/utils/helper";
import { useGetRolesQuery } from "@/store/services/rolesApi";

interface RoleRow {
    id: number;
    name: string;
    created_at: string;
}

export default function RolesTable() {
    const { data, isLoading, isError } = useGetRolesQuery({ page: 1, limit: 10 });

    // Map API data to RoleRow format
    const mappedData: RoleRow[] =
        data?.map((role: any) => ({
            id: role.id,
            name: role.name,
            created_at: formatDateDDMMYYYY(role.created_at),
        })) ?? [];

    const columns: Column<RoleRow>[] = [
        {
            key: "id",
            header: "ID",
            render: (row) => <p className="font-medium">{row.id}</p>,
        },
        { key: "name", header: "Name" },
        { key: "created_at", header: "Created At" },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <Button
                    size="sm"
                    variant="outline"
                    startIcon={<EyeIcon />}
                    href={`/roles/${row.id}`}
                >
                    View
                </Button>
            ),
        },
    ];

    if (isLoading) {
        return <div className="p-4">Loading roles...</div>;
    }

    if (isError) {
        return <div className="p-4 text-red-500">Failed to load roles</div>;
    }

    return (
        <div className="overflow-hidden bg-white px-4 pb-3 pt-4 dark:bg-white/[0.03] sm:px-6">
            <GenericTable data={mappedData} columns={columns} rowKey={(row) => row.id} />
        </div>
    );
}
