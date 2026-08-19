import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MONTHS } from '../constants';

type Props = { date: Date; showToday: boolean; onTodayPress: () => void };

export function CalendarHeader({ date, showToday, onTodayPress }: Props) {
  return <View style={styles.header}>
    <View>
      <Text style={styles.year}>{date.getFullYear()}</Text>
      <View style={styles.monthRow}><Text style={styles.month}>{MONTHS[date.getMonth()]}</Text><Ionicons name="chevron-down" size={18} color="#22252C" /></View>
    </View>
    <View style={styles.actions}>
      {showToday && <Pressable onPress={onTodayPress} style={styles.todayButton}><Text style={styles.todayText}>Today</Text></Pressable>}
      <Pressable style={styles.iconButton}><Ionicons name="search" size={21} color="#272A31" /></Pressable>
      <Pressable style={styles.avatar}><Text style={styles.avatarText}>AK</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  header: { height: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  year: { fontSize: 11, color: '#8B8E96', fontWeight: '700', letterSpacing: 1.1 },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  month: { fontSize: 26, color: '#202229', fontWeight: '700', letterSpacing: -0.8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0EEEA' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DFDBFA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#594AB9', fontWeight: '800', fontSize: 12 },
  todayButton: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 16, backgroundColor: '#EFECFC' },
  todayText: { color: '#5D4DC4', fontWeight: '700', fontSize: 12 },
});
