import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useProfile } from "./profile-context";

export default function ProfileScreen({ navigation }) {
  const { profile, setProfile, hydrated } = useProfile();

  function handleSave() {
    // setProfile persists via ProfileProvider
    setProfile(profile);
    Alert.alert("Profile", "Profile saved.");
  }

  useEffect(() => {
    // protect this screen: wait for profile hydration first
    if (hydrated && (!profile || !profile.email)) {
      navigation.replace("Login");
    }
  }, [profile]);

  if (!profile) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ height: 50 }} />
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>{profile.name || "User"}!</Text>
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.textInputZone}
            value={profile.name}
            onChangeText={(v) => setProfile({ ...profile, name: v })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInputZone}
            value={profile.email}
            onChangeText={(v) => setProfile({ ...profile, email: v })}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.textInputZone}
            value={profile.address}
            onChangeText={(v) => setProfile({ ...profile, address: v })}
          />

          <Text style={styles.label}>Avatar URL</Text>
          <TextInput
            style={styles.textInputZone}
            value={profile.avatarUrl}
            onChangeText={(v) => setProfile({ ...profile, avatarUrl: v })}
            placeholder="http://..."
            autoCapitalize="none"
            keyboardType="url"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textInputZone, styles.descriptionBox]}
            value={profile.description}
            onChangeText={(v) => setProfile({ ...profile, description: v })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          {/* Logout removed per request */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eee",
  },
  form: {
    width: "100%",
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  textInputZone: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  descriptionBox: {
    height: 120,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: "#fff",
  },
  logoutButton: {
    backgroundColor: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
