import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { forwardRef, useCallback, useMemo } from 'react';
import { Animated as ReactNativeAnimated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View, type PanResponderInstance } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { END_HOUR, EVENT_GAP, HOUR_HEIGHT, START_HOUR, TIME_GUTTER } from '../constants';
import type { CalendarEvent, PositionedCalendarEvent } from '../types';
import { formatDecimalTime } from '../utils/date';

type Props = {
  events: PositionedCalendarEvent[];
  dayOffset: number;
  nowPosition: number;
  slideAnimation: ReactNativeAnimated.Value;
  swipeResponder: PanResponderInstance;
  onEventPress: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, start: number, end: number) => void;
  onDragStateChange: (dragging: boolean) => void;
  scrollEnabled: boolean;
};

export const DayTimeline = forwardRef<ScrollView, Props>(function DayTimeline({ events, dayOffset, nowPosition, slideAnimation, swipeResponder, onEventPress, onEventDrop, onDragStateChange, scrollEnabled }, ref) {
  const timelineHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
  return <ReactNativeAnimated.View style={styles.wrapper} {...swipeResponder.panHandlers}>
    <ScrollView ref={ref} scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={{ height: timelineHeight }}>
        {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => {
          const hour = START_HOUR + index;
          return <View key={hour} style={[styles.hourRow, { top: index * HOUR_HEIGHT }]}><Text style={styles.hourLabel}>{hour % 12 || 12} {hour < 12 ? 'AM' : 'PM'}</Text><View style={styles.hourLine} /></View>;
        })}
        <ReactNativeAnimated.View style={[styles.eventsLayer, { transform: [{ translateX: slideAnimation }] }]}>
          {events.map((event) => <EventCard key={event.id} event={event} onPress={onEventPress} onDrop={onEventDrop} onDragStateChange={onDragStateChange} />)}
          {dayOffset === 0 && nowPosition >= 0 && nowPosition <= timelineHeight && <View style={[styles.now, { top: nowPosition }]}><View style={styles.nowDot} /><View style={styles.nowLine} /></View>}
          {events.length === 0 && <EmptyDay />}
        </ReactNativeAnimated.View>
      </View>
    </ScrollView>
  </ReactNativeAnimated.View>;
});

type EventCardProps = {
  event: PositionedCalendarEvent;
  onPress: (event: CalendarEvent) => void;
  onDrop: (eventId: string, start: number, end: number) => void;
  onDragStateChange: (dragging: boolean) => void;
};

function EventCard({ event, onPress, onDrop, onDragStateChange }: EventCardProps) {
  const availableWidth = Dimensions.get('window').width - TIME_GUTTER - 24;
  const width = (availableWidth - EVENT_GAP * (event.columns - 1)) / event.columns;
  const dragY = useSharedValue(0);
  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
    opacity: dragY.value === 0 ? 1 : 0.92,
    zIndex: dragY.value === 0 ? 2 : 20,
  }));

  const beginDrag = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDragStateChange(true);
  }, [onDragStateChange]);

  const finishDrag = useCallback((translationY: number) => {
    const duration = event.end - event.start;
    const delta = Math.round((translationY / HOUR_HEIGHT) * 4) / 4;
    const nextStart = Math.min(END_HOUR - duration, Math.max(START_HOUR, event.start + delta));
    onDrop(event.id, nextStart, nextStart + duration);
  }, [event, onDrop]);

  const dragGesture = useMemo(() => Gesture.Pan()
    .activateAfterLongPress(220)
    .failOffsetX([-16, 16])
    .onStart(() => { runOnJS(beginDrag)(); })
    .onUpdate((gesture) => { dragY.value = gesture.translationY; })
    .onEnd((gesture) => { runOnJS(finishDrag)(gesture.translationY); })
    .onFinalize(() => {
      dragY.value = withSpring(0, { damping: 18, stiffness: 220 });
      runOnJS(onDragStateChange)(false);
    }), [beginDrag, dragY, finishDrag, onDragStateChange]);

  return <GestureDetector gesture={dragGesture}><Animated.View style={[styles.card, {
    top: (event.start - START_HOUR) * HOUR_HEIGHT + 2,
    height: Math.max(42, (event.end - event.start) * HOUR_HEIGHT - 4),
    left: event.column * (width + EVENT_GAP), width,
    backgroundColor: `${event.color}18`, borderLeftColor: event.color,
  }, dragStyle]}>
    <Pressable onPress={() => onPress(event)} style={styles.cardContent}>
    <Text numberOfLines={1} style={[styles.eventTitle, event.completed && styles.completed]}>{event.completed ? '✓  ' : ''}{event.title}</Text>
    <Text style={styles.eventTime}>{formatDecimalTime(event.start)}</Text>
    {event.end - event.start > 1 && event.location && <Text numberOfLines={1} style={styles.eventLocation}>{event.location}</Text>}
    </Pressable>
  </Animated.View></GestureDetector>;
}

function EmptyDay() {
  return <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="sparkles-outline" size={24} color="#6758D9" /></View><Text style={styles.emptyTitle}>A clear day</Text><Text style={styles.emptyBody}>Nothing scheduled. Make space for something good.</Text></View>;
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, overflow: 'hidden' }, scrollContent: { paddingTop: 8, paddingBottom: 80 },
  hourRow: { position: 'absolute', left: 0, right: 0, height: HOUR_HEIGHT, flexDirection: 'row' },
  hourLabel: { width: TIME_GUTTER - 7, textAlign: 'right', fontSize: 10, color: '#999BA1', transform: [{ translateY: -6 }] },
  hourLine: { marginLeft: 8, flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#DFDDD8' },
  eventsLayer: { position: 'absolute', left: TIME_GUTTER + 8, right: 16, top: 0, bottom: 0 },
  card: { position: 'absolute', borderLeftWidth: 3, borderRadius: 8, overflow: 'hidden', zIndex: 2 },
  cardContent: { flex: 1, paddingVertical: 6, paddingHorizontal: 8 },
  eventTitle: { color: '#25272D', fontSize: 12, fontWeight: '700', lineHeight: 16 },
  eventTime: { color: '#696C73', fontSize: 10, marginTop: 2 }, eventLocation: { color: '#777A82', fontSize: 10, marginTop: 5 },
  completed: { textDecorationLine: 'line-through', color: '#75777D' },
  now: { position: 'absolute', left: -8, right: 0, height: 8, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  nowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F04D4D' }, nowLine: { height: 1.5, flex: 1, backgroundColor: '#F04D4D' },
  empty: { marginTop: 130, alignItems: 'center', paddingHorizontal: 44 },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EFECFC', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#2A2C32' }, emptyBody: { fontSize: 13, color: '#85878E', textAlign: 'center', lineHeight: 19, marginTop: 5 },
});
