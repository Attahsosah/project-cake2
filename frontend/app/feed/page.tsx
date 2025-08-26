"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { isAdmin } from "../utils/admin";
import { categories, getCategoryEmoji, getCategoryName } from "../utils/categories";

interface Recipe {
  id: number;
  title: string;
  description: string;
  author: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  ingredients: string;
  instructions: string;
  created_at: string;
}

export default function FeedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, [searchTerm, selectedCategory]);

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setRecipes(data.data);
      } else {
        setError(data.message || 'Failed to fetch recipes');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '🍰 Easy';
      case 'medium': return '🎂 Medium';
      case 'hard': return '👨‍🍳 Hard';
      default: return '🍰 Medium';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-200 mx-auto mb-4"></div>
          <p>Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchRecipes}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 px-4 sm:px-6 py-8 sm:py-12">
      {/* Header with Navigation */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 sm:mb-10 gap-4">
        <motion.h1
          className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight flex items-center gap-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ rotate: -15, y: -5 }}
            animate={{ 
              rotate: [0, -15, 15, -10, 10, 0], 
              y: [0, -5, 0, -3, 0] 
            }}
            transition={{ 
              repeat: Infinity, 
              repeatDelay: 2, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          >
            🍰
          </motion.span>
          <span className="hidden sm:inline">Project Cake Recipes</span>
          <span className="sm:hidden">Recipes</span>
        </motion.h1>

        {/* Navigation and User Menu */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          {user && (
            <>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <motion.button
                  onClick={() => router.push("/my-recipes")}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 My Recipes
                </motion.button>
                <motion.button
                  onClick={() => router.push("/create-recipe")}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎂 Create Recipe
                </motion.button>
                {isAdmin(user?.email) && (
                  <motion.button
                    onClick={() => router.push("/admin")}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all text-xs sm:text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🛡️ Admin
                  </motion.button>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs sm:text-sm text-gray-400">Welcome, {user.username || user.email}!</span>
                <motion.button
                  onClick={logout}
                  className="px-2 sm:px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-xs"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        className="mb-8 p-4 sm:p-6 bg-[#1c1c1c] rounded-2xl border border-pink-200/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm mb-2 text-gray-400">
              🔍 Search Recipes
            </label>
            <motion.input
              id="search"
              type="text"
              placeholder="Search by title, description, or ingredients..."
              className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Category Filter */}
          <div className="w-full">
            <label htmlFor="category" className="block text-sm mb-2 text-gray-400">
              🏷️ Filter by Category
            </label>
            <motion.select
              id="category"
              className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              whileFocus={{ scale: 1.02 }}
            >
              <option value="all">🍰 All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </motion.select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory !== 'all') && (
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {searchTerm && (
              <span className="px-3 py-1 bg-pink-500/20 text-pink-200 rounded-full text-sm">
                🔍 "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                {getCategoryEmoji(selectedCategory)} {getCategoryName(selectedCategory)}
              </span>
            )}
            <motion.button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-full text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕ Clear All
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <div className="grid gap-6 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className="bg-[#1c1c1c] rounded-2xl overflow-hidden shadow-md 
                       hover:shadow-pink-300/10 hover:scale-[1.02] transition-all duration-300"
            initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -3 : 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            whileHover={{ scale: 1.04, rotate: index % 2 === 0 ? 1 : -1 }}
          >
            {/* Image */}
            <motion.img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-t-2xl"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Content */}
            <div className="p-4 sm:p-6">
              <motion.h2
                className="text-xl sm:text-2xl font-serif font-semibold text-pink-200 mb-3"
                whileHover={{ color: "#f9a8d4" }}
              >
                {recipe.title}
              </motion.h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <p className="text-sm text-gray-400 italic">by {recipe.author}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)} bg-gray-800`}>
                    {getDifficultyBadge(recipe.difficulty)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200">
                    {getCategoryEmoji(recipe.category)} {getCategoryName(recipe.category)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 line-clamp-3 mb-4">{recipe.description}</p>
              
              {/* Recipe Details */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-400">
                <div className="text-center">
                  <div className="font-semibold text-xs sm:text-sm">Prep</div>
                  <div className="text-xs sm:text-sm">{recipe.prep_time}m</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs sm:text-sm">Cook</div>
                  <div className="text-xs sm:text-sm">{recipe.cook_time}m</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs sm:text-sm">Serves</div>
                  <div className="text-xs sm:text-sm">{recipe.servings}</div>
                </div>
              </div>

              <motion.button
                onClick={() => router.push(`/recipe/${recipe.id}`)}
                className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-300 via-purple-200 to-yellow-200 
                           text-[#1c1c1c] font-medium hover:opacity-90 transition-all w-full"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                View Recipe →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {recipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No recipes found</p>
          <button 
            onClick={fetchRecipes}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
