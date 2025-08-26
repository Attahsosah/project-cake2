"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFound() {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [floatingCakes, setFloatingCakes] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  // Generate floating cakes
  useEffect(() => {
    const cakes = ['🍰', '🎂', '🧁', '🍪', '🥧', '🍩', '🍮', '🍭'];
    const newFloatingCakes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: cakes[i]
    }));
    setFloatingCakes(newFloatingCakes);
  }, []);

  const handleCakeClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 4 && !showEasterEgg) {
      setShowEasterEgg(true);
    }
  };

  const playSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio("/sounds/cake-bite.mp3");
      audio.play().catch(() => {
        // Ignore audio errors
      });
    }
  };

  const jokes = [
    "Why did the cake go to the party alone? Because it felt crumby!",
    "What do you call a cake that's been in the oven too long? A cake-tastrophe!",
    "Why did the baker go to the doctor? Because he was feeling a bit doughy!",
    "What's a cake's favorite dance? The chocolate chip!",
    "Why did the cookie go to the doctor? Because it was feeling crumbly!"
  ];

  const [currentJoke, setCurrentJoke] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke(prev => (prev + 1) % jokes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 overflow-hidden">
      {/* Floating Cakes Background */}
      <AnimatePresence>
        {floatingCakes.map((cake) => (
          <motion.div
            key={cake.id}
            className="absolute text-4xl pointer-events-none"
            style={{ left: `${cake.x}%`, top: `${cake.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0],
              y: [0, -20, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              delay: cake.id * 0.5,
              ease: "easeInOut"
            }}
          >
            {cake.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-600 mb-4"
            whileHover={{ 
              scale: 1.1,
              textShadow: "0 0 30px rgba(236, 72, 153, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Cake Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <motion.div
            className="text-8xl cursor-pointer select-none"
            onClick={() => {
              handleCakeClick();
              playSound();
            }}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9, rotate: -5 }}
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            🎂
          </motion.div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! This slice of cake is missing! 🍰
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Looks like this recipe got lost in the oven. Don't worry, we have plenty of other delicious cakes waiting for you!
          </p>
        </motion.div>

        {/* Joke Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-8 max-w-lg mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              😄 Cake Joke of the Moment
            </h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentJoke}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-gray-700 italic"
              >
                {jokes[currentJoke]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              🏠 Back to Home
            </Link>
          </motion.div>
          
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
        </motion.div>

        {/* Click Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: clickCount > 0 ? 1 : 0 }}
          className="text-sm text-gray-500 mb-4"
        >
          Cake clicks: {clickCount}
        </motion.div>

        {/* Easter Egg */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-lg max-w-md mx-auto text-center"
            >
              <h3 className="text-xl font-bold mb-2">🎉 You found the secret! 🎉</h3>
              <p className="text-sm">
                You're a true cake enthusiast! Here's a virtual high-five! ✋
              </p>
              <motion.div
                className="text-4xl mt-3"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🍰🎂🧁
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fun Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          <p>💡 Fun fact: The most expensive cake ever made cost $75 million!</p>
          <p className="mt-1">It was covered in diamonds! 💎</p>
        </motion.div>
      </div>
    </div>
  );
}
