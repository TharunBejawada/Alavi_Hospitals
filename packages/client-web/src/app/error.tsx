"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect any error page to the homepage
    router.replace("/");
  }, [router]);

  return null;
}
