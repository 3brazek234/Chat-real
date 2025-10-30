"use client";
import { User } from "@/types/chat";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null as User | null,
  token: null as string | null,
  login: (token: string, userData: User) => {},
  logout: () => {},
  updateUser: (newUserData: Partial<User>) => {}, // 👈 عشان نحدث الصورة
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      fetch("http://localhost:3001/api/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.data); 
          } else {
            console.error("Failed to fetch user data:", data.message);
          }
        });
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("jwt_token", token);
    setToken(token);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const updateUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...newUserData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
