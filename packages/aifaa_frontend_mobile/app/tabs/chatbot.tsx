import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Message {
  id: string;
  text: string;
  type: "user" | "bot";
}

export default function Chatbot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setBotTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `🤖 First Aid Assistant: "${userMessage.text}"`,
        type: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      setBotTyping(false);
    }, 1200);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, botTyping]);

  return (
    <LinearGradient
      colors={["#f9fafb", "#e0f7fa"]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#1f2937" />
        </TouchableOpacity>

        <Image
          source={require("../../src/assets/aifaa_logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => router.push("/tabs")}>
          <Ionicons name="home-outline" size={28} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Keyboard Avoiding View */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 15 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && (
              <View style={styles.welcomeContainer}>
                <Image
                  source={require("../../src/assets/aifaa_logo.png")}
                  style={styles.welcomeIcon}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeTitle}>First Aid Assistant Ready</Text>
                <Text style={styles.welcomeSubtitle}>
                  Describe the emergency and I'll guide you through the right steps
                </Text>
              </View>
            )}

            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.type === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.type === "user" ? styles.userText : styles.botText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}

            {botTyping && (
              <View style={[styles.messageBubble, styles.botBubble]}>
                <ActivityIndicator size="small" color="#0bc5ea" />
                <Text style={[styles.messageText, styles.botText]}>Bot is typing...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.micButton}>
                <Ionicons name="mic-outline" size={24} color="#1f2937" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderColor: "#e5e7eb",
    zIndex: 10,
  },
  logoImage: { width: 60, height: 60 },
  messagesContainer: { flex: 1, marginTop: 100 },
  welcomeContainer: { alignItems: "center", justifyContent: "center", marginTop: 50 },
  welcomeIcon: { width: 80, height: 80, marginBottom: 15 },
  welcomeTitle: { fontSize: 20, fontWeight: "700", color: "#ef4444", marginBottom: 8 },
  welcomeSubtitle: { fontSize: 15, color: "#374151", textAlign: "center", lineHeight: 20, paddingHorizontal: 10 },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 14,
    marginVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  userBubble: {
    backgroundColor: "#ef4444",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "#fff" },
  botText: { color: "#111827", marginLeft: 5 },
  inputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 35,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  micButton: { padding: 10 },
  input: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: "#0bc5ea",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
