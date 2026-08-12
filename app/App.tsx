import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NewRequestScreen } from "./src/screens/NewRequestScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

type Tab = "new" | "profile";

export default function App() {
  const [tab, setTab] = useState<Tab>("new");

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.screen}>
          {tab === "new" ? <NewRequestScreen /> : <ProfileScreen />}
        </View>
        <SafeAreaView edges={["bottom"]} style={styles.tabBar}>
          <TouchableOpacity style={styles.tabButton} onPress={() => setTab("new")}>
            <Text style={[styles.tabLabel, tab === "new" && styles.tabLabelActive]}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={() => setTab("profile")}>
            <Text style={[styles.tabLabel, tab === "profile" && styles.tabLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabLabel: { fontSize: 14, fontWeight: "600", color: "#999" },
  tabLabelActive: { color: "#111" },
});
