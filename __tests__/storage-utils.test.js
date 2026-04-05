import {
  saveProfile,
  getProfile,
  getPosts,
  savePost,
  clearAll,
} from "../storage-utils";
import { sampleProfile, samplePosts } from "../seeds/seed-data";

describe("storage-utils basic operations", () => {
  beforeEach(async () => {
    await clearAll();
  });

  test("save and load profile", async () => {
    const res = await saveProfile(sampleProfile);
    expect(res && res.ok).toBe(true);
    const p = await getProfile();
    expect(p).not.toBeNull();
    expect(p.email).toBe(sampleProfile.email);
  });

  test("save and get posts", async () => {
    for (const post of samplePosts) await savePost(post);
    const list = await getPosts();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(samplePosts.length);
  });
});
