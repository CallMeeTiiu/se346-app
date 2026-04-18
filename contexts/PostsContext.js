import React, { createContext, useEffect, useState } from "react";
import {
  getPosts,
  savePost,
  deletePost as storageDeletePost,
} from "../storage-utils";

export const PostsContext = createContext({
  posts: [],
  loading: true,
  refresh: async () => {},
  addPost: async () => {},
  removePost: async () => {},
});

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const list = await getPosts();
    setPosts(list);
    setLoading(false);
  }

  async function addPost(post) {
    const saved = await savePost(post);
    if (saved) setPosts((prev) => [saved, ...prev]);
    return saved;
  }

  async function removePost(postId) {
    const success = await storageDeletePost(postId);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
    return success;
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PostsContext.Provider
      value={{ posts, loading, refresh, addPost, removePost }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export default PostsProvider;
