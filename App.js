import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./login-screen";
import RegisterScreen from "./register-screen";
import MainTabs from "./main-tabs";
import { ProfileProvider } from "./profile-context";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { applySeed } from "./seeds/seedLoader";
import { getProfile } from "./storage-utils";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // App will just open. If there is a session, it handles itself.
      } catch (e) {
        console.warn("App init error", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) return null;

  return (
    <AuthProvider>
      <PostsProvider>
        <ProfileProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ProfileProvider>
      </PostsProvider>
    </AuthProvider>
  );
}
