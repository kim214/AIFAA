import { View, Text, ScrollView } from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

export default function Library() {
  const { theme } = useAppStore();
  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white" : "bg-gray-900";
  const textColor = isLight ? "text-red-600" : "text-white";

  return (
    <ScrollView className={`flex-1 ${bgColor} p-4`}>
      <Text className={`text-2xl font-bold ${textColor} mb-4`}>📚 First Aid Library</Text>
      <Text className={`${textColor} mb-2`}>
        • How to treat burns
      </Text>
      <Text className={`${textColor} mb-2`}>
        • CPR steps
      </Text>
      <Text className={`${textColor} mb-2`}>
        • Handling fractures
      </Text>
      <Text className={`${textColor} mb-2`}>
        • Bleeding control
      </Text>
      <Text className={`${textColor} mb-2`}>
        • Common first aid procedures
      </Text>
    </ScrollView>
  );
}
