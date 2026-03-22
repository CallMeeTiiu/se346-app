import React, { createContext, useEffect, useState } from "react";
import {
  loadUser,
  loginCheck,
  saveProfile,
  logout as storageLogout,
} from "../storage-utils";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await loadUser();
      setUser(u);
      setLoading(false);
    })();
  }, []);

  async function login(creds) {
    setLoading(true);
    const res = await loginCheck(creds);
    if (res && res.ok) setUser(res.user);
    setLoading(false);
    return res;
  }

  async function register(profile) {
    setLoading(true);
    const res = await saveProfile(profile);
    if (res && res.ok) {
      const u = await loadUser();
      setUser(u);
    }
    setLoading(false);
    return res;
  }

  async function logout() {
    await storageLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
