import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, resolving conflicts (later classes win).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as USD currency, e.g. 184800 -> "$184,800".
 * Garment export orders in this ERP are quoted in USD.
 */
export function formatCurrency(value: number | null | undefined, options?: { decimals?: number }): string {
  const amount = Number.isFinite(value) ? (value as number) : 0;
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a number as BDT currency, e.g. 184800 -> "৳184,800".
 */
export function formatBdt(value: number | null | undefined, options?: { decimals?: number }): string {
  const amount = Number.isFinite(value) ? (value as number) : 0;
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Compact BDT formatting for dashboard KPIs, e.g. 12500000 -> "৳1.25 Cr".
 */
export function formatCurrencyBDT(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 10000000) return `${sign}৳${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}৳${(abs / 100000).toFixed(2)} Lac`;
  return `${sign}৳${formatNumber(abs)}`;
}

/**
 * Format a plain number with thousand separators, e.g. 48000 -> "48,000".
 */
export function formatNumber(value: number | null | undefined, options?: { decimals?: number }): string {
  const amount = Number.isFinite(value) ? (value as number) : 0;
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const BN_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const BN_DIGITS: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

/**
 * Convert ASCII digits in a string to Bangla (Bengali) numerals.
 */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => BN_DIGITS[digit] ?? digit);
}

/**
 * Format a date (ISO string or Date) in Bangla, e.g. "২৭ জুলাই ২০২৬".
 * Pass `withWeekday: true` to prefix the Bangla weekday name.
 */
export function formatDateBn(
  input: string | number | Date | null | undefined,
  options?: { withWeekday?: boolean }
): string {
  if (!input) return "—";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";

  const day = toBanglaDigits(date.getDate());
  const month = BN_MONTHS[date.getMonth()];
  const year = toBanglaDigits(date.getFullYear());
  const base = `${day} ${month} ${year}`;

  if (options?.withWeekday) {
    return `${BN_WEEKDAYS[date.getDay()]}, ${base}`;
  }
  return base;
}

/** Alias kept for compatibility: `bnDate(new Date())` -> "২৭ জুলাই, ২০২৬". */
export function bnDate(date: Date = new Date()): string {
  return `${toBanglaDigits(date.getDate())} ${BN_MONTHS[date.getMonth()]}, ${toBanglaDigits(date.getFullYear())}`;
}

/**
 * Format a date the normal (English/ISO-ish) way, e.g. "27 Jul 2026".
 */
export function formatDate(
  input: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!input) return "—";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", options ?? { day: "2-digit", month: "short", year: "numeric" }).format(
    date
  );
}

/**
 * Generate a short, reasonably-unique id for client-created records.
 */
export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Clamp a percentage-like number between 0 and 100.
 */
export function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/**
 * Compute due amount as invoiced - received, floored at 0.
 */
export function computeDue(invoiced: number, received: number): number {
  return Math.max(0, Math.round((invoiced - received) * 100) / 100);
}

/**
 * Human friendly title-case a kebab/camel/snake string, e.g. "in_house" -> "In House".
 */
export function titleCase(input: string): string {
  return input
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
