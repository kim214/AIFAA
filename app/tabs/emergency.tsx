import { View, Text, Button, Linking } from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

export default function Emergency() {
  const { theme } = useAppStore();
  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white" : "bg-gray-900";
  const textColor = isLight ? "text-red-600" : "text-white";

  return (
    <View className={`flex-1 items-center justify-center ${bgColor} p-4`}>
      <Text className={`text-2xl font-bold ${textColor} mb-6`}>
        🚨 Emergency Tools
      </Text>

      <Button
        title="Call Emergency Services"
        color={isLight ? "#ff4d4d" : "#fff"}
        onPress={() => Linking.openURL("tel:911")}
      />
    </View>
  );
}
