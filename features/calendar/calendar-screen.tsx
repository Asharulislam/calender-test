import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarHeader } from './components/calendar-header';
import { DayTimeline } from './components/day-timeline';
import { EventDetailsSheet } from './components/event-details-sheet';
import { WeekStrip } from './components/week-strip';
import { HOUR_HEIGHT, START_HOUR } from './constants';
import { MOCK_EVENTS_BY_DAY } from './data/mock-events';
import { styles } from './calendar-screen.styles';
import type { CalendarEvent } from './types';
import { dateAtDayOffset } from './utils/date';
import { layoutOverlappingEvents } from './utils/layout-events';

export function CalendarScreen() {
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const date = dateAtDayOffset(dayOffset);
  const events = useMemo(() => layoutOverlappingEvents(MOCK_EVENTS_BY_DAY[dayOffset] ?? []), [dayOffset]);
  const now = new Date();
  const nowPosition = (now.getHours() + now.getMinutes() / 60 - START_HOUR) * HOUR_HEIGHT;

  const changeDay = useCallback((delta: number) => {
    Haptics.selectionAsync();
    Animated.timing(slideAnimation, { toValue: delta > 0 ? -18 : 18, duration: 100, useNativeDriver: true }).start(() => {
      setDayOffset((current) => current + delta);
      slideAnimation.setValue(delta > 0 ? 18 : -18);
      Animated.spring(slideAnimation, { toValue: 0, useNativeDriver: true, speed: 24, bounciness: 2 }).start();
    });
  }, [slideAnimation]);

  const swipeResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 18 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
    onPanResponderRelease: (_, gesture) => Math.abs(gesture.dx) > 65 && changeDay(gesture.dx < 0 ? 1 : -1),
  }), [changeDay]);

  const goToday = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDayOffset(0);
    scrollRef.current?.scrollTo({ y: Math.max(0, nowPosition - 180), animated: true });
  };

  const selectEvent = (event: CalendarEvent) => {
    Haptics.selectionAsync();
    setSelectedEvent(event);
  };

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <CalendarHeader date={date} showToday={dayOffset !== 0} onTodayPress={goToday} />
    <WeekStrip dayOffset={dayOffset} onChangeDay={changeDay} />
    <DayTimeline ref={scrollRef} events={events} dayOffset={dayOffset} nowPosition={nowPosition} slideAnimation={slideAnimation} swipeResponder={swipeResponder} onEventPress={selectEvent} />
    <Pressable style={styles.addButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}><Ionicons name="add" size={30} color="white" /></Pressable>
    <EventDetailsSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
  </SafeAreaView>;
}
