export type RevenueMonetizationGroupBy = "week" | "month" | "year";

export interface RevenueMonetizationFilterParams {
  city?: string;
  zipCode?: string;
}

export interface RevenueMonetizationSummary {
  totalAdsRevenue: number;
  totalCategoryRevenue: number;
  totalLeadsRevenue: number;
  totalTrustedExpertBadgeRevenue: number;
}

export interface RevenueMonetizationSeriesItem {
  period: string;
  adsRevenue: number;
  categoryRevenue: number;
  leadsRevenue: number;
  trustedExpertBadgeRevenue?: number;
  badgeRevenue?: number;
}

export interface RevenueMonetizationChartPoint {
  name: string;
  ads: number;
  leads: number;
  pkg: number;
  badge: number;
}

export interface RevenueMonetizationData {
  groupBy: RevenueMonetizationGroupBy;
  summary: RevenueMonetizationSummary;
  series: RevenueMonetizationChartPoint[];
}

export interface RevenueMonetizationApiResponse {
  groupBy?: RevenueMonetizationGroupBy;
  summary?: Partial<RevenueMonetizationSummary> & {
    totalTrustedExpertBadgeRevenue?: number;
    totalBadgeRevenue?: number;
  };
  series?: RevenueMonetizationSeriesItem[];
}
