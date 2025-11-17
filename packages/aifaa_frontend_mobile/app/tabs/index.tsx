import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const currentRoute = segments[1] || 'home';

  // 🔴 Pulse for emergency icon in nav
  const pulse = useSharedValue(1);
  pulse.value = withRepeat(withTiming(1.1, { duration: 1200 }), -1, true);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // 💬 Pulse for chatbot button glow
  const glow = useSharedValue(1);
  glow.value = withRepeat(
    withTiming(1.2, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    }),
    -1,
    true
  );
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: 0.8,
  }));

  const handleCallEmergency = () => {
    Linking.openURL('tel:911');
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
    <LinearGradient colors={['#ffffff', '#f0f9ff']} style={[styles.container, { paddingTop: insets.top }]}>
      {/* 🔝 Top Navigation Bar */}
      <View style={styles.topNav}>
        <View style={styles.navLeft}>
          <Image
            source={require('../../src/assets/aifaa_logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
          
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navIcon}>
            <Ionicons name="notifications-outline" size={22} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon} onPress={() => router.push('/tabs/settings')}>
            <Ionicons name="settings-outline" size={22} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔽 Scrollable Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 100 }}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Stay Calm. We're Here to Help.</Text>
          <Text style={styles.subtitle}>
            AI-powered first aid guidance in seconds. Available offline, always ready.
          </Text>
        </View>

        {/* 🚨 Emergency Buttons */}
        <View style={styles.emergencySection}>
          <TouchableOpacity
            style={styles.bigEmergencyButton}
            activeOpacity={0.85}
            onPress={() => router.push('/tabs/emergency')}
          >
            <Ionicons name="alert" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.bigEmergencyText}>Start Emergency Assistance</Text>
          </TouchableOpacity>

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

        {/* 🩹 Quick Access */}
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app provides first aid guidance but does not replace professional medical care.
            Always call emergency services for serious emergencies.
          </Text>
        </View>
      </ScrollView>

      {/* 💬 Floating Chatbot Button */}
      <Animated.View style={[styles.chatGlow, glowStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.chatButton}
          onPress={() => router.push('/tabs/chatbot')}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      

      {/* ⬇️ Floating Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 12 }]}>
        {[
          { name: 'home', label: 'Home', icon: 'home-outline', route: '/tabs' },
          { name: 'emergency', label: 'Emergency', icon: 'alert-circle-outline', route: '/tabs/emergency' },
          { name: 'library', label: 'Library', icon: 'book-outline', route: '/tabs/library' },
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
                <Ionicons name={tab.icon as any} size={24} color={color} />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderColor: '#e5e7eb',
    zIndex: 10,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  navIcon: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 50,
    marginLeft: 10,
  },
  logoImage: { width: 70, height: 70 },
  appName: { fontSize: 17, fontWeight: '700', color: '#111827', marginLeft: 8 },
  titleContainer: { alignItems: 'center', marginTop: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
  emergencySection: { alignItems: 'center', marginTop: 20 },
  bigEmergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    elevation: 6,
  },
  bigEmergencyText: { color: '#fff', fontWeight: '700', fontSize: 16, textTransform: 'uppercase' },
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
  callText: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  infoText: { color: '#9ca3af', fontSize: 11, marginTop: 10, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginTop: 30, marginBottom: 10 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
  },
  iconContainer: { padding: 10, borderRadius: 50, marginBottom: 10 },
  quickTitle: { fontWeight: '700', color: '#111827', fontSize: 14, marginBottom: 3 },
  quickDesc: { color: '#6b7280', fontSize: 11, textAlign: 'center' },
  footer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 10,
    marginTop: 25,
    marginBottom: 20,
  },
  footerText: { color: '#92400e', fontSize: 11, textAlign: 'center', lineHeight: 16 },
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width * 0.85,
    borderRadius: 35,
    height: 65,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, marginTop: 2 },
  chatGlow: {
    position: 'absolute',
    bottom: 95,
    right: 25,
    backgroundColor: '#0bc1eaff',
    borderRadius: 35,
    padding: 4,
    shadowColor: '#12e0f3ff',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  chatButton: {
    backgroundColor: '#21a3eaff',
    borderRadius: 30,
    padding: 14,
    elevation: 8,
  },
  chatLabel: {
    position: 'absolute',
    bottom: 70,
    right: 26,
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
});    