import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

export default function Library() {
  const [activeTab, setActiveTab] = useState("All");
  const pathname = usePathname();

  const topics = {
    All: [
      { icon: "❤️", title: "CPR (Cardiopulmonary Resuscitation)", desc: "Step-by-step guide for performing CPR on adults, children, and infants" },
      { icon: "🩸", title: "Severe Bleeding Control", desc: "How to stop severe bleeding and apply pressure dressings" },
      { icon: "🔥", title: "Burn Treatment", desc: "First aid for minor and severe burns" },
      { icon: "🫁", title: "Choking Response", desc: "Heimlich maneuver and back blows for choking victims" },
      { icon: "⚡", title: "Seizure Management", desc: "How to help someone having a seizure safely" },
      { icon: "🦴", title: "Fractures & Sprains", desc: "Immobilization and care for bone and joint injuries" },
    ],
    Physical: [
      { icon: "❤️", title: "CPR (Cardiopulmonary Resuscitation)", desc: "Step-by-step guide for performing CPR on adults, children, and infants" },
      { icon: "🩸", title: "Severe Bleeding Control", desc: "How to stop severe bleeding and apply pressure dressings" },
      { icon: "🔥", title: "Burn Treatment", desc: "First aid for minor and severe burns" },
    ],
    Mental: [
      { icon: "😰", title: "Anxiety & Panic Attacks", desc: "Calming techniques and breathing exercises" },
      { icon: "😢", title: "Emotional Shock", desc: "Supporting someone in emotional distress" },
      { icon: "🧘‍♂️", title: "Breathing Exercises", desc: "Techniques to calm down and reduce stress" },
    ],
  };

  const currentTopics =
    activeTab === "All"
      ? topics.All
      : activeTab === "Physical"
      ? topics.Physical
      : topics.Mental;

  // New 3-tab floating nav
  const navItems = [
    { label: "Home", icon: "home-outline", route: "/tabs" },
    { label: "Emergency", icon: "alert-circle-outline", route: "/tabs/emergency" },
    { label: "Library", icon: "book-outline", route: "/tabs/library" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0B3C5D" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>First Aid Library</Text>
          <Text style={styles.subtitle}>WHO-approved guidelines</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search first aid topics..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {["All", "Physical", "Mental"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "Mental" ? "Mental Health" : tab === "All" ? "All Topics" : "Physical"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Topic Cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentTopics.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="book-outline" size={20} color="#6B7280" />
          </View>
        ))}
      </ScrollView>

      {/* Floating Bottom Navigation */}
      <View style={styles.floatingNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              onPress={() => router.push(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={26}
                color={isActive ? "#ef4444" : "#6B7280"}
              />
              <Text style={[styles.navText, { color: isActive ? "#ef4444" : "#6B7280" }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        onPress={() => router.push("/tabs/chatbot")}
        style={styles.floatingChat}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFD",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B3C5D",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 15,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#00AEEF",
  },
  tabText: { color: "#6B7280", fontSize: 14, fontWeight: "500" },
  tabTextActive: { color: "#0B3C5D" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardIcon: { fontSize: 26, marginRight: 12 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  cardDesc: { fontSize: 13, color: "#6B7280", marginTop: 3 },

  /* Floating Bottom Nav */
  floatingNav: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderRadius: 40,
    elevation: 10,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 11, marginTop: 2 },

  /* Floating Chatbot */
  floatingChat: {
    position: "absolute",
    bottom: 95,
    right: 25,
    backgroundColor: "#007AFF",
    width: 55,
    height: 55,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
});
