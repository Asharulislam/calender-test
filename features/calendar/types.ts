export type CalendarEvent = {
  id: string;
  title: string;
  start: number;
  end: number;
  color: string;
  calendar: string;
  location?: string;
  completed?: boolean;
};

export type PositionedCalendarEvent = CalendarEvent & {
  column: number;
  columns: number;
};
