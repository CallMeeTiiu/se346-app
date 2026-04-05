// Use native SQLite when available; otherwise use an in-memory JS-backed store
let SQLite = null;
let db = null;
let nativeSqlite = false;
let _initPromise = null;

// in-memory storage structures used when native sqlite isn't available
const _kv = new Map();
const _profiles = []; // array of { id, email, name, password, json }
const _posts = new Map(); // id -> json

try {
  // eslint-disable-next-line global-require
  SQLite = require("react-native-sqlite-storage");
  if (SQLite) {
    SQLite.DEBUG(false);
    db = SQLite.openDatabase(
      { name: "app.db", location: "default" },
      () => {},
      (e) => {
        console.warn("SQLite open error", e);
      },
    );
    nativeSqlite = !!db;
  }
} catch (e) {
  nativeSqlite = false;
}

async function initSqlite() {
  // For native SQLite we run SQL; for in-memory we just ensure structures exist
  if (nativeSqlite) {
    try {
      await execSql(
        "CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)",
      );
      await execSql(
        "CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, name TEXT, password TEXT, json TEXT)",
      );
      await execSql(
        "CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, author_email TEXT, json TEXT)",
      );
    } catch (e) {
      console.warn("initSqlite error", e);
    }
  }
}

function _makeRows(arr) {
  return {
    length: arr.length,
    item(i) {
      return arr[i];
    },
  };
}

function execSql(sql, params = []) {
  if (nativeSqlite) {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(
          (tx) => {
            tx.executeSql(
              sql,
              params,
              (_, res) => resolve(res),
              (_, err) => {
                reject(err);
                return false;
              },
            );
          },
          (txErr) => reject(txErr),
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  // Simple in-memory SQL-like handling for the limited queries we use
  const s = sql.trim().toUpperCase();
  return new Promise((resolve) => {
    if (
      s.startsWith("REPLACE INTO KV") ||
      s.startsWith("INSERT OR REPLACE INTO KV")
    ) {
      const key = params[0];
      const value = params[1];
      _kv.set(key, value);
      resolve({ rows: _makeRows([]) });
      return;
    }
    if (s.startsWith("SELECT VALUE FROM KV")) {
      const key = params[0];
      const val = _kv.has(key) ? _kv.get(key) : null;
      const rows = val ? [{ value: val }] : [];
      resolve({ rows: _makeRows(rows) });
      return;
    }
    if (s.startsWith("DELETE FROM KV WHERE KEY =")) {
      const key = params[0];
      _kv.delete(key);
      resolve({ rows: _makeRows([]) });
      return;
    }
    if (s === "DELETE FROM KV") {
      _kv.clear();
      resolve({ rows: _makeRows([]) });
      return;
    }

    if (
      s.startsWith("REPLACE INTO PROFILES") ||
      s.startsWith("INSERT INTO PROFILES")
    ) {
      const email = params[0];
      const name = params[1];
      const password = params[2];
      const json = params[3];
      // try to find existing by email
      const idx = _profiles.findIndex((p) => p.email === email);
      if (idx >= 0) {
        _profiles[idx] = { ..._profiles[idx], email, name, password, json };
      } else {
        const id = _profiles.length
          ? _profiles[_profiles.length - 1].id + 1
          : 1;
        _profiles.push({ id, email, name, password, json });
      }
      resolve({ rows: _makeRows([]) });
      return;
    }
    if (s.startsWith("SELECT ID FROM PROFILES WHERE EMAIL")) {
      const email = params[0];
      const found = _profiles.find((p) => p.email === email);
      const rows = found ? [{ id: found.id }] : [];
      resolve({ rows: _makeRows(rows) });
      return;
    }
    if (s.startsWith("SELECT JSON FROM PROFILES")) {
      // return most recent
      if (_profiles.length === 0) {
        resolve({ rows: _makeRows([]) });
        return;
      }
      const last = _profiles[_profiles.length - 1];
      resolve({ rows: _makeRows([{ json: last.json }]) });
      return;
    }

    if (
      s.startsWith("REPLACE INTO POSTS") ||
      s.startsWith("INSERT INTO POSTS")
    ) {
      const id = params[0];
      const author_email = params[1];
      const json = params[2];
      _posts.set(id, json);
      resolve({ rows: _makeRows([]) });
      return;
    }
    if (s.startsWith("SELECT JSON FROM POSTS")) {
      const arr = Array.from(_posts.values()).map((j) => ({ json: j }));
      // ORDER BY rowid DESC -> reverse insertion order
      const rows = arr.slice().reverse();
      resolve({ rows: _makeRows(rows) });
      return;
    }
    if (s === "DELETE FROM PROFILES") {
      _profiles.length = 0;
      resolve({ rows: _makeRows([]) });
      return;
    }
    if (s === "DELETE FROM POSTS") {
      _posts.clear();
      resolve({ rows: _makeRows([]) });
      return;
    }

    // default no-op
    resolve({ rows: _makeRows([]) });
  });
}

// ensure init runs once
function ensureInit() {
  if (!_initPromise) _initPromise = initSqlite();
  return _initPromise;
}

const KEYS = {
  USER: "user",
  PROFILE: "profile",
  POSTS: "posts",
};

export async function loginCheck(creds) {
  try {
    if (!creds || !creds.email || !creds.password) {
      return { ok: false, error: "Email and password are required" };
    }

    // find profile by provided email instead of using the last-saved profile
    const profile = await getProfileByEmail(creds.email);
    if (!profile)
      return { ok: false, error: "No local profile found for this email" };

    if (__DEV__) {
      try {
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
      await ensureInit();
      await execSql("REPLACE INTO kv (key, value) VALUES (?, ?)", [
        KEYS.USER,
        JSON.stringify(user),
      ]);
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
    await ensureInit();
    const res = await execSql("SELECT value FROM kv WHERE key = ?", [
      KEYS.USER,
    ]);
    if (res && res.rows && res.rows.length) {
      const row = res.rows.item(0);
      return row && row.value ? JSON.parse(row.value) : null;
    }
    return null;
  } catch (e) {
    console.error("loadUser error", e);
    return null;
  }
}

export async function getProfile() {
  try {
    await ensureInit();
    const res = await execSql(
      "SELECT json FROM profiles ORDER BY id DESC LIMIT 1",
    );
    if (res && res.rows && res.rows.length) {
      const row = res.rows.item(0);
      return row && row.json ? JSON.parse(row.json) : null;
    }
    return null;
  } catch (e) {
    console.error("getProfile error", e);
    return null;
  }
}

export async function getProfileByEmail(email) {
  try {
    if (!email) return null;
    await ensureInit();
    const res = await execSql(
      "SELECT json FROM profiles WHERE email = ? LIMIT 1",
      [email],
    );
    if (res && res.rows && res.rows.length) {
      const row = res.rows.item(0);
      return row && row.json ? JSON.parse(row.json) : null;
    }
    return null;
  } catch (e) {
    console.error("getProfileByEmail error", e);
    return null;
  }
}

export async function saveProfile(profile) {
  try {
    if (!profile || !profile.email || !profile.password) {
      return { ok: false, error: "Email and password are required" };
    }
    if (typeof profile.password === "string" && profile.password.length < 4) {
      return { ok: false, error: "Password must be at least 4 characters" };
    }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      return { ok: false, error: "Invalid email format" };
    }

    await ensureInit();
    await execSql(
      "REPLACE INTO profiles (email, name, password, json) VALUES (?, ?, ?, ?)",
      [
        profile.email,
        profile.name || "",
        profile.password,
        JSON.stringify(profile),
      ],
    );
    return { ok: true };
  } catch (e) {
    console.error("saveProfile error", e);
    return { ok: false, error: e.message };
  }
}

export async function registerProfile(profile) {
  try {
    if (!profile || !profile.email || !profile.password) {
      return { ok: false, error: "Email and password are required" };
    }
    if (typeof profile.password === "string" && profile.password.length < 4) {
      return { ok: false, error: "Password must be at least 4 characters" };
    }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      return { ok: false, error: "Invalid email format" };
    }

    await ensureInit();
    // check existing
    try {
      const check = await execSql(
        "SELECT id FROM profiles WHERE email = ? LIMIT 1",
        [profile.email],
      );
      if (check && check.rows && check.rows.length) {
        return { ok: false, error: "Email already taken" };
      }
    } catch (e) {
      // ignore check errors
    }

    await execSql(
      "INSERT INTO profiles (email, name, password, json) VALUES (?, ?, ?, ?)",
      [
        profile.email,
        profile.name || "",
        profile.password,
        JSON.stringify(profile),
      ],
    );
    const user = {
      email: profile.email,
      name: profile.name || "",
      loggedAt: Date.now(),
    };
    await execSql("REPLACE INTO kv (key, value) VALUES (?, ?)", [
      KEYS.USER,
      JSON.stringify(user),
    ]);
    return { ok: true, user };
  } catch (e) {
    console.error("registerProfile error", e);
    return { ok: false, error: e.message };
  }
}

export async function getPosts() {
  try {
    await ensureInit();
    const res = await execSql("SELECT json FROM posts ORDER BY rowid DESC");
    const out = [];
    if (res && res.rows) {
      for (let i = 0; i < res.rows.length; i++) {
        const r = res.rows.item(i);
        if (r && r.json) out.push(JSON.parse(r.json));
      }
    }
    return out;
  } catch (e) {
    console.error("getPosts error", e);
    return [];
  }
}

export async function savePost(post) {
  try {
    const newPost = { id: post.id || Date.now().toString(), ...post };
    await ensureInit();
    await execSql(
      "REPLACE INTO posts (id, author_email, json) VALUES (?, ?, ?)",
      [newPost.id, post.author_email || "", JSON.stringify(newPost)],
    );
    return newPost;
  } catch (e) {
    console.error("savePost error", e);
    return null;
  }
}

export async function clearUser() {
  try {
    await ensureInit();
    await execSql("DELETE FROM kv WHERE key = ?", [KEYS.USER]);
  } catch (e) {
    console.error("clearUser error", e);
  }
}

export async function logout() {
  try {
    await ensureInit();
    await execSql("DELETE FROM kv WHERE key = ?", [KEYS.USER]);
  } catch (e) {
    console.error("logout error", e);
  }
}

export async function clearAll() {
  try {
    await ensureInit();
    await execSql("DELETE FROM kv");
    await execSql("DELETE FROM profiles");
    await execSql("DELETE FROM posts");
  } catch (e) {
    console.error("clearAll error", e);
  }
}

export default {
  loginCheck,
  loadUser,
  getProfile,
  saveProfile,
  registerProfile,
  getPosts,
  savePost,
  clearUser,
  logout,
  clearAll,
};
