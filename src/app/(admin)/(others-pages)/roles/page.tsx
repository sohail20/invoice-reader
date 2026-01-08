import RolesTable from "@/components/tables/RolesTable";
import Button from "@/components/ui/button/Button";
import { LockIcon } from "@/icons";

export default function Roles({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
          {/* Left: Title & Description */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Roles
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="col-span-12 lg:col-span-4 flex gap-2 justify-start lg:justify-end">
            <Button
              href="/roles/create"
              size="sm"
              startIcon={<LockIcon />}
            >
              Create new role
            </Button>
          </div>
        </div>
        <div className="space-y-6">
            <RolesTable />
        </div>
    </div>
  );
}
