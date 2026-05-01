"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useReferralTopCategories,
  useReferralTopHomeowners,
} from "@/features/insights/insights.hooks";
import {
  formatReferralHomeownerRevenue,
  formatReferralRank,
  getReferralCategoryKey,
  getReferralCategoryName,
  getReferralExpertsCount,
  getReferralHomeownerImageUrl,
  getReferralHomeownerInitials,
  getReferralHomeownerName,
  getReferralHomeownerRevenue,
  getReferralJobsCompleted,
  getReferralJobsPosted,
} from "@/features/insights/insights.api";

type DataTableProps = {
  activeTab: string;
};

function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ErrorRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-red-600">
        {message}
      </TableCell>
    </TableRow>
  );
}

function TopJobsTable() {
  const { data: categories = [], isLoading, isError, error } =
    useReferralTopCategories();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="rounded-l-3xl">Category</TableHead>
          <TableHead className="text-center">Jobs Posted</TableHead>
          <TableHead className="text-center">Jobs Completed</TableHead>
          <TableHead className="rounded-r-3xl text-right">Experts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <LoadingRow colSpan={4} />
        ) : isError ? (
          <ErrorRow
            colSpan={4}
            message={(error as Error)?.message ?? "Failed to load categories."}
          />
        ) : categories.length ? (
          categories.map((item) => (
            <TableRow key={getReferralCategoryKey(item)}>
              <TableCell className="font-medium">
                {getReferralCategoryName(item)}
              </TableCell>
              <TableCell className="text-center">
                {getReferralJobsPosted(item)}
              </TableCell>
              <TableCell className="text-center">
                {getReferralJobsCompleted(item)}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {getReferralExpertsCount(item)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No categories found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function TopHomeownersTable() {
  const { data: homeowners = [], isLoading, isError, error } =
    useReferralTopHomeowners();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="rounded-l-3xl">Rank</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead className="text-center">Jobs Posted</TableHead>
          <TableHead className="rounded-r-3xl text-right">Revenue Generated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <LoadingRow colSpan={4} />
        ) : isError ? (
          <ErrorRow
            colSpan={4}
            message={(error as Error)?.message ?? "Failed to load homeowners."}
          />
        ) : homeowners.length ? (
          homeowners.map((homeowner, index) => (
            <TableRow key={homeowner.userId}>
              <TableCell className="font-medium">
                {formatReferralRank(index)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 capitalize">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getReferralHomeownerImageUrl(homeowner)} />
                    <AvatarFallback className="bg-[#00586417] text-xs text-[#005864]">
                      {getReferralHomeownerInitials(getReferralHomeownerName(homeowner))}
                    </AvatarFallback>
                  </Avatar>
                  {getReferralHomeownerName(homeowner)}
                </div>
              </TableCell>
              <TableCell className="text-center">{homeowner.jobsPosted}</TableCell>
              <TableCell className="text-right font-semibold">
                {formatReferralHomeownerRevenue(getReferralHomeownerRevenue(homeowner))}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No homeowners found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function DataTable({ activeTab }: DataTableProps) {
  const isTopHomeownersTab = activeTab === "Top Homeowners";

  return (
    <div className="overflow-hidden">
      {isTopHomeownersTab ? <TopHomeownersTable /> : <TopJobsTable />}
    </div>
  );
}
