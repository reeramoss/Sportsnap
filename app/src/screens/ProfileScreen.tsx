import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BrandProfile } from "../types";

const EMPTY_PROFILE: BrandProfile = {
  clubName: "",
  logoUri: null,
  primaryColor: "#111111",
  secondaryColor: "#FFFFFF",
  websiteOrInstagram: "",
};

export function ProfileScreen() {
  const [profile, setProfile] = useState<BrandProfile>(EMPTY_PROFILE);

  async function pickLogo() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "We need access to your photos to set a logo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (!result.canceled) {
      setProfile((prev) => ({ ...prev, logoUri: result.assets[0].uri }));
    }
  }

  function handleAutofill() {
    // TODO: fetch logo/colors from the given website or Instagram URL automatically.
    Alert.alert("Coming soon", "Auto-fill from a website/Instagram link isn't wired up yet — fill in the fields manually for now.");
  }

  function handleSave() {
    if (!profile.clubName.trim()) {
      Alert.alert("Add a name", "Please enter your club or university name.");
      return;
    }
    // TODO: persist `profile` to Supabase once it's wired up.
    console.log("Brand profile saved:", profile);
    Alert.alert("Saved", "This is currently just saved locally — cloud sync isn't wired up yet.");
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Brand Profile</Text>
        <Text style={styles.subtitle}>
          Set this up once — it gets applied to every graphic automatically.
        </Text>

        <TouchableOpacity style={styles.logoPicker} onPress={pickLogo}>
          {profile.logoUri ? (
            <Image source={{ uri: profile.logoUri }} style={styles.logoImage} />
          ) : (
            <Text style={styles.logoPlaceholderText}>+ Add logo</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Club / University name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Lindsey Wilson Blue Raiders"
          value={profile.clubName}
          onChangeText={(text) => setProfile((prev) => ({ ...prev, clubName: text }))}
        />

        <Text style={styles.label}>Website or Instagram</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.textInput, styles.rowInput]}
            placeholder="https://... or @handle"
            autoCapitalize="none"
            value={profile.websiteOrInstagram}
            onChangeText={(text) =>
              setProfile((prev) => ({ ...prev, websiteOrInstagram: text }))
            }
          />
          <TouchableOpacity style={styles.autofillButton} onPress={handleAutofill}>
            <Text style={styles.autofillButtonText}>Auto-fill</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Primary color</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: profile.primaryColor }]} />
          <TextInput
            style={[styles.textInput, styles.colorInput]}
            autoCapitalize="characters"
            value={profile.primaryColor}
            onChangeText={(text) => setProfile((prev) => ({ ...prev, primaryColor: text }))}
          />
        </View>

        <Text style={styles.label}>Secondary color</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: profile.secondaryColor }]} />
          <TextInput
            style={[styles.textInput, styles.colorInput]}
            autoCapitalize="characters"
            value={profile.secondaryColor}
            onChangeText={(text) => setProfile((prev) => ({ ...prev, secondaryColor: text }))}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 8, color: "#111", marginTop: 6 },
  logoPicker: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  logoImage: { width: 96, height: 96 },
  logoPlaceholderText: { color: "#666", fontWeight: "600", fontSize: 13, textAlign: "center" },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
  },
  row: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  rowInput: { flex: 1 },
  autofillButton: {
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  autofillButtonText: { fontWeight: "600", color: "#111", fontSize: 13 },
  colorRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 14,
  },
  colorInput: { flex: 1 },
  saveButton: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
