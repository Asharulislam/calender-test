import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { CalendarEvent } from "../types";
import { formatDecimalTime } from "../utils/date";

type Props = { event: CalendarEvent | null; onClose: () => void };

export function EventDetailsSheet({ event, onClose }: Props) {
  return (
    <Modal
      visible={event !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={[styles.colorDot, { backgroundColor: event?.color }]} />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{event?.title}</Text>
            <Text style={styles.calendar}>{event?.calendar} calendar</Text>
          </View>
          <Pressable onPress={onClose} style={styles.close}>
            <Ionicons name="close" size={20} color="#555A64" />
          </Pressable>
        </View>
        <View style={styles.detail}>
          <Ionicons name="time-outline" size={21} color="#666B75" />
          <Text style={styles.detailText}>
            {event &&
              `${formatDecimalTime(event.start)} – ${formatDecimalTime(event.end)}`}
          </Text>
        </View>
        {event?.location && (
          <View style={styles.detail}>
            <Ionicons name="location-outline" size={21} color="#666B75" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        )}
        <Pressable style={styles.complete} onPress={onClose}>
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.completeText}>
            {event?.completed ? "Completed" : "Mark as complete"}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(26,27,31,0.28)" },
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
    marginBottom: 23,
  },
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  titleBlock: { flex: 1 },
  title: { fontSize: 21, fontWeight: "700", color: "#22242A" },
  calendar: { fontSize: 12, color: "#8B8E96", marginTop: 4 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F1EF",
    alignItems: "center",
    justifyContent: "center",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 17,
  },
  detailText: { color: "#4B4E56", fontSize: 15 },
  complete: {
    marginTop: 10,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#6758D9",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  completeText: { color: "white", fontSize: 15, fontWeight: "700" },
});
