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
import { AppColors, EventColors } from "@/constants/app-colors";
import { AppText } from "@/constants/app-text";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (event: CalendarEvent) => void;
};
const COLORS = EventColors;

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
      calendar: AppText.personal,
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
            <Text style={styles.heading}>{AppText.newEvent}</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Ionicons name="close" size={20} color={AppColors.icon} />
            </Pressable>
          </View>
          <Text style={styles.label}>{AppText.titleLabel}</Text>
          <TextInput
            autoFocus
            value={title}
            onChangeText={setTitle}
            placeholder={AppText.titlePlaceholder}
            placeholderTextColor={AppColors.textDisabled}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          <Text style={styles.label}>{AppText.startTimeLabel}</Text>
          <View style={styles.timeControl}>
            <Pressable
              onPress={() => setStart((value) => Math.max(7, value - 0.25))}
              style={styles.stepButton}
            >
              <Ionicons name="remove" size={20} color={AppColors.primary} />
            </Pressable>
            <Text style={styles.timeText}>{formatDecimalTime(start)}</Text>
            <Pressable
              onPress={() => setStart((value) => Math.min(20, value + 0.25))}
              style={styles.stepButton}
            >
              <Ionicons name="add" size={20} color={AppColors.primary} />
            </Pressable>
          </View>
          <Text style={styles.label}>{AppText.colorLabel}</Text>
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
                <Ionicons name="checkmark" size={16} color={AppColors.white} />
                )}
              </Pressable>
            ))}
          </View>
          <Pressable
            disabled={!title.trim()}
            onPress={submit}
            style={[styles.create, !title.trim() && styles.disabled]}
          >
            <Text style={styles.createText}>{AppText.addToCalendar}</Text>
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
    backgroundColor: AppColors.overlay,
  },
  sheet: {
    backgroundColor: AppColors.surface,
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
    backgroundColor: AppColors.handle,
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  heading: { fontSize: 22, fontWeight: "700", color: AppColors.textStrong },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppColors.surfaceControl,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: AppColors.textMuted,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.surfaceMuted,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AppColors.text,
    marginBottom: 22,
  },
  timeControl: {
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.surfaceMuted,
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
    backgroundColor: AppColors.primaryControl,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: { fontSize: 16, fontWeight: "700", color: AppColors.textStrong },
  colors: { flexDirection: "row", gap: 14, marginBottom: 26 },
  color: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedColor: { borderWidth: 3, borderColor: AppColors.primaryBorder },
  create: {
    height: 52,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  createText: { color: AppColors.white, fontWeight: "700", fontSize: 15 },
});
