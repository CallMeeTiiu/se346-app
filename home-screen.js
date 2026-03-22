import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";

function randomSentence() {
  const samples = [
    "Loving this new app — it's so smooth!",
    "Just had a great coffee and a productive morning.",
    "Anyone tried hiking at the lake trail?",
    "Working on a small React Native project today.",
    "What's your favorite playlist for focus?",
    "I made banana pancakes this morning 😋",
    "Weekend plans: movie night with friends.",
    "Share your best productivity tip!",
    "Sunsets have been beautiful lately.",
    "Reading an interesting book about design patterns.",
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}

import { PostsContext } from "./contexts/PostsContext";
import { AuthContext } from "./contexts/AuthContext";
import { useProfile } from "./profile-context";

export default function HomeScreen() {
  const { posts, loading, addPost } = useContext(PostsContext);
  const { user } = useContext(AuthContext);
  const { profile } = useProfile();
  // local modal state only

  const [modalVisible, setModalVisible] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  function handlePost() {
    setModalVisible(true);
  }

  async function submitPost() {
    const title = postTitle.trim();
    const body = postBody.trim();
    if (!title) {
      Alert.alert("Empty", "Please enter a title for your post.");
      return;
    }
    if (!body) {
      Alert.alert("Empty", "Please enter content for your post.");
      return;
    }
    const authorName = (user && (user.name || user.email)) || "You";
    const avatarUrl =
      profile && profile.avatarUrl
        ? profile.avatarUrl
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            authorName,
          )}&background=ffffff&color=666&rounded=true&size=128`;
    const newPost = {
      author: authorName,
      avatar: avatarUrl,
      title,
      body,
      time: Date.now(),
    };
    await addPost(newPost);
    setPostTitle("");
    setPostBody("");
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        renderItem={({ item, index }) => (
          <View style={[styles.card, index === 0 && styles.highlightCard]}>
            {/* Prefer post avatar; if missing, if this post is by current user use profile avatar; otherwise generate initials avatar */}
            {(() => {
              const byCurrent =
                user && item.author === (user.name || user.email);
              const uri =
                item.avatar ||
                (byCurrent && profile && profile.avatarUrl) ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  item.author || "User",
                )}&background=ffffff&color=666&rounded=true&size=128`;
              return <Image source={{ uri }} style={styles.avatar} />;
            })()}
            <View style={styles.postBody}>
              <View style={styles.metaRow}>
                <Text style={styles.author}>{item.author}</Text>
                <Text style={styles.time}>{timeAgo(item.time)}</Text>
              </View>
              {item.title ? (
                <Text style={[styles.content, { fontWeight: "700" }]}>
                  {item.title}
                </Text>
              ) : null}
              {item.body ? (
                <Text style={styles.content}>{item.body}</Text>
              ) : null}
            </View>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "700", marginBottom: 8 }}>New Post</Text>
            <TextInput
              placeholder="Title"
              value={postTitle}
              onChangeText={setPostTitle}
              style={[styles.input, { minHeight: 40 }]}
            />
            <TextInput
              multiline
              placeholder="Write your post content..."
              value={postBody}
              onChangeText={setPostBody}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitPost} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        accessibilityLabel="Post text only"
        style={styles.fab}
        onPress={handlePost}
      >
        <Text style={styles.fabText}>🤔</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center" },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "flex-start",
    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // elevation for Android
    elevation: 2,
  },
  highlightCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#0066ff",
    backgroundColor: "#f7fbff",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  postBody: { flex: 1 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: { fontWeight: "700", marginBottom: 6 },
  time: { color: "#666", fontSize: 12 },
  content: { color: "#333", marginTop: 4 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#0066ff",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabText: { fontSize: 24, color: "white" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  input: {
    minHeight: 80,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    textAlignVertical: "top",
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  modalButtonText: { color: "#0066ff", fontWeight: "700" },
});
