import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ⬅️ Updated User type with ROLE
export interface User {
  id: string;
  email: string;
  fullName: string;
  collegeName: string;
  phone?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    collegeName: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⭐ Optional Login Helper
export async function handleLogin(email: string, password: string) {
  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password." };
    }
    return { error: "Login failed. Please try again later." };
  }

  return { user: data.user };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Stay Logged In On Refresh
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        (async () => {
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        })();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ⭐ Load profile + role
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          collegeName: data.college_name,
          phone: data.phone,
          role: data.role || "user", // ⭐ Ensure fallback
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Login
  const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_banned")
      .eq("id", data.user.id)
      .single();

    if (profile?.is_banned) {
      await supabase.auth.signOut();
      throw new Error("Your account has been banned by the admin.");
    }

    await loadUserProfile(data.user.id);
  }
};


  // 🆕 Signup
  const signup = async (
    email: string,
    password: string,
    fullName: string,
    collegeName: string,
    phone?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        college_name: collegeName,
        phone,
        role: "user", // ⭐ Default role
      });

      if (profileError) throw profileError;

      await loadUserProfile(data.user.id);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
