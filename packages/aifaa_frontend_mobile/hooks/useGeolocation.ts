import * as Location from "expo-location";
import { useState } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return { location, error, requestLocation };
}
