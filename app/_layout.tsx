import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Platform } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={28}
              color={focused ? "#f5f1f1ff" : "#fff"}
            />
          ),
        }}
      />

      {/* Chatbot */}
      <Tabs.Screen
        name="chatbot"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubbles"
              size={28}
              color={focused ? "#ff4d4d" : "#fff"}
            />
          ),
        }}
      />

      {/* Library */}
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book"
              size={28}
              color={focused ? "#ff4d4d" : "#fff"}
            />
          ),
        }}
      />

      {/* Emergency */}
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="local-hospital"
              size={28}
              color={focused ? "#ff4d4d" : "#fff"}
            />
          ),
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={28}
              color={focused ? "#ff4d4d" : "#fff"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ff1a1a", // Deep red
    borderRadius: 25,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    ...Platform.select({
      android: { elevation: 5 },
      ios: { shadowColor: "#000" },
    }),
  },
});
