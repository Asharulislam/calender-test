import { AppColors } from "@/constants/app-colors";
import { AppText } from "@/constants/app-text";
import type { CalendarEvent } from "../types";

export const MOCK_EVENTS_BY_DAY: Record<number, CalendarEvent[]> = {
  0: [
    {
      id: "1",
      title: AppText.events.productStandup,
      start: 9,
      end: 9.75,
      color: AppColors.event.purple,
      calendar: AppText.work,
      location: AppText.locations.googleMeet,
    },
    {
      id: "2",
      title: AppText.events.designReview,
      start: 10.25,
      end: 11.75,
      color: AppColors.event.coral,
      calendar: AppText.work,
      location: AppText.locations.studioRoom,
    },
    {
      id: "3",
      title: AppText.events.coffeeSarah,
      start: 10.75,
      end: 12,
      color: AppColors.event.orange,
      calendar: AppText.personal,
      location: AppText.locations.coffeeLab,
    },
    {
      id: "4",
      title: AppText.events.deepWork,
      start: 13,
      end: 15,
      color: AppColors.event.green,
      calendar: AppText.focus,
      completed: true,
    },
    {
      id: "5",
      title: AppText.events.eveningRun,
      start: 18,
      end: 19,
      color: AppColors.event.blue,
      calendar: AppText.wellness,
      location: AppText.locations.canalTrail,
    },
  ],
  1: [
    {
      id: "6",
      title: AppText.events.clientKickoff,
      start: 9.5,
      end: 11,
      color: AppColors.event.purple,
      calendar: AppText.work,
      location: AppText.locations.zoom,
    },
    {
      id: "7",
      title: AppText.events.lunch,
      start: 12.5,
      end: 13.5,
      color: AppColors.event.orange,
      calendar: AppText.personal,
    },
    {
      id: "8",
      title: AppText.events.interactionAudit,
      start: 15,
      end: 17,
      color: AppColors.event.green,
      calendar: AppText.focus,
    },
  ],
  [-1]: [
    {
      id: "9",
      title: AppText.events.weeklyPlanning,
      start: 8.5,
      end: 10,
      color: AppColors.event.purple,
      calendar: AppText.work,
    },
    {
      id: "10",
      title: AppText.events.dentist,
      start: 14,
      end: 15,
      color: AppColors.event.coral,
      calendar: AppText.personal,
      location: AppText.locations.cityDental,
    },
  ],
};
