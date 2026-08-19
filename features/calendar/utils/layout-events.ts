import type { CalendarEvent, PositionedCalendarEvent } from '../types';

export function layoutOverlappingEvents(events: CalendarEvent[]): PositionedCalendarEvent[] {
  return events.map((event) => {
    const overlaps = events
      .filter((other) => other.start < event.end && other.end > event.start)
      .sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));

    return {
      ...event,
      column: overlaps.findIndex((other) => other.id === event.id),
      columns: overlaps.length,
    };
  });
}
