import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function FeatureCard({ title, link }: { title: string; link: `/tabs/${string}` | string }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(link as any)}
      className="w-[47%] h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-4"
    >
      <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
