import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useProfile } from "./profile-context";

export default function SettingScreen({ navigation }) {
  const { setProfile } = useProfile();

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          setProfile(null);
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.rowText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.row, styles.logout]}
        onPress={handleLogout}
      >
        <Text style={[styles.rowText, { color: "#b00020" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rowText: { fontSize: 16 },
  logout: { marginTop: 24 },
});
