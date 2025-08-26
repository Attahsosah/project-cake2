"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the register page
    router.replace("/register");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-200 mx-auto mb-4"></div>
        <p>Redirecting to signup...</p>
      </div>
    </div>
  );
}
