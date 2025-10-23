/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ Scan all folders that may contain Tailwind/NativeWind classes
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  // ✅ Use the NativeWind preset for React Native compatibility
  presets: [require("nativewind/preset")],

  // ✅ Enable class-based dark mode (works with Zustand + NativeWind)
  darkMode: "class",

  theme: {
    extend: {
      // Optional: add your custom color palette or fonts later here
      colors: {
        primary: "#2563eb", // Tailwind blue-600
        secondary: "#1e3a8a", // Darker blue for dark mode
      },
    },
  },

  plugins: [],
};
