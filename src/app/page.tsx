"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /home after a brief delay
    const timer = setTimeout(() => {
      router.push("/home");
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>

        {/* Loading Text */}
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
