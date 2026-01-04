"use client";

import FieldSection from "@/components/common/FieldSection";
import Button from "@/components/ui/button/Button";
import { DownloadIcon } from "@/icons";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* ---------- Download Helper ---------- */
function downloadJSON(data: any, filename = "extracted_data.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setInvoice(data))
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!invoice) return <p>No data found</p>;

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          startIcon={<DownloadIcon />}
          onClick={() =>
            downloadJSON(invoice.extracted_data, `invoice-${id}.json`)
          }
        >
          Download JSON
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 lg:col-span-6">
          {/* Preview */}
          <DocumentPreview invoice={invoice} />
        </div>

        <div className="col-span-12 lg:col-span-6">
          {/* Fields */}
          <ExtractedFields data={invoice.extracted_data} />
        </div>

      </div>
    </div>
  );
}

/* ---------- Extracted Fields ---------- */
function ExtractedFields({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <FieldSection title="Invoice Details" fields={data.invoice_details} />
      <FieldSection title="Customer Details" fields={data.customer_details} />

      {/* Items */}
      <div className="rounded-xl border p-4 bg-white dark:bg-dark-900">
        <h4 className="font-semibold mb-3">Items</h4>

        {Array.isArray(data.items) && data.items.length > 0 ? (
          data.items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 border-b pb-3"
            >
              {Object.entries(item).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="text-sm">{String(v) || "-"}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No items found</p>
        )}
      </div>

      <FieldSection title="Totals" fields={data.totals} />
      <FieldSection title="Payment Details" fields={data.payment_details} />
    </div>
  );
}

function DocumentPreview({ invoice }: { invoice: any }) {
  const fileUrl = `http://localhost:8000/api/v1/invoices/${invoice.id}/file`;
  const isPDF = invoice.filename.toLowerCase().endsWith(".pdf");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!fileUrl) return;

    fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        console.log("url", url)
        setPreviewUrl(url);
      })
      .catch((err) => console.error("Failed to load preview", err));
  }, [fileUrl, token]);


  if (!fileUrl) {
    return (
      <div className="rounded-xl border p-4 bg-white dark:bg-dark-900">
        <h3 className="font-semibold mb-3">Document Preview</h3>
        <p className="text-sm text-gray-500">Loading document…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-dark-900">
      <h3 className="font-semibold mb-3">Document Preview</h3>

      {isPDF ? (
        <iframe src={previewUrl || ""} width={"600px"} height={"600px"} />
      ) : (
        <img
          src={fileUrl}
          alt="Invoice"
          className="max-w-full rounded-lg border"
        />
      )}
    </div>
  );
}

