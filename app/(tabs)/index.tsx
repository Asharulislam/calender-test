import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Event = { id: string; title: string; start: number; end: number; color: string; calendar: string; location?: string; completed?: boolean };
const HOUR_HEIGHT = 72, START_HOUR = 7, END_HOUR = 21, GUTTER = 54;
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EVENT_DATA: Record<number, Event[]> = {
  0: [
    { id: '1', title: 'Product stand-up', start: 9, end: 9.75, color: '#6758D9', calendar: 'Work', location: 'Google Meet' },
    { id: '2', title: 'Design review', start: 10.25, end: 11.75, color: '#EE7065', calendar: 'Work', location: 'Studio room' },
    { id: '3', title: 'Coffee with Sarah', start: 10.75, end: 12, color: '#DB8A35', calendar: 'Personal', location: 'Coffee Lab' },
    { id: '4', title: 'Deep work', start: 13, end: 15, color: '#348A78', calendar: 'Focus', completed: true },
    { id: '5', title: 'Evening run', start: 18, end: 19, color: '#3782D2', calendar: 'Wellness', location: 'Canal trail' },
  ],
  1: [
    { id: '6', title: 'Client kickoff', start: 9.5, end: 11, color: '#6758D9', calendar: 'Work', location: 'Zoom' },
    { id: '7', title: 'Lunch', start: 12.5, end: 13.5, color: '#DB8A35', calendar: 'Personal' },
    { id: '8', title: 'Mobile interaction audit', start: 15, end: 17, color: '#348A78', calendar: 'Focus' },
  ],
  [-1]: [
    { id: '9', title: 'Weekly planning', start: 8.5, end: 10, color: '#6758D9', calendar: 'Work' },
    { id: '10', title: 'Dentist', start: 14, end: 15, color: '#EE7065', calendar: 'Personal', location: 'City Dental' },
  ],
};

function dateAt(offset: number) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
function time(value: number) { const h = Math.floor(value), m = Math.round((value - h) * 60); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; }
function layout(events: Event[]) {
  return events.map(event => {
    const overlaps = events.filter(other => other.start < event.end && other.end > event.start).sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));
    return { ...event, column: overlaps.findIndex(other => other.id === event.id), columns: overlaps.length };
  });
}

export default function CalendarScreen() {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<Event | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const slide = useRef(new Animated.Value(0)).current;
  const date = dateAt(offset), events = useMemo(() => layout(EVENT_DATA[offset] ?? []), [offset]);
  const now = new Date(), nowY = (now.getHours() + now.getMinutes() / 60 - START_HOUR) * HOUR_HEIGHT;

  const changeDay = useCallback((delta: number) => {
    Haptics.selectionAsync();
    Animated.timing(slide, { toValue: delta > 0 ? -18 : 18, duration: 100, useNativeDriver: true }).start(() => {
      setOffset(value => value + delta); slide.setValue(delta > 0 ? 18 : -18);
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 24, bounciness: 2 }).start();
    });
  }, [slide]);
  const swipe = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 18 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
    onPanResponderRelease: (_, g) => Math.abs(g.dx) > 65 && changeDay(g.dx < 0 ? 1 : -1),
  }), [changeDay]);
  const goToday = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setOffset(0); scrollRef.current?.scrollTo({ y: Math.max(0, nowY - 180), animated: true }); };

  return <SafeAreaView style={s.safe} edges={['top']}>
    <View style={s.header}>
      <View><Text style={s.year}>{date.getFullYear()}</Text><View style={s.monthRow}><Text style={s.month}>{MONTHS[date.getMonth()]}</Text><Ionicons name="chevron-down" size={18} color="#22252C" /></View></View>
      <View style={s.actions}>
        {offset !== 0 && <Pressable onPress={goToday} style={s.todayButton}><Text style={s.todayText}>Today</Text></Pressable>}
        <Pressable style={s.iconButton}><Ionicons name="search" size={21} color="#272A31" /></Pressable>
        <Pressable style={s.avatar}><Text style={s.avatarText}>AK</Text></Pressable>
      </View>
    </View>
    <View style={s.week}>
      {[-3, -2, -1, 0, 1, 2, 3].map(relative => { const item = dateAt(offset + relative), active = relative === 0, today = offset + relative === 0; return <Pressable key={relative} onPress={() => relative !== 0 && changeDay(relative)} style={s.day}>
        <Text style={[s.weekday, active && s.activeText]}>{DAYS[item.getDay()]}</Text><View style={[s.dateCircle, active && s.activeCircle]}><Text style={[s.dateNumber, active && s.activeNumber]}>{item.getDate()}</Text></View>{today && !active && <View style={s.todayDot} />}
      </Pressable>; })}
    </View>
    <Animated.View style={s.timeline} {...swipe.panHandlers}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <View style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => <View key={i} style={[s.hourRow, { top: i * HOUR_HEIGHT }]}><Text style={s.hourLabel}>{(START_HOUR + i) % 12 || 12} {START_HOUR + i < 12 ? 'AM' : 'PM'}</Text><View style={s.hourLine} /></View>)}
          <Animated.View style={[s.events, { transform: [{ translateX: slide }] }]}>
            {events.map(event => { const total = Dimensions.get('window').width - GUTTER - 24, gap = 5, width = (total - gap * (event.columns - 1)) / event.columns; return <Pressable key={event.id} onPress={() => { Haptics.selectionAsync(); setSelected(event); }} style={[s.card, { top: (event.start - START_HOUR) * HOUR_HEIGHT + 2, height: Math.max(42, (event.end - event.start) * HOUR_HEIGHT - 4), left: event.column * (width + gap), width, backgroundColor: `${event.color}18`, borderLeftColor: event.color }]}>
              <Text numberOfLines={1} style={[s.eventTitle, event.completed && s.completed]}>{event.completed ? '✓  ' : ''}{event.title}</Text><Text style={s.eventTime}>{time(event.start)}</Text>{event.end - event.start > 1 && event.location && <Text numberOfLines={1} style={s.eventLocation}>{event.location}</Text>}
            </Pressable>; })}
            {offset === 0 && nowY >= 0 && nowY <= (END_HOUR - START_HOUR) * HOUR_HEIGHT && <View style={[s.now, { top: nowY }]}><View style={s.nowDot} /><View style={s.nowLine} /></View>}
            {!events.length && <View style={s.empty}><View style={s.emptyIcon}><Ionicons name="sparkles-outline" size={24} color="#6758D9" /></View><Text style={s.emptyTitle}>A clear day</Text><Text style={s.emptyBody}>Nothing scheduled. Make space for something good.</Text></View>}
          </Animated.View>
        </View>
      </ScrollView>
    </Animated.View>
    <Pressable style={s.add} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}><Ionicons name="add" size={30} color="white" /></Pressable>
    <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
      <Pressable style={s.backdrop} onPress={() => setSelected(null)} /><View style={s.sheet}><View style={s.handle} />
        <View style={s.sheetHeader}><View style={[s.colorDot, { backgroundColor: selected?.color }]} /><View style={{ flex: 1 }}><Text style={s.sheetTitle}>{selected?.title}</Text><Text style={s.sheetCalendar}>{selected?.calendar} calendar</Text></View><Pressable onPress={() => setSelected(null)} style={s.close}><Ionicons name="close" size={20} color="#555A64" /></Pressable></View>
        <View style={s.detail}><Ionicons name="time-outline" size={21} color="#666B75" /><Text style={s.detailText}>{selected && `${time(selected.start)} – ${time(selected.end)}`}</Text></View>
        {selected?.location && <View style={s.detail}><Ionicons name="location-outline" size={21} color="#666B75" /><Text style={s.detailText}>{selected.location}</Text></View>}
        <Pressable style={s.complete} onPress={() => setSelected(null)}><Ionicons name="checkmark-circle-outline" size={20} color="white" /><Text style={s.completeText}>{selected?.completed ? 'Completed' : 'Mark as complete'}</Text></Pressable>
      </View>
    </Modal>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF9F7' }, header: { height: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  year: { fontSize: 11, color: '#8B8E96', fontWeight: '700', letterSpacing: 1.1 }, monthRow: { flexDirection: 'row', alignItems: 'center', gap: 4 }, month: { fontSize: 26, color: '#202229', fontWeight: '700', letterSpacing: -0.8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 9 }, iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0EEEA' }, avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DFDBFA', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#594AB9', fontWeight: '800', fontSize: 12 }, todayButton: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 16, backgroundColor: '#EFECFC' }, todayText: { color: '#5D4DC4', fontWeight: '700', fontSize: 12 },
  week: { height: 78, flexDirection: 'row', paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DDDBD6' }, day: { flex: 1, alignItems: 'center', paddingTop: 7 }, weekday: { fontSize: 10, fontWeight: '700', color: '#9B9CA2', marginBottom: 6 }, activeText: { color: '#6758D9' }, dateCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, activeCircle: { backgroundColor: '#6758D9', shadowColor: '#6758D9', shadowOpacity: .25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }, dateNumber: { fontSize: 16, fontWeight: '600', color: '#595B62' }, activeNumber: { color: '#FFF' }, todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#6758D9', marginTop: 2 },
  timeline: { flex: 1, overflow: 'hidden' }, scrollContent: { paddingTop: 8, paddingBottom: 80 }, hourRow: { position: 'absolute', left: 0, right: 0, height: HOUR_HEIGHT, flexDirection: 'row' }, hourLabel: { width: GUTTER - 7, textAlign: 'right', fontSize: 10, color: '#999BA1', transform: [{ translateY: -6 }] }, hourLine: { marginLeft: 8, flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#DFDDD8' }, events: { position: 'absolute', left: GUTTER + 8, right: 16, top: 0, bottom: 0 },
  card: { position: 'absolute', borderLeftWidth: 3, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, overflow: 'hidden' }, eventTitle: { color: '#25272D', fontSize: 12, fontWeight: '700', lineHeight: 16 }, eventTime: { color: '#696C73', fontSize: 10, marginTop: 2 }, eventLocation: { color: '#777A82', fontSize: 10, marginTop: 5 }, completed: { textDecorationLine: 'line-through', color: '#75777D' },
  now: { position: 'absolute', left: -8, right: 0, height: 8, flexDirection: 'row', alignItems: 'center', zIndex: 10 }, nowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F04D4D' }, nowLine: { height: 1.5, flex: 1, backgroundColor: '#F04D4D' }, empty: { marginTop: 130, alignItems: 'center', paddingHorizontal: 44 }, emptyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EFECFC', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, emptyTitle: { fontSize: 17, fontWeight: '700', color: '#2A2C32' }, emptyBody: { fontSize: 13, color: '#85878E', textAlign: 'center', lineHeight: 19, marginTop: 5 },
  add: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 18, backgroundColor: '#6758D9', alignItems: 'center', justifyContent: 'center', shadowColor: '#342A82', shadowOpacity: .3, shadowRadius: 12, shadowOffset: { width: 0, height: 7 }, elevation: 6 }, backdrop: { flex: 1, backgroundColor: 'rgba(26,27,31,.28)' }, sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 38 }, handle: { alignSelf: 'center', width: 38, height: 5, borderRadius: 3, backgroundColor: '#DEDFE3', marginBottom: 23 }, sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 }, colorDot: { width: 12, height: 12, borderRadius: 4, marginTop: 6, marginRight: 12 }, sheetTitle: { fontSize: 21, fontWeight: '700', color: '#22242A' }, sheetCalendar: { fontSize: 12, color: '#8B8E96', marginTop: 4 }, close: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F2F1EF', alignItems: 'center', justifyContent: 'center' }, detail: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 17 }, detailText: { color: '#4B4E56', fontSize: 15 }, complete: { marginTop: 10, height: 52, borderRadius: 16, backgroundColor: '#6758D9', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }, completeText: { color: 'white', fontSize: 15, fontWeight: '700' },
});
