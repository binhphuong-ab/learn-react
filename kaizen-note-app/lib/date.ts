import { DEFAULT_TIME_ZONE } from "@/lib/constants";

export const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function dateKeyInTimeZone(
  date: Date = new Date(),
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isDateKey(value: string): boolean {
  return DATE_KEY_REGEX.test(value);
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateKey(date);
}

export function startOfWeekDateKey(anchorDateKey?: string): string {
  const target = anchorDateKey ?? dateKeyInTimeZone();
  const date = parseDateKey(target);
  const mondayBased = (date.getUTCDay() + 6) % 7;
  return shiftDateKey(target, -mondayBased);
}

export function weekDateKeys(weekStartDateKey: string): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    shiftDateKey(weekStartDateKey, index),
  );
}
