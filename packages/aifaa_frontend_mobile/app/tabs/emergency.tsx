import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import * as Location from "expo-location";
import { useState } from "react";
import { useAppStore } from "../../src/store/useAppStore";

export default function Emergency() {
  const { theme } = useAppStore();
  const isLight = theme === "light";

  const bgColor = isLight ? "bg-white" : "bg-gray-900";
  const textColor = isLight ? "text-red-600" : "text-red-400";
  const cardColor = isLight ? "bg-gray-100" : "bg-gray-800";
  const btnColor = isLight ? "bg-red-600" : "bg-red-500";

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    try {
      await Linking.openURL("tel:911");
    } catch (error) {
      Alert.alert("Error", "Unable to open phone dialer.");
    }
  };

  const handleLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to share your position.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoords({ lat: latitude, lon: longitude });

      Alert.alert(
        "Location Acquired",
        `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`
      );
    } catch (err) {
      Alert.alert("Error", "Unable to retrieve location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = () => {
    if (!coords) {
      Alert.alert("No Location", "Please fetch your location first.");
      return;
    }
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
    Linking.openURL(url);
  };

  return (
    <View className={`flex-1 items-center justify-center ${bgColor} p-5`}>
      <Text className={`text-3xl font-bold ${textColor} mb-6`}>
        🚨 Emergency Tools
      </Text>

      {/* Emergency Call Button */}
      <TouchableOpacity
        onPress={handleCall}
        className={`w-full py-4 rounded-2xl ${btnColor} mb-4`}
        activeOpacity={0.8}
      >
        <Text className="text-white text-center text-lg font-semibold">
          📞 Call Emergency Services
        </Text>
      </TouchableOpacity>

      {/* Get Location Button */}
      <TouchableOpacity
        onPress={handleLocation}
        disabled={loading}
        className={`w-full py-4 rounded-2xl ${cardColor} mb-4`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-center text-lg font-semibold ${
            isLight ? "text-gray-800" : "text-gray-100"
          }`}
        >
          {loading ? "Fetching Location..." : "📍 Get My Location"}
        </Text>
      </TouchableOpacity>

      {/* Share Location Button */}
      <TouchableOpacity
        onPress={handleShareLocation}
        className={`w-full py-4 rounded-2xl bg-green-600`}
        activeOpacity={0.8}
      >
        <Text className="text-white text-center text-lg font-semibold">
          🌍 Share My Location
        </Text>
      </TouchableOpacity>

      {/* Display fetched coordinates */}
      {coords && (
        <View className="mt-6 p-3 rounded-xl bg-gray-200 dark:bg-gray-800">
          <Text
            className={`text-sm ${isLight ? "text-gray-800" : "text-gray-200"}`}
          >
            Latitude: {coords.lat.toFixed(4)} {"\n"}
            Longitude: {coords.lon.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
}
