'use client'
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useGetMeQuery } from "@/store/services/authApi";

export default function Profile() {
  const { data: me, isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load roles</div>;
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {me && <>
            <UserMetaCard me={me} />
            {/* <UserInfoCard />
            <UserAddressCard /> */}
          </>}
        </div>
      </div>
    </div>
  );
}
