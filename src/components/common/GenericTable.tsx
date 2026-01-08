"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
}

export default function GenericTable<T>({
  data,
  columns,
  rowKey,
}: GenericTableProps<T>) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        <TableHeader className="border-y">
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.header}
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  className={`py-3 text-gray-500 text-theme-sm dark:text-gray-400 ${col.className ?? ""}`}
                >
                  {col.render
                    ? col.render(row)
                    : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
