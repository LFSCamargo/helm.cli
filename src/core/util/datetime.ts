/**
 * Small, dependency-free date helpers. We support a friendly subset of
 * human input for due dates and reminders so the form stays fast to use.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/** Parse a flexible due-date string into a Date, or null if empty/invalid. */
export function parseDueDate(input: string, base = new Date()): Date | null {
  const raw = input.trim().toLowerCase();
  if (!raw) return null;

  // Relative offsets: +30m, +2h, +1d, +1w
  const rel = raw.match(/^\+\s*(\d+)\s*(m|min|h|hr|hour|d|day|w|week)s?$/);
  if (rel) {
    const amount = Number(rel[1]);
    const unit = rel[2];
    const d = new Date(base);
    if (unit.startsWith('m')) d.setMinutes(d.getMinutes() + amount);
    else if (unit.startsWith('h')) d.setHours(d.getHours() + amount);
    else if (unit.startsWith('w')) d.setDate(d.getDate() + amount * 7);
    else d.setDate(d.getDate() + amount);
    return d;
  }

  // Keyword + optional time: "today 17:00", "tomorrow 9am"
  const kw = raw.match(/^(today|tomorrow|tonight)(?:\s+(.+))?$/);
  if (kw) {
    const d = new Date(base);
    d.setSeconds(0, 0);
    if (kw[1] === 'tomorrow') d.setDate(d.getDate() + 1);
    const time = parseTime(kw[2] ?? (kw[1] === 'tonight' ? '20:00' : '09:00'));
    if (time) {
      d.setHours(time.h, time.m, 0, 0);
    }
    return d;
  }

  // ISO-ish: YYYY-MM-DD [HH:mm]
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ t](\d{1,2}):(\d{2}))?$/);
  if (iso) {
    const d = new Date(
      Number(iso[1]),
      Number(iso[2]) - 1,
      Number(iso[3]),
      iso[4] ? Number(iso[4]) : 9,
      iso[5] ? Number(iso[5]) : 0,
      0,
      0,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const fallback = new Date(input);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function parseTime(value: string): { h: number; m: number } | null {
  const v = value.trim().toLowerCase();
  const m = v.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2] ? Number(m[2]) : 0;
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return { h, m: min };
}

/**
 * Parse a reminder relative to a due date. Accepts "10m", "1h", "2d" (before
 * due), "at" (exactly at due), an absolute date, or empty (no reminder).
 */
export function parseReminder(input: string, due: Date | null): Date | null {
  const raw = input.trim().toLowerCase();
  if (!raw) return null;
  if ((raw === 'at' || raw === 'on time') && due) return new Date(due);

  const before = raw.match(/^(\d+)\s*(m|min|h|hr|hour|d|day)s?(?:\s+before)?$/);
  if (before && due) {
    const amount = Number(before[1]);
    const unit = before[2];
    const d = new Date(due);
    if (unit.startsWith('m')) d.setMinutes(d.getMinutes() - amount);
    else if (unit.startsWith('h')) d.setHours(d.getHours() - amount);
    else d.setDate(d.getDate() - amount);
    return d;
  }

  return parseDueDate(input);
}

/** Format a date as an editable "YYYY-MM-DD HH:mm" string for form inputs. */
export function formatInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

/** Compact absolute label, e.g. "Jun 10, 09:00". */
export function formatAbsolute(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  const base = `${months[date.getMonth()]} ${date.getDate()}`;
  return `${base}${sameYear ? '' : ', ' + date.getFullYear()}, ${time}`;
}

/** Human-friendly relative label, e.g. "in 3h", "2d ago", "Today 17:00". */
export function formatRelative(date: Date, now = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  const past = diffMs < 0;
  const abs = Math.abs(diffMs);
  const min = Math.round(abs / 60000);
  const hr = Math.round(abs / 3600000);
  const day = Math.round(abs / 86400000);

  let rel: string;
  if (min < 1) rel = 'now';
  else if (min < 60) rel = `${min}m`;
  else if (hr < 24) rel = `${hr}h`;
  else if (day < 30) rel = `${day}d`;
  else rel = formatAbsolute(date);

  if (rel === 'now') return 'now';
  if (rel.includes(',')) return rel;
  return past ? `${rel} ago` : `in ${rel}`;
}

export function isOverdue(date: Date, now = new Date()): boolean {
  return date.getTime() < now.getTime();
}

export function isToday(date: Date, now = new Date()): boolean {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
