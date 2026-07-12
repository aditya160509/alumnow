"use client";
import { useMemo } from "react";

type Slot = { time: string; date: Date };
type Availability = { id: string; dayOfWeek: number | null; specificDate: Date | string | null; startTime: string; endTime: string; isRecurring: boolean };
type BookedSlot = { scheduledStartAt: Date | string; scheduledEndAt: Date | string };

function getMinutes(time: string) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
}

export function useAvailability(availability: Availability[], booked: BookedSlot[], days: Date[], slots: string[]) {
  return useMemo(() => {
    const isSlotAvailable = (date: Date, time: string) => {
      const minute = getMinutes(time);
      return availability.some((slot) => {
        const matchesDay = slot.isRecurring
          ? slot.dayOfWeek === date.getDay()
          : slot.specificDate && new Date(slot.specificDate).toDateString() === date.toDateString();
        const start = getMinutes(slot.startTime);
        const end = getMinutes(slot.endTime);
        return matchesDay && minute >= start && minute + 30 <= end;
      });
    };

    const isSlotBooked = (date: Date, time: string) =>
      booked.some((slot) => {
        const start = new Date(date);
        start.setHours(Number(time.slice(0, 2)), Number(time.slice(3)), 0, 0);
        return start >= new Date(slot.scheduledStartAt) && start < new Date(slot.scheduledEndAt);
      });

    const isSlotPast = (date: Date, time: string) => {
      const slotDate = new Date(date);
      slotDate.setHours(Number(time.slice(0, 2)), Number(time.slice(3)), 0, 0);
      return slotDate < new Date();
    };

    const openSlots: Slot[] = [];
    for (const date of days) {
      for (const time of slots) {
        if (isSlotAvailable(date, time) && !isSlotBooked(date, time) && !isSlotPast(date, time)) {
          openSlots.push({ time, date });
        }
      }
    }

    const getSlotStatus = (date: Date, time: string): "available" | "booked" | "past" | "unavailable" => {
      if (isSlotPast(date, time)) return "past";
      if (isSlotBooked(date, time)) return "booked";
      if (isSlotAvailable(date, time)) return "available";
      return "unavailable";
    };

    return { openSlots, isSlotAvailable, isSlotBooked, isSlotPast, getSlotStatus };
  }, [availability, booked, days, slots]);
}
