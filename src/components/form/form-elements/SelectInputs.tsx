"use client";

import React from "react";
import Select from "../Select";
import { ChevronDownIcon } from "@/icons";

export interface BaseOption<T = string> {
  value: T;
  label: string;
}

interface GenericSelectProps<T> {
  options: BaseOption<T>[];
  value?: T;
  placeholder?: string;
  onChange: (value: T) => void;
  className?: string;
}

export default function GenericSelect<T>({
  options,
  value,
  placeholder = "Select option",
  onChange,
  className = "",
}: GenericSelectProps<T>) {
  const selectOptions = options.map(opt => ({
    value: String(opt.value),
    label: opt.label,
  }));

  const handleChange = (val: string) => {
    onChange(val as T);
  };

  return (
    <div className="relative">
      <Select
        options={selectOptions}
        placeholder={placeholder}
        onChange={handleChange}
        className={className}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
        <ChevronDownIcon />
      </span>
    </div>
  );
}
