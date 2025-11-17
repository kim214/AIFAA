import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  // 🔹 Detect current route
  const currentRoute = segments[1] || 'settings';

  // 🔹 Animation for Emergency icon
  const pulse = useSharedValue(1);
  pulse.value = withRepeat(withTiming(1.1, { duration: 1200 }), -1, true);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [voiceType, setVoiceType] = useState('Female (Calm)');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const toggleVoiceGuidance = () => setVoiceGuidance(!voiceGuidance);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const languages = [
    'English',
    'Kiswahili',
    'Kalenjin',
    'Kikuyu',
    'Luo',
    'Luhya',
    'Kamba',
    'Maasai',
    'Meru',
  ];

  const handleCallEmergency = () => {
    Linking.openURL('tel:911'); // Replace with Kenya’s local emergency number if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Language & Voice */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="translate" size={20} color="#0284c7" />
            <Text style={styles.cardTitle}>Language & Voice</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>App Language</Text>
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              style={styles.optionBox}
            >
              <Text style={styles.optionText}>{language}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>AI Voice Type</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Change Voice Type', 'Feature coming soon')
              }
              style={styles.optionBox}
            >
              <Text style={styles.optionText}>{voiceType}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelRow}>
              <Ionicons name="volume-high-outline" size={20} color="#0284c7" />
              <Text style={styles.switchLabel}>Voice Guidance</Text>
            </View>
            <Switch
              value={voiceGuidance}
              onValueChange={toggleVoiceGuidance}
              thumbColor={voiceGuidance ? '#0284c7' : '#f4f4f5'}
            />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon-outline" size={20} color="#0284c7" />
            <Text style={styles.cardTitle}>Appearance</Text>
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.subText}>Easier on the eyes at night</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              thumbColor={darkMode ? '#0284c7' : '#f4f4f5'}
            />
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="call-outline" size={20} color="#0284c7" />
            <Text style={styles.cardTitle}>Emergency Contacts</Text>
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert('Add Contact', 'Feature coming soon')}
            style={styles.addContactBox}
          >
            <Ionicons name="person-add-outline" size={20} color="#0284c7" />
            <Text style={styles.addContactText}>Add Emergency Contact</Text>
          </TouchableOpacity>

          <Text style={styles.subText}>
            Add trusted contacts who can be notified in emergencies
          </Text>
        </View>

        {/* About */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#0284c7" />
            <Text style={styles.cardTitle}>About</Text>
          </View>

          <Text style={styles.subText}>Version 1.0.0</Text>
          <Text style={styles.subText}>Based on WHO First Aid Guidelines</Text>
          <Text style={styles.subText}>Made with ❤️ for Kenya and beyond</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Medical Disclaimer:</Text>
          <Text style={styles.disclaimerText}>
            This app provides first aid guidance based on WHO guidelines but does
            not replace professional medical advice, diagnosis, or treatment.
            Always seek emergency medical care when appropriate.
          </Text>
        </View>
      </ScrollView>

      {/* 🔹 Language Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select App Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => {
                    setLanguage(item);
                    setLanguageModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageText,
                      item === language && { color: '#0284c7', fontWeight: '700' },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ⬇️ Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 10 }]}>
        {[
          { name: 'home', label: 'Home', icon: 'home-outline', route: '/tabs' },
          {
            name: 'chatbot',
            label: 'Chat',
            icon: 'chatbubble-ellipses-outline',
            route: '/tabs/chatbot',
          },
          {
            name: 'emergency',
            label: 'Emergency',
            icon: 'alert-circle-outline',
            route: '/tabs/emergency',
          },
          { name: 'library', label: 'Library', icon: 'book-outline', route: '/tabs/library' },
          { name: 'settings', label: 'Settings', icon: 'settings-outline', route: '/tabs/settings' },
        ].map((tab) => {
          const isActive = currentRoute === tab.name;
          const color = isActive ? '#ef4444' : '#6b7280';
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.navItem}
              activeOpacity={0.85}
              onPress={() => router.push(tab.route)}
            >
              {tab.name === 'emergency' ? (
                <Animated.View style={pulseStyle}>
                  <Ionicons name={tab.icon as any} size={26} color={color} />
                </Animated.View>
              ) : (
                <Ionicons name={tab.icon as any} size={22} color={color} />
              )}
              <Text
                style={[
                  styles.navText,
                  { color, fontWeight: isActive ? '700' : '500' },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0284c7',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
    color: '#0f172a',
  },
  settingRow: {
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 4,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  subText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  addContactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  addContactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  disclaimerBox: {
    backgroundColor: '#fef9c3',
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284c7',
    marginBottom: 12,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  languageText: {
    fontSize: 14,
    color: '#0f172a',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.3,
    borderColor: '#e5e7eb',
    height: 70,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
});
