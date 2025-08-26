"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { isAdmin } from "./utils/admin";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          🍰 Project Cake
        </motion.h1>
        
        <motion.p
          className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md mx-auto text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Share and discover the sweetest cake recipes! Create your own, explore others, and bake your way to happiness.
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 justify-center max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {user ? (
            <>
              <Link
                href="/feed"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-center"
              >
                📖 Browse Recipes
              </Link>
              <Link
                href="/my-recipes"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-center"
              >
                🎂 My Recipes
              </Link>
              <Link
                href="/create-recipe"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-center"
              >
                ✨ Create Recipe
              </Link>
              {isAdmin(user?.email) && (
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-center"
                >
                  🛡️ Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-center"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-center"
              >
                Login
              </Link>
            </>
          )}
        </motion.div>

        {user && (
          <motion.p
            className="mt-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Welcome back, {user.username || user.email}! 🎉
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}