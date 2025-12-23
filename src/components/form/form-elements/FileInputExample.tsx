"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";

type FileInputExampleProps = {
  title?: string;
  onFileSelect?: (file: File | null) => void;
};

export default function FileInputExample({
  title = "File Input",
  onFileSelect,
}: FileInputExampleProps) {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      console.log("Selected file:", file.name);
    }

    // 🔑 Send file to parent
    onFileSelect?.(file);
  };

  return (
    <ComponentCard title={title}>
      <div>
        <Label>Upload file</Label>
        <FileInput
          onChange={handleFileChange}
          className="custom-class"
        />
      </div>
    </ComponentCard>
  );
}
