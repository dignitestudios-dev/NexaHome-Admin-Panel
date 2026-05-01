import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  DashboardInsights,
  DashboardSummary,
  GrowthPoint,
  MetricStat,
  PopularCategoriesResponse,
  RevenueGroupBy,
  RevenuePoint,
} from "./dashboard.types";

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

// Monday → Sunday single-letter labels
const DAY_LETTERS_MON_TO_SUN = ["M", "T", "W", "T", "F", "S", "S"];

// Monday = 0 … Sunday = 6
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
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function getRevenueValue(item: Record<string, unknown>) {
  return Number(item.revenue ?? item.value ?? item.total ?? item.amount ?? 0) || 0;
}

function startOfCurrentWeekMonday(now = new Date()): Date {
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const day = date.getUTCDay(); // 0 Sun … 6 Sat
  const daysFromMonday = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - daysFromMonday);
  return date;
}

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
    const period = String(item.period ?? item.name ?? item.label ?? "");
    const date = parsePeriodToDate(period);
    if (!date) continue;
    if (date < weekStart || date > weekEnd) continue;

    slots[mondayFirstIndex(date)] = extract(item);
  }

  return slots;
}

// Current calendar week only: Monday → Sunday.
function normalizeGrowthWeekSeries(series: unknown[]): GrowthPoint[] {
  const slots = buildCurrentWeekSlots(
    series,
    (item) => ({
      users: Number(item.users) || 0,
      experts: Number(item.experts) || 0,
    }),
    { users: 0, experts: 0 }
  );

  return DAY_LETTERS_MON_TO_SUN.map((name, i) => ({
    name,
    users: slots[i]?.users ?? 0,
    experts: slots[i]?.experts ?? 0,
  }));
}

// Current calendar week only: Monday → Sunday.
function normalizeRevenueWeekSeries(series: unknown[]): RevenuePoint[] {
  const slots = buildCurrentWeekSlots(
    series,
    (item) => getRevenueValue(item),
    0
  );

  return DAY_LETTERS_MON_TO_SUN.map((name, i) => ({
    name,
    revenue: slots[i] ?? 0,
  }));
}

// Map monthly series into current-month → Dec slots for this year
// (e.g. Jul → Aug → … → Dec).
function normalizeRevenueMonthSeries(series: unknown[]): RevenuePoint[] {
  const slots: Array<number | null> = Array(12).fill(null);
  let placedByPeriod = false;

  for (const raw of series) {
    const item = (raw ?? {}) as Record<string, unknown>;
    const period = String(
      item.period ?? item.name ?? item.label ?? item._id ?? ""
    );
    const parts = period.split("-");
    const monthIndex = Number(parts[1]) - 1;

    if (parts.length >= 2 && monthIndex >= 0 && monthIndex < 12) {
      slots[monthIndex] = getRevenueValue(item);
      placedByPeriod = true;
    }
  }

  if (!placedByPeriod) {
    series.forEach((raw, index) => {
      if (index >= 12) return;
      const item = (raw ?? {}) as Record<string, unknown>;
      slots[index] = getRevenueValue(item);
    });
  }

  const currentMonth = new Date().getUTCMonth();

  return Array.from({ length: 12 - currentMonth }, (_, offset) => {
    const monthIndex = currentMonth + offset;
    return {
      name: MONTH_NAMES[monthIndex],
      revenue: slots[monthIndex] ?? 0,
    };
  });
}

// Turn API period strings into readable chart labels.
// month: "2026-06" -> "Jun 2026", year: "2026" -> "2026"
function formatPeriod(period: string, groupBy: RevenueGroupBy): string {
  if (groupBy === "year") return period;

  const [year, part] = period.split("-");
  if (!part) return period;

  const monthIndex = Number(part) - 1;
  return `${MONTH_NAMES[monthIndex] ?? part} ${year}`;
}

// Normalize { data: { series: [{ period, revenue }] } } into chart points.
function normalizeRevenue(
  payload: unknown,
  groupBy: RevenueGroupBy
): RevenuePoint[] {
  const root = (payload as { data?: unknown })?.data ?? payload;

  const arr = Array.isArray(root)
    ? root
    : (root as Record<string, unknown>)?.series ??
      (root as Record<string, unknown>)?.points ??
      (root as Record<string, unknown>)?.data ??
      (root as Record<string, unknown>)?.results ??
      [];

  if (!Array.isArray(arr)) return [];

  if (groupBy === "week") {
    return normalizeRevenueWeekSeries(arr);
  }

  if (groupBy === "month") {
    return normalizeRevenueMonthSeries(arr);
  }

  return arr.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    const rawPeriod = String(
      item.period ?? item.name ?? item.label ?? item._id ?? ""
    );
    return {
      name: formatPeriod(rawPeriod, groupBy),
      revenue: getRevenueValue(item),
    };
  });
}

function normalizeMetricStat(raw: unknown): MetricStat {
  const item = (raw ?? {}) as Record<string, unknown>;

  return {
    value: Number(item.value) || 0,
    increasePercentThisMonth: Number(
      item.increasePercentThisMonth ?? item.growthPercentThisMonth ?? 0
    ),
  };
}

function normalizeDashboardSummary(payload: unknown): DashboardSummary {
  const root = ((payload as { data?: unknown })?.data ?? payload) as Record<
    string,
    unknown
  >;

  return {
    totalUsers: normalizeMetricStat(root.totalUsers),
    totalExperts: normalizeMetricStat(root.totalExperts),
    totalJobsPosted: normalizeMetricStat(root.totalJobsPosted),
    totalRevenue: normalizeMetricStat(root.totalRevenue),
  };
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const { data } = await API.get("/admin/dashboard/summary");
      return normalizeDashboardSummary(data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getInsights: async (): Promise<DashboardInsights> => {
    try {
      const { data } = await API.get("/admin/dashboard/insights");
      return (data?.data ?? data) as DashboardInsights;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getPopularCategories: async (): Promise<PopularCategoriesResponse> => {
    try {
      const { data } = await API.get("/admin/dashboard/popular-categories");
      return (data?.data ?? data) as PopularCategoriesResponse;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getRevenueAnalysis: async (
    groupBy: RevenueGroupBy
  ): Promise<RevenuePoint[]> => {
    try {
      const { data } = await API.get("/admin/dashboard/revenue-analysis", {
        params: { groupBy },
      });
      return normalizeRevenue(data, groupBy);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getGrowthTracking: async (
    groupBy: RevenueGroupBy
  ): Promise<GrowthPoint[]> => {
    try {
      const { data } = await API.get("/admin/dashboard/growth-tracking", {
        params: { groupBy },
      });
      const root = (data?.data ?? data) as Record<string, unknown>;
      const series = Array.isArray(root) ? root : root?.series ?? [];
      if (!Array.isArray(series)) return [];

      if (groupBy === "week") {
        return normalizeGrowthWeekSeries(series);
      }

      return series.map((raw) => {
        const item = (raw ?? {}) as Record<string, unknown>;
        const period = String(item.period ?? "");
        return {
          name: formatPeriod(period, groupBy),
          users: Number(item.users) || 0,
          experts: Number(item.experts) || 0,
        };
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
