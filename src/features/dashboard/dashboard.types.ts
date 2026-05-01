export interface MetricStat {
  value: number;
  increasePercentThisMonth: number;
}

export interface DashboardSummary {
  totalUsers: MetricStat;
  totalExperts: MetricStat;
  totalJobsPosted: MetricStat;
  totalRevenue: MetricStat;
}

export interface DashboardInsights {
  activeUsersPercent: number;
  repeatHomeownersPercent: number;
  completedJobsPercent: number;
  averageRating: number;
}

export interface PopularCategory {
  _id: string;
  name: string;
  slug: string;
  jobsCount: number;
}

export interface PopularCategoriesResponse {
  groupBy: string;
  limit: number;
  categories: PopularCategory[];
}

export type RevenueGroupBy = "week" | "month" | "year";

export interface RevenuePoint {
  name: string;
  revenue: number;
}

export interface GrowthPoint {
  name: string;
  users: number;
  experts: number;
}
