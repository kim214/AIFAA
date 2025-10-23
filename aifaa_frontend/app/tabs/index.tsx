import { View, Text, Button } from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

export default function Home() {
  const { theme, userName, setUserName, toggleTheme } = useAppStore();

  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white" : "bg-gray-900";
  const textColor = isLight ? "text-blue-600" : "text-white";

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-2xl font-bold ${textColor} mb-4`}>
        {userName ? `Hey ${userName} 👋` : "🏠 FirstAidAI Home"}
      </Text>

      <View className="mb-3">
        <Button
          title={userName ? "Change Username" : "Set Username"}
          onPress={() => setUserName("Nathan")}
          color={isLight ? "#007BFF" : "#4F46E5"}
        />
      </View>

      <View className="mb-3">
        <Button
          title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
          onPress={toggleTheme}
          color={isLight ? "#111827" : "#E5E7EB"}
        />
      </View>

      <Text className={`mt-5 ${textColor} text-center`}>
        Use the bottom navigation bar to access Chatbot, Library, Emergency, or Settings.
      </Text>
    </View>
  );
}
