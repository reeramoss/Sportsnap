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
import { useAudioRecorder, RecordingPresets, AudioModule } from "expo-audio";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChipSelector } from "../components/ChipSelector";
import { ART_TYPES, MIN_PHOTOS, SPORTS } from "../constants";
import type { ArtType, GraphicRequest, Sport } from "../types";

export function NewRequestScreen() {
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [sport, setSport] = useState<Sport | null>(null);
  const [artType, setArtType] = useState<ArtType | null>(null);
  const [briefText, setBriefText] = useState("");
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  async function pickPhotos() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "We need access to your photos to continue.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setPhotoUris((prev) => [...prev, ...uris].slice(0, 10));
    }
  }

  function removePhoto(uri: string) {
    setPhotoUris((prev) => prev.filter((item) => item !== uri));
  }

  async function toggleRecording() {
    if (isRecording) {
      await audioRecorder.stop();
      setVoiceNoteUri(audioRecorder.uri ?? null);
      setIsRecording(false);
      return;
    }

    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert("Permission needed", "We need microphone access to record your voice note.");
      return;
    }

    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  }

  function handleSubmit() {
    if (photoUris.length < MIN_PHOTOS) {
      Alert.alert("More photos needed", `Please add at least ${MIN_PHOTOS} photos.`);
      return;
    }
    if (!sport) {
      Alert.alert("Pick a sport", "Please select which sport this is for.");
      return;
    }
    if (!artType) {
      Alert.alert("Pick an art type", "Please select the type of graphic you need.");
      return;
    }
    if (!briefText.trim() && !voiceNoteUri) {
      Alert.alert("Add a brief", "Type a few words or record a voice note about what you want.");
      return;
    }

    const request: GraphicRequest = { photoUris, sport, artType, briefText, voiceNoteUri };
    // TODO: send `request` to the backend once Supabase + OpenAI are wired up.
    console.log("Graphic request captured:", request);
    Alert.alert(
      "Request captured!",
      "This is currently just captured locally — generation isn't wired up yet."
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>New Graphic</Text>

        <Text style={styles.label}>
          Photos ({photoUris.length}/{MIN_PHOTOS} minimum)
        </Text>
        <View style={styles.photoGrid}>
          {photoUris.map((uri) => (
            <TouchableOpacity key={uri} onPress={() => removePhoto(uri)} style={styles.photoWrapper}>
              <Image source={{ uri }} style={styles.photo} />
              <View style={styles.removeBadge}>
                <Text style={styles.removeBadgeText}>×</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickPhotos}>
            <Text style={styles.addPhotoText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <ChipSelector label="Sport" options={SPORTS} selected={sport} onSelect={setSport} />
        <ChipSelector
          label="Art type"
          options={ART_TYPES}
          selected={artType}
          onSelect={setArtType}
        />

        <Text style={styles.label}>Describe what you imagine</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Bold red and white, our logo top left, hype energy..."
          multiline
          value={briefText}
          onChangeText={setBriefText}
        />

        <TouchableOpacity
          style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
          onPress={toggleRecording}
        >
          <Text style={[styles.voiceButtonText, isRecording && styles.voiceButtonTextActive]}>
            {isRecording ? "● Stop recording" : "🎤 Record a voice note instead"}
          </Text>
        </TouchableOpacity>
        {voiceNoteUri && !isRecording && (
          <Text style={styles.voiceNoteSaved}>Voice note recorded ✓</Text>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#111" },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 8, color: "#111" },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  photoWrapper: { width: 80, height: 80 },
  photo: { width: 80, height: 80, borderRadius: 10, backgroundColor: "#eee" },
  removeBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBadgeText: { color: "#fff", fontSize: 14, lineHeight: 16 },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: { color: "#666", fontWeight: "600", fontSize: 13 },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 14,
  },
  voiceButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 6,
  },
  voiceButtonActive: { backgroundColor: "#FFEDED", borderColor: "#FF4D4D" },
  voiceButtonText: { fontSize: 15, fontWeight: "600", color: "#333" },
  voiceButtonTextActive: { color: "#D0021B" },
  voiceNoteSaved: { color: "#2E7D32", marginBottom: 14, fontSize: 13 },
  submitButton: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
