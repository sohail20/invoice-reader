import BasicTableOne from "@/components/tables/BasicTableOne";
import InvoiceTable from "@/components/tables/InvoiceTable";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "Modrik Dashboard | AdminPanel",
    description: "SAAS Base Modrik Dashboard",
};
export default function Invoices() {
    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex items-center justify-between">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                        Process Invoices
                    </h3>
                    <Button variant="outline" href="invoices/23" className="mb-4">Add Invoice</Button>
                </div>

                <div className="space-y-6">
                    <InvoiceTable />
                </div>
            </div>
        </div>
    );
}
