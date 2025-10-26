import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Vibration,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Pulse animation for emergency button
  const pulse = useSharedValue(1);
  pulse.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleEmergencyPress = () => {
    Vibration.vibrate(60);
    router.push('/tabs/chatbot');
  };

  const handleCallEmergency = () => {
    Linking.openURL('tel:911'); // replace with your region's emergency number
  };

  const openTopic = (topicId: string, title: string) => {
    router.push(
      `/tabs/library?topic=${encodeURIComponent(topicId)}&title=${encodeURIComponent(title)}`
    );
  };

  const quickAccess = [
    { id: 'cpr', title: 'CPR', desc: 'Cardiac arrest', icon: 'heart-pulse', color: '#ef4444' },
    { id: 'bleeding', title: 'Bleeding', desc: 'Severe bleeding', icon: 'blood-bag', color: '#dc2626' },
    { id: 'burns', title: 'Burns', desc: 'Burn injuries', icon: 'fire', color: '#f59e0b' },
    { id: 'choking', title: 'Choking', desc: 'Airway blocked', icon: 'account-voice', color: '#3b82f6' },
    { id: 'seizure', title: 'Seizure', desc: 'Seizure response', icon: 'flash', color: '#8b5cf6' },
    { id: 'mental', title: 'Mental Health', desc: 'Emotional support', icon: 'head-heart', color: '#0ea5e9' },
  ];

  return (
    <LinearGradient
      colors={['#ffffff', '#f0f9ff']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* 🧷 Fixed Logo Header */}
      <View style={styles.fixedHeader}>
        <Image
          source={require('../../src/assets/aifaa_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }} // push down to not overlap logo
      >
        {/* Header Icons */}
        <View style={styles.headerIconsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/tabs/library')}
          >
            <Ionicons name="book-outline" size={22} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/tabs/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Stay Calm. We're Here to Help.</Text>
          <Text style={styles.subtitle}>
            AI-powered first aid guidance in seconds. Available offline, always ready.
          </Text>
        </View>

        {/* Emergency Button */}
        <View style={styles.emergencySection}>
          <Animated.View style={pulseStyle as any}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.emergencyButton}
              onPress={handleEmergencyPress}
            >
              <Ionicons name="alert-circle" size={42} color="white" />
              <Text style={styles.emergencyText}>EMERGENCY</Text>
              <Text style={styles.emergencySub}>Tap for Immediate Help</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.callButton}
            activeOpacity={0.85}
            onPress={handleCallEmergency}
          >
            <Ionicons name="call-outline" size={18} color="#dc2626" style={{ marginRight: 6 }} />
            <Text style={styles.callText}>Call Emergency Services</Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            • WHO-approved guidelines • Works offline • Privacy protected
          </Text>
        </View>

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {quickAccess.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickCard}
              activeOpacity={0.9}
              onPress={() => openTopic(item.id, item.title)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '22' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
              </View>
              <Text style={styles.quickTitle}>{item.title}</Text>
              <Text style={styles.quickDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Highlights */}
        <View style={styles.featureContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="flash-outline" size={26} color="#f59e0b" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Instant Guidance</Text>
              <Text style={styles.featureDesc}>
                Get step-by-step instructions immediately when every second counts.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="cloud-offline-outline" size={26} color="#3b82f6" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Works Offline</Text>
              <Text style={styles.featureDesc}>
                Access critical first aid info even without internet connection.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="mic-outline" size={26} color="#10b981" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Voice Enabled</Text>
              <Text style={styles.featureDesc}>
                Hands-free guidance when you need both hands for helping.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app provides first aid guidance but does not replace professional medical care. 
            Always call emergency services for serious emergencies.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Fixed Logo Header
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderColor: '#e5e7eb',
  },
  logoImage: {
    width: 90,
    height: 90,
  },

  headerIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -10,
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 50,
    marginLeft: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  emergencySection: {
    alignItems: 'center',
    marginTop: 25,
  },
  emergencyButton: {
    width: 250,
    height: 120,
    backgroundColor: '#ef4444',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 20,
    marginTop: 4,
  },
  emergencySub: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  callText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginTop: 30,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  quickTitle: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 14,
    marginBottom: 3,
  },
  quickDesc: {
    color: '#6b7280',
    fontSize: 11,
    textAlign: 'center',
  },
  featureContainer: {
    marginTop: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 14,
  },
  featureDesc: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 10,
    marginTop: 25,
    marginBottom: 20,
  },
  footerText: {
    color: '#92400e',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
