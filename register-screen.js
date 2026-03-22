import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useProfile } from "./profile-context";

const RegisterScreen = ({ navigation }) => {
  const { setProfile } = useProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function handleCreate() {
    if (!name || !email) {
      Alert.alert("Register", "Please enter name and email.");
      return;
    }
    if (password && password !== confirm) {
      Alert.alert("Register", "Passwords do not match.");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
    }));

    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { initialTab: "Profile" } }],
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="test@mail.com"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="● ● ● ●"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="● ● ● ●"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>
      <TouchableOpacity onPress={handleCreate} style={[styles.button]}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "left",
  },
  textInputZone: {
    width: "100%",
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  button: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterScreen;
