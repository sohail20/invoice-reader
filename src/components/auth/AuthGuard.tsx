// app/components/AuthGuard.tsx
"use client";

import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // marks client mount
    const token = localStorage.getItem("token");
    if (!token) router.replace("/signin");
  }, [router]);

  if (!mounted) return null; // prevent rendering during SSR

  return <>{children}</>;
}
