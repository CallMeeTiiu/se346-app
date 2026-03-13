import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "./register-screen";
import ProfileScreen from "./profile-screen";

function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{ height: 50 }} />
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.textInputZone} placeholder="test@mail.com" />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.textInputZone}
          placeholder="● ● ● ●"
          secureTextEntry
        />
        <View style={styles.navigation}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.forgot}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={[styles.button]}
      >
        <Text style={[styles.buttonText]}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
});
