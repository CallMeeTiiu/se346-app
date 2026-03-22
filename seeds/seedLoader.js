import { sampleProfile, samplePosts } from "./seed-data";
import { saveProfile, savePost, clearAll } from "../storage-utils";

/** Apply seed data into AsyncStorage via storage-utils.
 * This is dev-only: clear posts/profile then write known demo data in the
 * shape the UI expects (author, avatar, time, title, body).
 */
export async function applySeed() {
  // clear existing demo data to avoid duplicates
  try {
    await clearAll();
  } catch (e) {
    // ignore errors
  }

  const profileObj = Array.isArray(sampleProfile)
    ? sampleProfile[0]
    : sampleProfile;

  // ensure profile saved first (saveProfile will also set current user)
  await saveProfile(profileObj);

  // write posts transformed to include `author`, `avatar`, `time`, `title`, `body`
  for (const p of samplePosts) {
    const newPost = {
      id: p.id || Date.now().toString(),
      author: profileObj.name || profileObj.email,
      avatar:
        profileObj.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profileObj.name || profileObj.email,
        )}&background=ffffff&color=666&rounded=true&size=128`,
      title: p.title || "",
      body: p.body || p.text || "",
      time: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
    };
    await savePost(newPost);
  }
}

export default { applySeed };
