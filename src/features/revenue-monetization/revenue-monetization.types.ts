export type RevenueMonetizationGroupBy = "week" | "month" | "year";

export interface RevenueMonetizationSummary {
  totalAdsRevenue: number;
  totalCategoryRevenue: number;
  totalLeadsRevenue: number;
}

export interface RevenueMonetizationSeriesItem {
  period: string;
  adsRevenue: number;
  categoryRevenue: number;
  leadsRevenue: number;
}

export interface RevenueMonetizationChartPoint {
  name: string;
  ads: number;
  leads: number;
  pkg: number;
}

export interface RevenueMonetizationData {
  groupBy: RevenueMonetizationGroupBy;
  summary: RevenueMonetizationSummary;
  series: RevenueMonetizationChartPoint[];
}

export interface RevenueMonetizationApiResponse {
  groupBy?: RevenueMonetizationGroupBy;
  summary?: Partial<RevenueMonetizationSummary>;
  series?: RevenueMonetizationSeriesItem[];
}
