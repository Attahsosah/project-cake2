"use client";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion"; // 👈 added

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      {/* Header with Navigation */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-200/10 px-4 sm:px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
          <motion.h1
            className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 text-center sm:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            🍰 Project Cake
          </motion.h1>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.a
              href="/"
              className="px-2 sm:px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Home
            </motion.a>
            <motion.a
              href="/register"
              className="px-2 sm:px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📝 Sign Up
            </motion.a>
          </div>
        </div>
      </motion.div>

            <main className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        
        {/* 🎂 Animated Cake Icon */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-4 text-5xl"
        >
          🍰
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-400 mb-6">Please login to your account</p>

        {err && <p className="text-red-500 mb-3">{err}</p>}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await login(email, password);
            } catch (e: any) {
              setErr(e.message);
            }
          }}
          className="space-y-4 text-left"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              className="w-full px-4 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
    </div>
  );
}
