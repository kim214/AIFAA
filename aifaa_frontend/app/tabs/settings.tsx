import { View, Text, Button } from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

export default function Settings() {
  const { theme, toggleTheme } = useAppStore();
  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white" : "bg-gray-900";
  const textColor = isLight ? "text-red-600" : "text-white";

  return (
    <View className={`flex-1 items-center justify-center ${bgColor} p-4`}>
      <Text className={`text-2xl font-bold ${textColor} mb-6`}>
        ⚙️ Settings
      </Text>

      <Button
        title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
        onPress={toggleTheme}
        color={isLight ? "#111827" : "#E5E7EB"}
      />
    </View>
  );
}
