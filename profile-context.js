import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getProfileByEmail, saveProfile } from "./storage-utils";
import { AuthContext } from "./contexts/AuthContext";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (user && user.email) {
        const p = await getProfileByEmail(user.email);
        if (p) setProfileState(p);
        else setProfileState(null);
      } else {
        setProfileState(null);
      }
      setHydrated(true);
    })();
  }, [user]);

  const setProfile = useCallback(
    async (next) => {
      // if caller passes a function, emulate useState functional update
      const newProfile = typeof next === "function" ? next(profile) : next;
      if (newProfile === null) {
        setProfileState(null);
        return;
      }

      // persist profile (uses storage-utils validation)
      try {
        const res = await saveProfile(newProfile);
        if (res && res.ok) {
          setProfileState(newProfile);
        } else {
          // if save failed, still update local state so UI can show, but log
          console.warn("saveProfile failed", res && res.error);
          setProfileState(newProfile);
        }
      } catch (e) {
        console.error("setProfile error", e);
        setProfileState(newProfile);
      }
    },
    [profile],
  );

  return (
    <ProfileContext.Provider value={{ profile, setProfile, hydrated }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
