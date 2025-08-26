"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleCakeClick = () => {
    setClickCount(prev => prev + 1);
  };

  const getRandomEmoji = () => {
    const emojis = ['🍰', '🎂', '🧁', '🍪', '🥧', '🍩', '🍮', '🍨'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Main Error Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4"
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Oops!
          </motion.h1>
        </motion.div>

        {/* Interactive Cake */}
        <motion.div
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="text-6xl md:text-8xl cursor-pointer select-none"
            onClick={handleCakeClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ 
              scale: 1.2,
              rotate: [0, -10, 10, -5, 5, 0],
              y: [0, -10, 0]
            }}
            whileTap={{ scale: 0.9 }}
            animate={isHovered ? {
              y: [0, -5, 0],
              transition: { duration: 0.5, repeat: Infinity }
            } : {}}
          >
            {clickCount > 5 ? getRandomEmoji() : '🍰'}
          </motion.div>
          
          {clickCount > 0 && (
            <motion.p
              className="text-sm text-gray-600 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {clickCount === 1 && "Don't worry! 🎉"}
              {clickCount === 2 && "We'll fix this! 😋"}
              {clickCount === 3 && "Stay positive! 🚀"}
              {clickCount === 4 && "Almost there! ⭐"}
              {clickCount === 5 && "You're amazing! 👑"}
              {clickCount > 5 && `You've clicked ${clickCount} times! 🎊`}
            </motion.p>
          )}
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Something went wrong! 😅
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Our cake recipe got a bit mixed up. Don't worry, we're working on fixing it!
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-sm text-red-800 font-mono">
                Error: {error.message}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Cake Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                opacity: 0
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 10 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "linear"
              }}
            >
              {getRandomEmoji()}
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={reset}
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              🔄 Try Again
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              🏠 Go Home
            </Link>
          </motion.div>

          {user ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/feed"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                📖 Browse Recipes
              </Link>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                🔐 Login
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-orange-200/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🍰 Cake Fun Fact
          </h3>
          <p className="text-gray-600">
            {clickCount > 10 
              ? "You're really persistent! Did you know that the most expensive cake ever made cost $75 million? It was covered in diamonds! 💎"
              : "Did you know that the first chocolate cake was made in 1764? It was created by Dr. James Baker and John Hannon! 🍫"
            }
          </p>
        </motion.div>

        {/* Easter Egg */}
        {clickCount > 15 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="text-4xl mb-2"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎊
              </motion.div>
              <p className="text-sm text-gray-500">
                You found the secret! You're officially a cake enthusiast! 🏆
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
