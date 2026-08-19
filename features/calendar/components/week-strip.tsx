import { Pressable, StyleSheet, Text, View } from "react-native";

import { WEEKDAYS } from "../constants";
import { dateAtDayOffset } from "../utils/date";

type Props = { dayOffset: number; onChangeDay: (delta: number) => void };
const VISIBLE_DAY_OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

export function WeekStrip({ dayOffset, onChangeDay }: Props) {
  return (
    <View style={styles.week}>
      {VISIBLE_DAY_OFFSETS.map((relative) => {
        const date = dateAtDayOffset(dayOffset + relative);
        const active = relative === 0;
        const today = dayOffset + relative === 0;
        return (
          <Pressable
            key={relative}
            onPress={() => !active && onChangeDay(relative)}
            style={styles.day}
          >
            <Text style={[styles.weekday, active && styles.activeText]}>
              {WEEKDAYS[date.getDay()]}
            </Text>
            <View style={[styles.dateCircle, active && styles.activeCircle]}>
              <Text style={[styles.dateNumber, active && styles.activeNumber]}>
                {date.getDate()}
              </Text>
            </View>
            {today && !active && <View style={styles.todayDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  week: {
    height: 78,
    flexDirection: "row",
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDDBD6",
  },
  day: { flex: 1, alignItems: "center", paddingTop: 7 },
  weekday: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9B9CA2",
    marginBottom: 6,
  },
  activeText: { color: "#6758D9" },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    backgroundColor: "#6758D9",
    shadowColor: "#6758D9",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dateNumber: { fontSize: 16, fontWeight: "600", color: "#595B62" },
  activeNumber: { color: "#FFF" },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6758D9",
    marginTop: 2,
  },
});
