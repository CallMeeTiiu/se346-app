import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./home-screen";
import ProfileScreen from "./profile-screen";
import SettingScreen from "./setting-screen";

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
  const initial = route?.params?.initialTab || "Home";

  return (
    <Tab.Navigator
      initialRouteName={initial}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Ionicons name="home-outline" size={size} color={color} />;
          }
          if (route.name === "Profile") {
            return <Ionicons name="person-outline" size={size} color={color} />;
          }
          if (route.name === "Settings") {
            return (
              <Ionicons name="settings-outline" size={size} color={color} />
            );
          }
          return null;
        },
        tabBarActiveTintColor: "#0066ff",
        tabBarInactiveTintColor: "#666",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}
