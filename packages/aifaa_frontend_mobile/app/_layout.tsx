import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="library" />
        <Stack.Screen name="emergency" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="language" />
      </Stack>
    </SafeAreaView>
  );
}
