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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [voiceType, setVoiceType] = useState('Female (Calm)');

  const toggleVoiceGuidance = () => setVoiceGuidance(!voiceGuidance);
  const toggleDarkMode = () => setDarkMode(!darkMode);

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
              onPress={() =>
                Alert.alert('Change Language', 'Feature coming soon')
              }
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
          <Text style={styles.subText}>
            Made with ❤️ for Kenya and beyond
          </Text>
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
});

