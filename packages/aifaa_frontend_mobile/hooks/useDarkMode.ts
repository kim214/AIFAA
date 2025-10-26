import { useColorScheme } from "react-native";

export function useDarkMode() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return { isDark };
}
