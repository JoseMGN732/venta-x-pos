import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
  negocioId: number;
}

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const role = user?.rol;

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error cargando sesión:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔐 LOGIN
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          uuid: "POS-PRINCIPAL",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      // 🔥 guardar sesión
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Usuario recibido:", data.user);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error login:", error);
      return {
        success: false,
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);