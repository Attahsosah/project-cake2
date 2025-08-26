"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: { id: number; email: string; username?: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem("user");
        if (t && u) {
          const userData = JSON.parse(u);
          // Validate that userData has the expected structure
          if (userData && typeof userData === 'object' && userData.id && userData.email) {
            setToken(t);
            setUser(userData);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        // If JSON parsing fails, clear the invalid data
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Validate user data before storing
      if (data.data && data.data.user && data.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
        setToken(data.data.token);
        setUser(data.data.user);
        router.push("/feed");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Network error. Please check your connection.");
      }
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Network error. Please check your connection.");
      }
    }
  }

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setToken(null); setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext)!; }