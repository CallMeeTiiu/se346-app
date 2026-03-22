import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER: "user", // currently-logged-in basic info
  PROFILE: "profile", // saved profile details (for demo/local)
  POSTS: "posts", // array of saved posts
};

/**
 * Try to authenticate using locally-saved profile.
 * NOTE: This is a local/demo check. For real apps call your backend.
 * @param {{email:string,password:string}} creds
 * @returns {{ok:boolean,user?:object,error?:string}}
 */
export async function loginCheck(creds) {
  try {
    if (!creds || !creds.email || !creds.password) {
      return { ok: false, error: "Email and password are required" };
    }

    const profile = await getProfile();
    if (!profile) return { ok: false, error: "No local profile found" };

    // Simple direct comparison as requested
    // Debug logging in dev to help trace form/storage mismatches
    if (__DEV__) {
      try {
        // avoid printing passwords in logs; only indicate whether they match
        const pwMatch = profile.password === creds.password;
        console.debug(
          "[loginCheck] creds.email=",
          creds.email,
          "stored=",
          profile.email,
          "pwMatch=",
          pwMatch,
        );
      } catch (e) {
        console.debug("[loginCheck] debug error", e);
      }
    }

    if (creds.email === profile.email && creds.password === profile.password) {
      const user = {
        email: profile.email,
        name: profile.name || "",
        loggedAt: Date.now(),
      };
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
      return { ok: true, user };
    }

    return { ok: false, error: "Invalid credentials" };
  } catch (e) {
    console.error("loginCheck error", e);
    return { ok: false, error: e.message };
  }
}

export async function loadUser() {
  try {
    const s = await AsyncStorage.getItem(KEYS.USER);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    console.error("loadUser error", e);
    return null;
  }
}

export async function getProfile() {
  try {
    const s = await AsyncStorage.getItem(KEYS.PROFILE);
    if (!s) return null;
    const obj = JSON.parse(s);
    if (Array.isArray(obj)) return obj[0] || null;
    return obj;
  } catch (e) {
    console.error("getProfile error", e);
    return null;
  }
}

/**
 * Save profile locally. For demo purposes this stores password too — avoid this in production.
 * @param {object} profile
 */
export async function saveProfile(profile) {
  try {
    if (!profile || !profile.email || !profile.password) {
      return { ok: false, error: "Email and password are required" };
    }
    if (typeof profile.password === "string" && profile.password.length < 4) {
      return { ok: false, error: "Password must be at least 4 characters" };
    }

    // basic email format check (optional)
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      return { ok: false, error: "Invalid email format" };
    }

    // handle existing stored profile (object or array)
    const existingRaw = await AsyncStorage.getItem(KEYS.PROFILE);
    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw);
        const existingEmail = Array.isArray(existing)
          ? existing[0] && existing[0].email
          : existing.email;
        if (existingEmail && existingEmail === profile.email) {
          return { ok: false, error: "Email already taken" };
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    const user = {
      email: profile.email,
      name: profile.name || "",
      loggedAt: Date.now(),
    };
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    return { ok: true, user };
  } catch (e) {
    console.error("saveProfile error", e);
    return { ok: false, error: e.message };
  }
}

export async function getPosts() {
  try {
    const s = await AsyncStorage.getItem(KEYS.POSTS);
    return s ? JSON.parse(s) : [];
  } catch (e) {
    console.error("getPosts error", e);
    return [];
  }
}

/**
 * Save a single post (appends to local list). Post should be an object; an `id` will be added if missing.
 * @param {object} post
 */
export async function savePost(post) {
  try {
    const list = await getPosts();
    const newPost = { id: post.id || Date.now().toString(), ...post };
    // remove any existing post with same id to avoid duplicate keys
    const filtered = list.filter((p) => p.id !== newPost.id);
    filtered.unshift(newPost);
    await AsyncStorage.setItem(KEYS.POSTS, JSON.stringify(filtered));
    return newPost;
  } catch (e) {
    console.error("savePost error", e);
    return null;
  }
}

export async function clearUser() {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (e) {
    console.error("clearUser error", e);
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
    // optionally keep profile and posts; if you want full clear use clearAll()
  } catch (e) {
    console.error("logout error", e);
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error("clearAll error", e);
  }
}

export default {
  loginCheck,
  loadUser,
  getProfile,
  saveProfile,
  getPosts,
  savePost,
  clearUser,
  logout,
  clearAll,
};
