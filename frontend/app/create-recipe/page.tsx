"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../utils/admin";
import { categories } from "../utils/categories";

export default function CreateRecipe() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty: "medium",
    category: "other",
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      setError("You must be logged in to create a recipe");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          prep_time: parseInt(formData.prep_time) || 0,
          cook_time: parseInt(formData.cook_time) || 0,
          servings: parseInt(formData.servings) || 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/feed");
      } else {
        setError(data.message || "Failed to create recipe");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Debug: Log the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      console.log('Uploading to:', `${apiUrl}/api/upload-image`);
      console.log('File:', file.name, file.type, file.size);

      const response = await fetch(`${apiUrl}/api/upload-image`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setFormData(prev => ({ ...prev, image_url: data.data.url }));
        // Show success message
        setError(null);
        // You could add a success state here if needed
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between max-w-7xl mx-auto gap-4">
          <motion.h1
            className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            🎂 Create Recipe
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <motion.button
                onClick={() => router.push("/feed")}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📖 All Recipes
              </motion.button>
              <motion.button
                onClick={() => router.push("/my-recipes")}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📖 My Recipes
              </motion.button>
              {isAdmin(user?.email) && (
                <motion.button
                  onClick={() => router.push("/admin")}
                  className="flex-1 sm:flex-none px-2 sm:px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-xs sm:text-sm"
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
      </motion.div>

          <motion.main
      className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-[#1c1c1c] p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-pink-200/10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
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
            🎂
          </motion.span>
          Create Your Recipe
        </motion.h2>

        <motion.p
          className="text-sm text-center text-gray-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Share your delicious cake recipe with the Project Cake community! 🍰
        </motion.p>

        {error && (
          <motion.p
            className="text-red-400 mb-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Recipe Title */}
          <div>
            <label htmlFor="title" className="block text-sm mb-1 text-gray-400">
              Recipe Title *
            </label>
            <motion.input
              id="title"
              name="title"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="e.g., Chocolate Lava Cake"
              value={formData.title}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm mb-1 text-gray-400">
              Description
            </label>
            <motion.textarea
              id="description"
              name="description"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="Describe your recipe..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="block text-sm mb-1 text-gray-400">
              Ingredients *
            </label>
            <motion.textarea
              id="ingredients"
              name="ingredients"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="List each ingredient on a new line..."
              value={formData.ingredients}
              onChange={handleChange}
              rows={6}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-sm mb-1 text-gray-400">
              Instructions *
            </label>
            <motion.textarea
              id="instructions"
              name="instructions"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="List each step on a new line..."
              value={formData.instructions}
              onChange={handleChange}
              rows={8}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Recipe Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Prep Time */}
            <div>
              <label htmlFor="prep_time" className="block text-sm mb-1 text-gray-400">
                Prep Time (min)
              </label>
              <motion.input
                id="prep_time"
                name="prep_time"
                type="number"
                className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="15"
                value={formData.prep_time}
                onChange={handleChange}
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Cook Time */}
            <div>
              <label htmlFor="cook_time" className="block text-sm mb-1 text-gray-400">
                Cook Time (min)
              </label>
              <motion.input
                id="cook_time"
                name="cook_time"
                type="number"
                className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="30"
                value={formData.cook_time}
                onChange={handleChange}
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Servings */}
            <div>
              <label htmlFor="servings" className="block text-sm mb-1 text-gray-400">
                Servings
              </label>
              <motion.input
                id="servings"
                name="servings"
                type="number"
                className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="8"
                value={formData.servings}
                onChange={handleChange}
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm mb-1 text-gray-400">
                Difficulty
              </label>
              <motion.select
                id="difficulty"
                name="difficulty"
                className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                value={formData.difficulty}
                onChange={handleChange}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="easy">🍰 Easy</option>
                <option value="medium">🎂 Medium</option>
                <option value="hard">👨‍🍳 Hard</option>
              </motion.select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm mb-1 text-gray-400">
              Category
            </label>
            <motion.select
              id="category"
              name="category"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              value={formData.category}
              onChange={handleChange}
              whileFocus={{ scale: 1.02 }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </motion.select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Recipe Image (optional)
            </label>
            
            {/* Upload Options */}
            <div className="space-y-3">
              {/* File Upload */}
              <div className="relative">
                <motion.input
                  id="file_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <motion.label
                  htmlFor="file_upload"
                  className={`block w-full px-4 py-3 rounded-xl border-2 border-dashed border-pink-200/20 text-center cursor-pointer transition-all ${
                    uploading 
                      ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                      : 'hover:border-pink-300 hover:bg-pink-200/5'
                  }`}
                  whileHover={!uploading ? { scale: 1.02 } : {}}
                  whileTap={!uploading ? { scale: 0.98 } : {}}
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-200"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">📸</span>
                      <span>Upload from your device</span>
                    </div>
                  )}
                </motion.label>
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#1c1c1c] px-2 text-gray-400">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <div className="relative">
                <motion.input
                  id="image_url"
                  name="image_url"
                  type="url"
                  className="w-full px-4 py-2 pr-12 rounded-xl bg-[#2a2a2a] text-gray-200 border border-pink-200/10 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  placeholder="Paste image URL here..."
                  value={formData.image_url}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.02 }}
                />
                {formData.image_url && (
                  <motion.button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Clear image URL"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>💡 Tips for great recipe images:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Upload your own photos or use image URLs</li>
                <li>Supported formats: JPEG, PNG, GIF, WebP (max 5MB)</li>
                <li>Use high-quality images (at least 500px wide)</li>
                <li>Make sure the image shows the finished recipe clearly</li>
                <li>Popular URL sources: Unsplash, Pexels, or your own photos</li>
              </ul>
            </div>
            
            {/* Image Preview */}
            {formData.image_url && (
              <motion.div
                className="mt-4 p-4 bg-[#2a2a2a] rounded-xl border border-pink-200/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-gray-400 mb-2">📸 Image Preview:</p>
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Recipe preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <motion.button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Remove image"
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Quick Image Options */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Quick options:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "🍫 Chocolate Cake", url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500" },
                  { name: "🧁 Vanilla Cupcakes", url: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500" },
                  { name: "🎂 Red Velvet", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" },
                  { name: "🧀 Cheesecake", url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500" },
                  { name: "🍰 Tiramisu", url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500" },
                  { name: "🥧 Apple Pie", url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" }
                ].map((option) => (
                  <motion.button
                    key={option.name}
                    type="button"
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    onClick={() => setFormData({ ...formData, image_url: option.url })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.name}
                  </motion.button>
                ))}
              </div>
            </div>


          </div>

          {/* Submit Button */}
          <motion.button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-300 via-purple-200 to-yellow-200 text-[#1c1c1c] font-medium hover:opacity-90 disabled:opacity-50"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Creating Recipe..." : "Create Recipe →"}
          </motion.button>
        </motion.form>

        <motion.p
          className="mt-6 text-sm text-center text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a href="/feed" className="text-pink-300 hover:underline">
            ← Back to Recipes
          </a>
        </motion.p>
      </motion.div>
    </motion.main>
    </div>
  );
}
