import { useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function EmergencyButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/tabs/chatbot")}
      className="w-24 h-24 rounded-full bg-red-600 justify-center items-center shadow-lg"
      activeOpacity={0.8}
    >
      <Text className="text-white font-bold text-lg">HELP</Text>
    </TouchableOpacity>
  );
}
