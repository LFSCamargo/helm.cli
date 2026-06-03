import { describe, expect, it } from 'vitest';
import {
  formatAbsolute,
  formatInput,
  formatRelative,
  isOverdue,
  isToday,
  parseDueDate,
  parseReminder,
} from '../datetime.js';

const base = new Date('2026-06-10T12:00:00');

describe('parseDueDate', () => {
  it('returns null for empty input', () => {
    expect(parseDueDate('', base)).toBeNull();
  });

  it('parses relative offsets', () => {
    const d = parseDueDate('+2h', base);
    expect(d?.getHours()).toBe(14);
  });

  it('parses today with time', () => {
    const d = parseDueDate('today 17:00', base);
    expect(d?.getDate()).toBe(10);
    expect(d?.getHours()).toBe(17);
  });

  it('parses ISO date', () => {
    const d = parseDueDate('2026-07-01 09:30', base);
    expect(d?.getMonth()).toBe(6);
    expect(d?.getMinutes()).toBe(30);
  });

  it('parses tomorrow', () => {
    const d = parseDueDate('tomorrow 8am', base);
    expect(d?.getDate()).toBe(11);
    expect(d?.getHours()).toBe(8);
  });

  it('returns null for invalid ISO', () => {
    expect(parseDueDate('not-a-date', base)).toBeNull();
  });
});

describe('parseReminder', () => {
  it('returns null when empty', () => {
    expect(parseReminder('', base)).toBeNull();
  });

  it('supports "at" relative to due date', () => {
    const due = new Date('2026-06-10T18:00:00');
    const remind = parseReminder('at', due);
    expect(remind?.toISOString()).toBe(due.toISOString());
  });

  it('subtracts minutes before due', () => {
    const due = new Date('2026-06-10T18:00:00');
    const remind = parseReminder('30m before', due);
    expect(remind?.getMinutes()).toBe(30);
  });

  it('parses hour offset before due', () => {
    const due = new Date('2026-06-10T18:00:00');
    const remind = parseReminder('2h before', due);
    expect(remind?.getHours()).toBe(16);
  });
});

describe('formatting helpers', () => {
  it('formatInput uses local components', () => {
    const d = new Date('2026-03-05T08:05:00');
    expect(formatInput(d)).toMatch(/2026-03-05 08:05/);
  });

  it('formatAbsolute includes month label', () => {
    const label = formatAbsolute(new Date('2026-03-05T08:05:00'));
    expect(label).toContain('Mar');
  });

  it('formatRelative shows now for sub-minute delta', () => {
    const now = new Date('2026-06-10T12:00:00');
    expect(formatRelative(new Date('2026-06-10T12:00:00'), now)).toBe('now');
  });

  it('formatRelative shows past and future shorthand', () => {
    const now = new Date('2026-06-10T12:00:00');
    expect(formatRelative(new Date('2026-06-10T10:00:00'), now)).toBe('2h ago');
    expect(formatRelative(new Date('2026-06-10T14:00:00'), now)).toBe('in 2h');
  });
});

describe('isOverdue / isToday', () => {
  it('detects overdue dates', () => {
    const now = new Date('2026-06-10T12:00:00');
    expect(isOverdue(new Date('2026-06-09T12:00:00'), now)).toBe(true);
  });

  it('detects today', () => {
    const now = new Date('2026-06-10T23:00:00');
    expect(isToday(new Date('2026-06-10T01:00:00'), now)).toBe(true);
  });
});
