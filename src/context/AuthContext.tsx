import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOfficer: boolean;
  isCitizen: boolean;
  login: (
    email: string, 
    password?: string, 
    role?: UserRole, 
    extra?: { serviceId?: string; ward?: number; phone?: string }
  ) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    role: UserRole;
    ward: number;
    department?: string;
    phone?: string;
    serviceId?: string;
    password?: string;
  }) => Promise<User>;
  logout: () => void;
  exploreAsGuest: () => void;
  switchRole: (role: "Citizen" | "Officer") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("civic_token");
    if (token) {
      verifyToken();
    } else {
      // Check if user previously logged in
      const savedUser = localStorage.getItem("civic_saved_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null); // Unauthenticated by default so login/signup gate appears
      }
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const res = await api.get<{ user: User }>("/auth/verify");
      setUser(res.data.user);
      localStorage.setItem("civic_saved_user", JSON.stringify(res.data.user));
    } catch {
      localStorage.removeItem("civic_token");
      localStorage.removeItem("civic_saved_user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string, 
    password?: string, 
    role?: UserRole, 
    extra?: { serviceId?: string; ward?: number; phone?: string }
  ): Promise<User> => {
    const res = await api.post<{ token: string; user: User }>("/auth/login", { 
      email, 
      password, 
      role: role || (extra?.serviceId ? "Officer" : "Citizen"),
      serviceId: extra?.serviceId,
      ward: extra?.ward,
      phone: extra?.phone,
    });
    const { token, user: loggedUser } = res.data;
    localStorage.setItem("civic_token", token);
    localStorage.setItem("civic_saved_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: {
    name: string;
    email: string;
    role: UserRole;
    ward: number;
    department?: string;
    phone?: string;
    serviceId?: string;
    password?: string;
  }): Promise<User> => {
    const res = await api.post<{ token: string; user: User }>("/auth/register", data);
    const { token, user: registeredUser } = res.data;
    localStorage.setItem("civic_token", token);
    localStorage.setItem("civic_saved_user", JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("civic_token");
    localStorage.removeItem("civic_saved_user");
    setUser(null);
  };

  const exploreAsGuest = () => {
    const guestUser: User = {
      id: "usr-guest",
      name: "Guest Resident",
      email: "guest@civic.mumbai.gov.in",
      role: "Citizen",
      ward: 9,
    };
    setUser(guestUser);
    localStorage.setItem("civic_saved_user", JSON.stringify(guestUser));
  };

  const switchRole = (role: "Citizen" | "Officer") => {
    if (role === "Officer") {
      login("officer.hwest@civic.com", "password", "Officer", { serviceId: "BMC-OFF-0901", ward: 9 });
    } else {
      login("aarav@example.com", "password", "Citizen", { ward: 9 });
    }
  };

  const isAuthenticated = !!user && user.id !== "usr-guest";
  const isOfficer = user?.role === "Officer";
  const isCitizen = user?.role === "Citizen";

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      isOfficer,
      isCitizen,
      login, 
      register, 
      logout, 
      exploreAsGuest,
      switchRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
