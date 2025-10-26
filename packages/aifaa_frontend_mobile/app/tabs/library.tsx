import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Library() {
  const [activeTab, setActiveTab] = useState("All");

  // Example topics
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
      { icon: "🫁", title: "Choking Response", desc: "Heimlich maneuver and back blows for choking victims" },
      { icon: "⚡", title: "Seizure Management", desc: "How to help someone having a seizure safely" },
      { icon: "🦴", title: "Fractures & Sprains", desc: "Immobilization and care for bone and joint injuries" },
    ],
    Mental: [
      { icon: "😰", title: "Anxiety & Panic Attacks", desc: "Calming techniques and breathing exercises" },
      { icon: "😢", title: "Emotional Shock", desc: "Supporting someone in emotional distress" },
      { icon: "🧘‍♂️", title: "Breathing Exercises", desc: "Techniques to calm down and reduce stress" },
      { icon: "💛", title: "Crisis Support", desc: "How to help someone in a mental health crisis" },
    ],
  };

  const currentTopics =
    activeTab === "All"
      ? topics.All
      : activeTab === "Physical"
      ? topics.Physical
      : topics.Mental;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={22} color="#0B3C5D" />
        <View>
          <Text style={styles.title}>First Aid Library</Text>
          <Text style={styles.subtitle}>WHO-approved guidelines</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search first aid topics..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["All", "Physical", "Mental"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "Mental" ? "Mental Health" : tab === "All" ? "All Topics" : "Physical"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Topic List */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFD",
    paddingHorizontal: 16,
    paddingTop: 20,
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
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
  tabText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#0B3C5D",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
});
