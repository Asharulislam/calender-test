import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { CalendarEvent } from "../types";
import { formatDecimalTime } from "../utils/date";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (event: CalendarEvent) => void;
};
const COLORS = ["#6758D9", "#EE7065", "#DB8A35", "#348A78", "#3782D2"];

export function CreateEventSheet({ visible, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(10);
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (visible) {
      setTitle("");
      setStart(10);
      setColor(COLORS[0]);
    }
  }, [visible]);

  const submit = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    onCreate({
      id: `local-${Date.now()}`,
      title: cleanTitle,
      start,
      end: start + 1,
      color,
      calendar: "Personal",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.heading}>New event</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Ionicons name="close" size={20} color="#555A64" />
            </Pressable>
          </View>
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            autoFocus
            value={title}
            onChangeText={setTitle}
            placeholder="What are you planning?"
            placeholderTextColor="#A1A3AA"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          <Text style={styles.label}>START TIME</Text>
          <View style={styles.timeControl}>
            <Pressable
              onPress={() => setStart((value) => Math.max(7, value - 0.25))}
              style={styles.stepButton}
            >
              <Ionicons name="remove" size={20} color="#6758D9" />
            </Pressable>
            <Text style={styles.timeText}>{formatDecimalTime(start)}</Text>
            <Pressable
              onPress={() => setStart((value) => Math.min(20, value + 0.25))}
              style={styles.stepButton}
            >
              <Ionicons name="add" size={20} color="#6758D9" />
            </Pressable>
          </View>
          <Text style={styles.label}>COLOR</Text>
          <View style={styles.colors}>
            {COLORS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setColor(item)}
                style={[
                  styles.color,
                  { backgroundColor: item },
                  color === item && styles.selectedColor,
                ]}
              >
                {color === item && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </Pressable>
            ))}
          </View>
          <Pressable
            disabled={!title.trim()}
            onPress={submit}
            style={[styles.create, !title.trim() && styles.disabled]}
          >
            <Text style={styles.createText}>Add to calendar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,27,31,0.28)",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 38,
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DEDFE3",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  heading: { fontSize: 22, fontWeight: "700", color: "#22242A" },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F1EF",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#92949B",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F5F4F2",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#25272D",
    marginBottom: 22,
  },
  timeControl: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F5F4F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 22,
  },
  stepButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E9E5FA",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: { fontSize: 16, fontWeight: "700", color: "#35373E" },
  colors: { flexDirection: "row", gap: 14, marginBottom: 26 },
  color: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedColor: { borderWidth: 3, borderColor: "#E8E5F9" },
  create: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#6758D9",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  createText: { color: "white", fontWeight: "700", fontSize: 15 },
});
