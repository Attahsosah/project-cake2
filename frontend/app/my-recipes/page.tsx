"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { isAdmin } from "../utils/admin";
import { categories, getCategoryEmoji, getCategoryName } from "../utils/categories";

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  image_url: string;
  author: string;
  created_at: string;
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace("/login");
      return;
    }
    fetchMyRecipes();
  }, [user, token, router, searchTerm, selectedCategory]);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-recipes?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setRecipes(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch recipes');
      }
    } catch (err) {
      setError('Failed to fetch recipes');
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
    const color = getDifficultyColor(difficulty);
    return (
      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-800 ${color}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-200 mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-pink-200/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">
                My Recipes
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Your personal collection of delicious cakes</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <motion.button
                  onClick={() => router.push("/feed")}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 All Recipes
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
                <span className="text-xs sm:text-sm text-gray-400">Welcome, {user?.username || user?.email}!</span>
                <motion.button
                  onClick={logout}
                  className="px-2 sm:px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-xs"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <motion.div
          className="p-4 sm:p-6 bg-[#1c1c1c] rounded-2xl border border-pink-200/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm mb-2 text-gray-400">
                🔍 Search My Recipes
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-200 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your recipes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <motion.button
              onClick={fetchMyRecipes}
              className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-xl font-semibold mb-2">No recipes yet!</h3>
            <p className="text-gray-400 mb-6">Start creating your first delicious cake recipe</p>
            <motion.button
              onClick={() => router.push("/create-recipe")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your First Recipe
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className="bg-[#1c1c1c] rounded-2xl overflow-hidden border border-pink-200/10 hover:border-pink-200/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl">🎂</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {getDifficultyBadge(recipe.difficulty)}
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-200">
                      {getCategoryEmoji(recipe.category)} {getCategoryName(recipe.category)}
                    </span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{recipe.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  
                  {/* Recipe Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span>⏱️ {recipe.prep_time + recipe.cook_time}min</span>
                      <span>👥 {recipe.servings} servings</span>
                    </div>
                  </div>

                  {/* Recipe Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prep time:</span>
                      <span>{recipe.prep_time} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cook time:</span>
                      <span>{recipe.cook_time} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className={getDifficultyColor(recipe.difficulty)}>
                        {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* View Recipe Button */}
                  <motion.button
                    className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Recipe
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
