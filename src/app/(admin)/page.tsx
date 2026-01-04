"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (token) {
      // User is logged in, navigate to dashboard
      router.replace("/dashboard");
    } else {
      // User not logged in, navigate to login
      router.replace("/signin");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Checking authentication...</p>
    </div>
  );
}
