"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { isAdmin } from "../utils/admin";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AdminData {
  users: User[];
  stats: {
    total_users: number;
    total_recipes: number;
  };
}

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace("/login");
      return;
    }
    
    // Check if user is admin
    if (!isAdmin(user.email)) {
      router.replace("/feed");
      return;
    }
    
    fetchAdminData();
  }, [user, token, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users`, {
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
        setAdminData(data.data);
      } else {
        setError(data.message || 'Failed to fetch admin data');
      }
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!isAdmin(user.email)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">You don't have permission to access the admin dashboard.</p>
          <motion.button
            onClick={() => router.push("/feed")}
            className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Feed
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-200/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                🛡️ Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your Project Cake community</p>
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
                  onClick={() => router.push("/my-recipes")}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎂 My Recipes
                </motion.button>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-200 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading admin data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <motion.button
              onClick={fetchAdminData}
              className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        ) : adminData ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 sm:p-6 rounded-2xl border border-purple-200/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Total Users</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-200">{adminData.stats.total_users}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">👥</div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-4 sm:p-6 rounded-2xl border border-pink-200/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Total Recipes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-pink-200">{adminData.stats.total_recipes}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">🎂</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Users Table */}
            <motion.div
              className="bg-[#1c1c1c] rounded-2xl border border-purple-200/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-4 sm:p-6 border-b border-purple-200/10">
                <h2 className="text-lg sm:text-xl font-semibold text-purple-200">Registered Users</h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">All users in the Project Cake community</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2a2a2a]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {adminData.users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        className="hover:bg-[#2a2a2a] transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">{formatDate(user.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-800 text-gray-300">
                            #{user.id}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {adminData.users.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold mb-2">No users yet</h3>
                  <p className="text-gray-400">Users will appear here once they register</p>
                </div>
              )}
            </motion.div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
