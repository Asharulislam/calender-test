import type { CalendarEvent } from '../types';

export const MOCK_EVENTS_BY_DAY: Record<number, CalendarEvent[]> = {
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
