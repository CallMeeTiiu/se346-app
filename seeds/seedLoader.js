import { sampleProfile, samplePosts } from "./seed-data";
import { saveProfile, savePost } from "../storage-utils";

/** Apply seed data into AsyncStorage via storage-utils.
 * Call this from a dev-only screen or a run-once flow.
 */
export async function applySeed() {
  // save profile (sampleProfile is an array of demo users; save the first one
  // because saveProfile expects a single profile object in this demo storage)
  if (Array.isArray(sampleProfile)) {
    await saveProfile(sampleProfile[0]);
  } else {
    await saveProfile(sampleProfile);
  }
  // save posts
  for (const p of samplePosts) {
    await savePost(p);
  }
}

export default { applySeed };
