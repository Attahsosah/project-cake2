"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../utils/admin";

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
  user_id: number;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id;

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes/${recipeId}`);
      const data = await response.json();
      
      if (response.ok) {
        setRecipe(data.data);
      } else {
        setError(data.message || 'Recipe not found');
      }
    } catch (err) {
      setError('Failed to fetch recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !token || !recipe) return;
    
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/my-recipes');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete recipe');
      }
    } catch (err) {
      setError('Failed to delete recipe');
    } finally {
      setIsDeleting(false);
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

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This recipe doesn\'t exist or has been removed.'}</p>
          <motion.button
            onClick={() => router.push('/feed')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Recipes
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-pink-200/50 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => router.back()}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back
              </motion.button>
              <h1 className="text-xl font-semibold text-gray-800">Recipe Details</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {user && (user.id === recipe.user_id || isAdmin(user.email)) && (
                <>
                  <motion.button
                    onClick={() => router.push(`/edit-recipe/${recipeId}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recipe Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Recipe Image */}
          {recipe.image_url && (
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-pink-100 to-purple-100">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Recipe Info */}
          <div className="p-6 md:p-8">
            {/* Title and Author */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {recipe.title}
              </h1>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>By {recipe.user.name}</span>
                <span>•</span>
                <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Recipe Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">{formatTime(recipe.prep_time)}</div>
                <div className="text-sm text-gray-600">Prep Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{formatTime(recipe.cook_time)}</div>
                <div className="text-sm text-gray-600">Cook Time</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">{recipe.servings}</div>
                <div className="text-sm text-gray-600">Servings</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className={`text-2xl font-bold ${getDifficultyColor(recipe.difficulty)}`}>
                  {getDifficultyBadge(recipe.difficulty)}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🥚 Ingredients
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {recipe.ingredients}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                👨‍🍳 Instructions
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {recipe.instructions}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-200 to-purple-200 text-gray-700 rounded-full font-medium">
                {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
