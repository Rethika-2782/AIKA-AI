import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("AIKA_token")) return setBooting(false);
    api
      .getCurrentUser()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("AIKA_token"))
      .finally(() => setBooting(false));
  }, []);

  const login = async (credentials) => {
    const data = await api.loginUser(credentials);
    localStorage.setItem("AIKA_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (details) => {
    const data = await api.registerUser(details);
    localStorage.setItem("AIKA_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("AIKA_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, booting, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
