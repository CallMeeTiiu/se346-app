import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "./contexts/AuthContext";

function LoginScreen({ navigation }) {
  const { login, loading: authLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    const res = await login({ email: email.trim(), password });
    setLoading(false);
    if (res && res.ok) {
      // Stack switch will happen automatically via App.js
    } else {
      setError(res && res.error ? res.error : "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 50 }} />
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="test@mail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="● ● ● ●"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.navigation}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.forgot}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSignIn}
        style={[styles.button]}
        disabled={loading || authLoading}
      >
        {loading || authLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={[styles.buttonText]}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;

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
  navigation: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  forgot: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
  errorText: { color: "red", marginTop: 8 },
});
