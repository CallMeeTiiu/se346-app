import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./login-screen";
import RegisterScreen from "./register-screen";
import MainTabs from "./main-tabs";
import { ProfileProvider } from "./profile-context";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <ProfileProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </ProfileProvider>
      </PostsProvider>
    </AuthProvider>
  );
}
