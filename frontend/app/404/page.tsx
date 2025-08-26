"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NotFound() {
  const [showJoke, setShowJoke] = useState(false);

  // Play sound effect when the button is clicked
  const playSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio("/sounds/cake-bite.mp3"); // Add a sound file in the public/sounds folder
      audio.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-300 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Animated 404 Text */}
      <motion.h1
        className="text-8xl font-extrabold text-gray-800 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="mt-4 text-lg text-gray-600 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        This slice of cake is missing 🎂
      </motion.p>

      {/* Hidden Joke */}
      {showJoke && (
        <motion.p
          className="mt-4 text-sm text-gray-500 italic z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          &quot;Why did the cake go to the party alone? Because it felt crumby!&quot;
        </motion.p>
      )}

      {/* Back to Home Button */}
      <motion.div
        className="mt-6 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onClick={playSound}
        >
          Back to Home
        </Link>
      </motion.div>

      {/* Hidden Joke Button */}
      <motion.button
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none z-10"
        onClick={() => setShowJoke(!showJoke)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {showJoke ? "Hide Joke" : "Show Joke"}
      </motion.button>

      {/* Floating Cake Visual */}
      <motion.div
        className="absolute bottom-10 right-10 text-6xl z-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 0.8 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
        }}
      >
        🎂
      </motion.div>
    </div>
  );
}