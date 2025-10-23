import { View, Text } from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

export default function Chatbot() {
  const { theme } = useAppStore();
  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white" : "bg-gray-900";
  const textColor = isLight ? "text-red-600" : "text-white";

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-2xl font-bold ${textColor} mb-4`}>
        🤖 Chatbot Assistant
      </Text>
      <Text className={`${textColor} text-center px-4`}>
        Ask questions, get first aid guidance, and interact with the AI assistant here.
      </Text>
    </View>
  );
}
