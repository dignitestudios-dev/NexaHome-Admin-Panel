import { format, isValid, parseISO } from "date-fns";

const DATE_DISPLAY = "MM/dd/yyyy";
const DATETIME_DISPLAY = "MM/dd/yyyy HH:mm:ss";

function parseDate(value?: string | Date | null) {
  if (!value) return null;

  const parsed = typeof value === "string" ? new Date(value) : value;
  if (!isValid(parsed)) return null;
  return parsed;
}

/** Display dates across the app as MM/DD/YYYY */
export function formatDate(value?: string | Date | null, fallback = "—") {
  const parsed = parseDate(value);
  if (!parsed) return fallback;
  return format(parsed, DATE_DISPLAY);
}

/** Display datetimes as MM/DD/YYYY HH:mm:ss */
export function formatDateTime(value?: string | Date | null, fallback = "—") {
  const parsed = parseDate(value);
  if (!parsed) return fallback;
  return format(parsed, DATETIME_DISPLAY);
}

/** Chart / short period labels as MM/DD */
export function formatShortDate(value?: string | Date | null, fallback = "—") {
  const parsed = parseDate(value);
  if (!parsed) return fallback;
  return format(parsed, "MM/dd");
}

/** ISO date string for API query params (yyyy-MM-dd) */
export function formatApiDate(value: Date) {
  if (!isValid(value)) return "";
  return format(value, "yyyy-MM-dd");
}

export function parseApiDate(value?: string) {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}
