"use client";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const playSound = () => {
    const audio = new Audio("/sounds/register-success.mp3");
    audio.play();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      {/* Header with Navigation */}
      <motion.div 
        className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-pink-200/10 px-4 sm:px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
          <motion.h1
            className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 text-center sm:text-left"
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
              href="/login"
              className="px-2 sm:px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔐 Login
            </motion.a>
          </div>
        </div>
      </motion.div>

            <motion.main
        className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-[#1c1c1c] p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md border border-pink-200/10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading with quirky cake animation */}
        <motion.h2
          className="text-3xl font-bold text-center text-pink-200 mb-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            initial={{ rotate: -10 }}
            animate={{
              rotate: [0, -10, 10, -5, 5, 0],
              y: [0, -3, 0, -2, 0],
            }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 2 }}
          >
            🍰
          </motion.span>
          Create Account
        </motion.h2>

        <motion.p
          className="text-sm text-center text-gray-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Join Project Cake and get a slice of the fun 🎂
        </motion.p>

        {err && (
          <motion.p
            className="text-red-400 mb-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {err}
          </motion.p>
        )}

        <motion.form
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await register(username, email, password);
              playSound();
            } catch (e: any) {
              setErr(e.message);
            }
          }}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm mb-1 text-gray-400">
              Username
            </label>
            <motion.input
              id="username"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="CakeLover123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              whileFocus={{ scale: 1.03 }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-400">
              Email Address
            </label>
            <motion.input
              id="email"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              type="email"
              placeholder="you@cake.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.03 }}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-400">
              Password
            </label>
            <motion.input
              id="password"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.03 }}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-300 via-purple-200 to-yellow-200 text-[#1c1c1c] font-medium hover:opacity-90"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up →
          </motion.button>
        </motion.form>

        <motion.p
          className="mt-6 text-sm text-center text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{" "}
          <a href="/login" className="text-pink-300 hover:underline">
            Login
          </a>
        </motion.p>
      </motion.div>
    </motion.main>
    </div>
  );
}
