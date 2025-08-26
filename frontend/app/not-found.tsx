"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
        404
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        This slice of cake is missing 🎂
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
