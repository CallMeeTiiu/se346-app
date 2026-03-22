import React, { createContext, useContext, useState } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: "Alice",
    email: "test@mail.com",
    address: "",
    avatarUrl: "https://i.pravatar.cc/300",
    description: "",
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
