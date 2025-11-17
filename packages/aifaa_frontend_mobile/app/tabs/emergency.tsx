import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useRouter, useSegments } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../../src/store/useAppStore";

const { width } = Dimensions.get("window");

/**
 * IMPORTANT:
 * Replace this with your API key securely.
 * For local testing you can paste the key, but in production use environment variables.
 */
const GOOGLE_PLACES_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY_HERE";

type PlaceItem = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  geometry?: { location: { lat: number; lng: number } };
};

export default function Emergency() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const currentRoute = segments[1] || "emergency";

  const { theme } = useAppStore();
  const isLight = theme === "light";

  // location state
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [loadingLocation, setLoadingLocation] = useState(false);

  // places
  const [hospitals, setHospitals] = useState<PlaceItem[]>([]);
  const [nearbyAmbulances, setNearbyAmbulances] = useState<PlaceItem[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  // selected place details
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // static ambulance list (callable)
  const staticAmbulanceServices = [
    { name: "Kenya Red Cross", phone: "+254703037000" },
    { name: "St John Ambulance", phone: "+254202100000" },
    { name: "AAR Emergency", phone: "+254703063000" },
    { name: "AMREF Flying Doctors", phone: "+254206090300" },
  ];

  // Emergency functions
  const fetchLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoords({ lat: latitude, lon: longitude });
      // Optionally notify user
      // Alert.alert("Location", `Lat: ${latitude}, Lon: ${longitude}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to fetch location.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const openMapsAt = (lat: number, lng: number, label?: string) => {
    const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=`;
    Linking.openURL(url);
  };

  const callNumber = (phone: string) => {
    if (!phone) {
      Alert.alert("No phone", "Phone number not available for this place.");
      return;
    }
    const tel = `tel:${phone}`;
    Linking.canOpenURL(tel)
      .then((supported) => (supported ? Linking.openURL(tel) : null))
      .catch(() => Alert.alert("Error", "Unable to place call."));
  };

  // Animated values
  const pulse = useSharedValue(1);
  pulse.value = withRepeat(withTiming(1.1, { duration: 1200 }), -1, true);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const glow = useSharedValue(1);
  glow.value = withRepeat(
    withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: 0.85,
  }));

  // Utility: fetch nearby places (type or keyword)
  const fetchNearbyPlaces = async (
    type: "hospital" | "establishment",
    keyword?: string
  ) => {
    if (!coords) {
      Alert.alert("No Location", "Please get your location first.");
      return;
    }
    try {
      setPlacesLoading(true);
      const location = `${coords.lat},${coords.lon}`;
      // radius in meters
      const radius = 5000;
      // Build url
      // For hospitals we use type=hospital
      // For ambulance we use keyword=ambulance & type=establishment
      const params = new URLSearchParams({
        location,
        radius: String(radius),
        key: GOOGLE_PLACES_API_KEY,
      });
      if (type) params.append("type", type);
      if (keyword) params.append("keyword", keyword);

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.error_message) {
        console.warn("Places API error:", json.error_message);
        Alert.alert("Places API error", json.error_message);
        setPlacesLoading(false);
        return;
      }
      const results: PlaceItem[] = json.results || [];

      if (keyword === "ambulance") {
        setNearbyAmbulances(results);
      } else {
        // default map to hospitals
        setHospitals(results);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch nearby places.");
    } finally {
      setPlacesLoading(false);
    }
  };

  // Fetch place details to get phone
  const fetchPlaceDetails = async (place_id: string) => {
    try {
      setDetailsLoading(true);
      const fields = ["formatted_phone_number", "formatted_address", "website"].join(
        ","
      );
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.error_message) {
        console.warn("Place details error:", json.error_message);
        Alert.alert("Place Details error", json.error_message);
        setDetailsLoading(false);
        return;
      }
      setSelectedPlaceDetails(json.result || null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch place details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // UI helpers
  const onFindNearest = async () => {
    if (!coords) {
      await fetchLocation();
      // if location set by fetchLocation, proceed
    }
    // small delay to ensure coords updated if just fetched
    setTimeout(() => {
      fetchNearbyPlaces("hospital");
      fetchNearbyPlaces("establishment", "ambulance");
    }, 600);
  };

  const openPlaceInMaps = (place: PlaceItem) => {
    if (place.geometry && place.geometry.location) {
      openMapsAt(place.geometry.location.lat, place.geometry.location.lng, place.name);
    } else {
      // fallback to search query
      const q = encodeURIComponent(place.name);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
    }
  };

  const renderPlaceRow = (item: PlaceItem, idx: number) => (
    <View key={item.place_id || idx} style={styles.placeRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.placeName}>{item.name}</Text>
        {item.vicinity ? <Text style={styles.placeVicinity}>{item.vicinity}</Text> : null}
      </View>

      <View style={styles.placeActions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            // fetch details to get phone if not already
            fetchPlaceDetails(item.place_id);
          }}
        >
          <Ionicons name="call-outline" size={20} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openPlaceInMaps(item)}
        >
          <Ionicons name="navigate-outline" size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#ffffff", "#f0f9ff"]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Top Nav (kept) */}
      <View style={styles.topNav}>
        <Image
          source={require("../../src/assets/aifaa_logo.png")}
          style={styles.logoImage}
          resizeMode="cover"
        />

        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navIcon}>
            <Ionicons name="notifications-outline" size={22} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navIcon}
            onPress={() => router.push("/tabs/settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title below top nav (per your request) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Services</Text>
        <Text style={styles.headerSubtitle}>Quick access to help</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 150 }}
      >
        {/* In Case of Emergency banner */}
        <View style={styles.alertBanner}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="alert-circle-outline" size={18} color="#991b1b" />
            <Text style={styles.alertTitle}>In Case of Emergency</Text>
          </View>
          <Text style={styles.alertText}>
            If you're experiencing a life-threatening emergency, call your local emergency number immediately.
          </Text>
        </View>

        {/* Emergency Services card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={18} color="#0f766e" />
            <Text style={styles.sectionTitle}>Emergency Services</Text>
          </View>

          <TouchableOpacity
            style={styles.serviceRow}
            onPress={() => Linking.openURL("tel:999")}
          >
            <View style={styles.serviceLeft}>
              <View style={styles.serviceIconCircle}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.serviceLabel}>Police</Text>
                <Text style={styles.serviceNumber}>999</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceRow}
            onPress={() => Linking.openURL("tel:911")}
          >
            <View style={styles.serviceLeft}>
              <View style={styles.serviceIconCircle}>
                <Ionicons name="medkit-outline" size={18} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.serviceLabel}>Ambulance</Text>
                <Text style={styles.serviceNumber}>911</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Nearest Emergency Services */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color="#0f766e" />
            <Text style={styles.sectionTitle}>Nearest Emergency Services</Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={styles.findButton}
              onPress={onFindNearest}
            >
              {placesLoading || loadingLocation ? (
                <ActivityIndicator color="#065f46" />
              ) : (
                <>
                  <Ionicons name="locate-outline" size={16} color="#065f46" />
                  <Text style={styles.findButtonText}>Find Nearest Services</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Render nearby hospitals */}
            {hospitals.length > 0 && (
              <>
                <Text style={styles.subListTitle}>Nearby Hospitals</Text>
                {hospitals.map((h, i) => renderPlaceRow(h, i))}
              </>
            )}

            {/* Render nearby ambulances */}
            {nearbyAmbulances.length > 0 && (
              <>
                <Text style={styles.subListTitle}>Nearby Ambulance Services</Text>
                {nearbyAmbulances.map((a, i) => renderPlaceRow(a, i))}
              </>
            )}
          </View>
        </View>

        {/* Ambulance Services (static list) */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={18} color="#0f766e" />
            <Text style={styles.sectionTitle}>Ambulance Services</Text>
          </View>

          <View style={{ marginTop: 8 }}>
            {staticAmbulanceServices.map((s) => (
              <View key={s.phone} style={styles.placeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.placeName}>{s.name}</Text>
                  <Text style={styles.placeVicinity}>{s.phone}</Text>
                </View>

                <View style={styles.placeActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => callNumber(s.phone)}
                  >
                    <Ionicons name="call-outline" size={20} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* My Emergency Contacts */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={18} color="#0f766e" />
            <Text style={styles.sectionTitle}>My Emergency Contacts</Text>

            <TouchableOpacity
              style={styles.addContactBtn}
              onPress={() => {
                // implement navigation to add contact screen or use Contacts API
                Alert.alert("Add Contact", "Implement add contact flow here.");
              }}
            >
              <Ionicons name="add-outline" size={16} color="#0f766e" />
              <Text style={styles.addContactText}>Add Contact</Text>
            </TouchableOpacity>
          </View>

          <View style={{ padding: 12 }}>
            <Text style={{ color: "#6b7280" }}>
              No emergency contacts added yet. Add contacts who should be notified
              in emergencies.
            </Text>
          </View>
        </View>

        {/* Selected place details (modal-like inline) */}
        {selectedPlaceDetails && (
          <View style={[styles.card, { marginBottom: 30 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: 16 }]}>
                {selectedPlaceDetails.name || "Details"}
              </Text>
            </View>

            <View style={{ padding: 12 }}>
              {detailsLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  {selectedPlaceDetails.formatted_phone_number && (
                    <TouchableOpacity
                      style={styles.detailRow}
                      onPress={() =>
                        callNumber(selectedPlaceDetails.formatted_phone_number)
                      }
                    >
                      <Ionicons name="call-outline" size={18} />
                      <Text style={styles.detailText}>
                        {selectedPlaceDetails.formatted_phone_number}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {selectedPlaceDetails.formatted_address && (
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={18} />
                      <Text style={styles.detailText}>
                        {selectedPlaceDetails.formatted_address}
                      </Text>
                    </View>
                  )}

                  {selectedPlaceDetails.website && (
                    <TouchableOpacity
                      style={styles.detailRow}
                      onPress={() => Linking.openURL(selectedPlaceDetails.website)}
                    >
                      <MaterialIcons name="language" size={18} />
                      <Text style={styles.detailText}>
                        {selectedPlaceDetails.website}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.findButton, { marginTop: 12 }]}
                    onPress={() => {
                      // navigate to place address in maps
                      if (selectedPlaceDetails.geometry?.location) {
                        openMapsAt(
                          selectedPlaceDetails.geometry.location.lat,
                          selectedPlaceDetails.geometry.location.lng,
                          selectedPlaceDetails.name
                        );
                      } else if (selectedPlaceDetails.formatted_address) {
                        Linking.openURL(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            selectedPlaceDetails.formatted_address
                          )}`
                        );
                      } else {
                        Alert.alert("No Location", "No location available.");
                      }
                    }}
                  >
                    <Ionicons name="navigate-outline" size={16} color="#065f46" />
                    <Text style={styles.findButtonText}>Open in Maps</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Chatbot floating */}
      <Animated.View style={[styles.chatGlow, glowStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.chatButton}
          onPress={() => router.push("/tabs/chatbot")}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 12 }]}>
        {[
          { name: "home", label: "Home", icon: "home-outline", route: "/tabs" },
          {
            name: "emergency",
            label: "Emergency",
            icon: "alert-circle-outline",
            route: "/tabs/emergency",
          },
          {
            name: "library",
            label: "Library",
            icon: "book-outline",
            route: "/tabs/library",
          },
        ].map((tab) => {
          const isActive = currentRoute === tab.name;
          const color = isActive ? "#ef4444" : "#6b7280";

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.navItem}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.85}
            >
              {tab.name === "emergency" ? (
                <Animated.View style={pulseStyle}>
                  <Ionicons name={tab.icon} size={26} color={color} />
                </Animated.View>
              ) : (
                <Ionicons name={tab.icon} size={24} color={color} />
              )}

              <Text
                style={{
                  fontSize: 11,
                  marginTop: 2,
                  color,
                  fontWeight: isActive ? "700" : "500",
                }}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 0.3,
    borderColor: "#e5e7eb",
    zIndex: 20,
  },

  navRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  navIcon: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 50,
  },

  logoImage: { width: 70, height: 70 },

  header: {
    marginTop: 80,
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#ef4444" },
  headerSubtitle: { color: "#6b7280", marginTop: 4 },

  alertBanner: {
    backgroundColor: "#fff1f2",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  alertTitle: { color: "#991b1b", fontWeight: "700", fontSize: 14 },
  alertText: { color: "#7f1d1d", marginTop: 8, lineHeight: 18 },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#edf2f7",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginLeft: 6 },

  serviceRow: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLabel: { fontWeight: "700" },
  serviceNumber: { color: "#6b7280", marginTop: 4 },

  findButton: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#d1fae5",
    backgroundColor: "#ecfdf5",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  findButtonText: { color: "#065f46", fontWeight: "700" },

  subListTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "700",
    color: "#0f766e",
  },

  placeRow: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeName: { fontWeight: "700" },
  placeVicinity: { color: "#6b7280", marginTop: 4, fontSize: 12 },
  placeActions: { flexDirection: "row", gap: 8 },

  iconButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6eaf0",
    marginLeft: 8,
  },

  addContactBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#c7f9e7",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
  },
  addContactText: { color: "#0f766e", fontWeight: "700", marginLeft: 4 },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  detailText: { marginLeft: 6, color: "#374151" },

  bottomNav: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 0.85,
    borderRadius: 35,
    height: 65,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: { alignItems: "center", justifyContent: "center" },

  chatGlow: {
    position: "absolute",
    bottom: 95,
    right: 25,
    backgroundColor: "#0bc1eaff",
    borderRadius: 35,
    padding: 4,
  },
  chatButton: {
    backgroundColor: "#21a3eaff",
    borderRadius: 30,
    padding: 14,
  },
});
