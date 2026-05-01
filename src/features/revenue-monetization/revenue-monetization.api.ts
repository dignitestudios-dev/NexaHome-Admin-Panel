import { format } from "date-fns";
import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  RevenueMonetizationApiResponse,
  RevenueMonetizationChartPoint,
  RevenueMonetizationData,
  RevenueMonetizationGroupBy,
  RevenueMonetizationSummary,
} from "./revenue-monetization.types";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LETTERS_MON_TO_SUN = ["M", "T", "W", "T", "F", "S", "S"];

function mondayFirstIndex(date: Date): number {
  const d = date.getUTCDay();
  return d === 0 ? 6 : d - 1;
}

function parsePeriodToDate(period: string): Date | null {
  const parts = period.split("-");
  if (parts.length === 3) {
    const date = new Date(
      Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function startOfCurrentWeekMonday(now = new Date()): Date {
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const day = date.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - daysFromMonday);
  return date;
}

/** Current calendar week only: Monday → Sunday. */
function buildCurrentWeekSlots<T>(
  series: unknown[],
  extract: (item: Record<string, unknown>) => T,
  emptyValue: T
): T[] {
  const weekStart = startOfCurrentWeekMonday();
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  const slots: T[] = Array.from({ length: 7 }, () => emptyValue);

  for (const raw of series) {
    const item = (raw ?? {}) as Record<string, unknown>;
    const period = String(item.period ?? "");
    const date = parsePeriodToDate(period);
    if (!date) continue;
    if (date < weekStart || date > weekEnd) continue;

    slots[mondayFirstIndex(date)] = extract(item);
  }

  return slots;
}

function normalizeWeekSeries(series: unknown[]): RevenueMonetizationChartPoint[] {
  const slots = buildCurrentWeekSlots(
    series,
    (item) => ({
      ads: Number(item.adsRevenue) || 0,
      leads: Number(item.leadsRevenue) || 0,
      pkg: Number(item.categoryRevenue) || 0,
    }),
    { ads: 0, leads: 0, pkg: 0 }
  );

  return DAY_LETTERS_MON_TO_SUN.map((name, index) => ({
    name,
    ads: slots[index]?.ads ?? 0,
    leads: slots[index]?.leads ?? 0,
    pkg: slots[index]?.pkg ?? 0,
  }));
}

function formatMonthPeriodLabel(period: string): string {
  const [year, month] = period.split("-");
  if (!year || !month) return period;
  const monthIndex = Number(month) - 1;
  return `${MONTH_NAMES[monthIndex] ?? month} ${year}`;
}

function extractSeriesPoint(item: Record<string, unknown>) {
  return {
    ads: Number(item.adsRevenue) || 0,
    leads: Number(item.leadsRevenue) || 0,
    pkg: Number(item.categoryRevenue) || 0,
  };
}

function normalizeMonthSeries(series: unknown[]): RevenueMonetizationChartPoint[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const dataMap = new Map<
    string,
    { ads: number; leads: number; pkg: number }
  >();

  for (const raw of series) {
    const item = (raw ?? {}) as Record<string, unknown>;
    const period = String(item.period ?? "");
    const [yearStr, monthStr] = period.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (
      year === currentYear &&
      month >= currentMonth &&
      month <= 12 &&
      !Number.isNaN(year) &&
      !Number.isNaN(month)
    ) {
      dataMap.set(period, extractSeriesPoint(item));
    }
  }

  const result: RevenueMonetizationChartPoint[] = [];

  for (let month = currentMonth; month <= 12; month++) {
    const period = `${currentYear}-${String(month).padStart(2, "0")}`;
    const point = dataMap.get(period) ?? { ads: 0, leads: 0, pkg: 0 };

    result.push({
      name: formatMonthPeriodLabel(period),
      ...point,
    });
  }

  return result;
}

function formatPeriodLabel(
  period: string,
  groupBy: RevenueMonetizationGroupBy
): string {
  if (!period) return "";

  const parts = period.split("-");

  if (groupBy === "year" || (parts.length === 1 && /^\d{4}$/.test(period))) {
    return period;
  }

  if (groupBy === "month" && parts.length === 2) {
    const [year, month] = parts;
    if (year && month) {
      const monthIndex = Number(month) - 1;
      return `${MONTH_NAMES[monthIndex] ?? month} ${year}`;
    }
  }

  const date = parsePeriodToDate(period);
  if (date) {
    return format(date, "MM/dd");
  }

  return period;
}

function normalizeSummary(
  summary?: Partial<RevenueMonetizationSummary>
): RevenueMonetizationSummary {
  return {
    totalAdsRevenue: Number(summary?.totalAdsRevenue) || 0,
    totalCategoryRevenue: Number(summary?.totalCategoryRevenue) || 0,
    totalLeadsRevenue: Number(summary?.totalLeadsRevenue) || 0,
  };
}

function normalizeSeries(
  series: unknown[],
  groupBy: RevenueMonetizationGroupBy
): RevenueMonetizationChartPoint[] {
  if (!Array.isArray(series)) return [];

  if (groupBy === "week") {
    return normalizeWeekSeries(series);
  }

  if (groupBy === "month") {
    return normalizeMonthSeries(series);
  }

  return series.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    const period = String(item.period ?? "");

    return {
      name: formatPeriodLabel(period, groupBy),
      ads: Number(item.adsRevenue) || 0,
      leads: Number(item.leadsRevenue) || 0,
      pkg: Number(item.categoryRevenue) || 0,
    };
  });
}

function normalizeRevenueMonetization(
  payload: unknown,
  groupBy: RevenueMonetizationGroupBy
): RevenueMonetizationData {
  const root = ((payload as { data?: unknown })?.data ??
    payload) as RevenueMonetizationApiResponse;

  return {
    groupBy: root?.groupBy ?? groupBy,
    summary: normalizeSummary(root?.summary),
    series: normalizeSeries(root?.series ?? [], root?.groupBy ?? groupBy),
  };
}

export const revenueMonetizationApi = {
  getRevenueMonetization: async (
    groupBy: RevenueMonetizationGroupBy
  ): Promise<RevenueMonetizationData> => {
    try {
      const { data } = await API.get("/admin/revenue-monetization", {
        params: { groupBy },
      });
      return normalizeRevenueMonetization(data, groupBy);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function formatRevenueAmount(value: number) {
  return `$ ${value.toLocaleString()}`;
}

export function getChartYAxisMax(series: RevenueMonetizationChartPoint[]) {
  const maxValue = series.reduce((max, point) => {
    const pointMax = Math.max(point.ads, point.leads, point.pkg);
    return Math.max(max, pointMax);
  }, 0);

  if (maxValue <= 0) return 100;

  const padded = Math.ceil(maxValue * 1.2);
  const magnitude = Math.pow(10, Math.floor(Math.log10(padded)));
  return Math.ceil(padded / magnitude) * magnitude;
}

export interface RevenueMonetizationYearlyChartPoint {
  name: string;
  revenue: number;
}

export function getYearlyChartData(series: RevenueMonetizationChartPoint[]) {
  return series.map((point) => ({
    name: point.name,
    revenue: point.ads + point.leads + point.pkg,
  }));
}

export function getYearlyChartYAxisMax(
  series: RevenueMonetizationYearlyChartPoint[]
) {
  const maxValue = series.reduce(
    (max, point) => Math.max(max, point.revenue),
    0
  );
  if (maxValue <= 0) return 100;

  const padded = Math.ceil(maxValue * 1.2);
  const magnitude = Math.pow(10, Math.floor(Math.log10(padded)));
  return Math.ceil(padded / magnitude) * magnitude;
}
