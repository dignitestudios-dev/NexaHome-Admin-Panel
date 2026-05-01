import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetJobsActivityParams,
  JobActivityItem,
  JobActivityPerson,
  JobsActivityListResponse,
  JobsActivityListResult,
} from "./jobs-activity.types";

export const jobsActivityApi = {
  getJobsActivity: async ({
    page = 1,
    limit = 10,
    status,
  }: GetJobsActivityParams): Promise<JobsActivityListResult> => {
    try {
      const { data } = await API.get("/admin/jobs/activity", {
        params: { page, limit, status },
      });
      const payload = (data?.data ?? data) as JobsActivityListResponse;
      const jobs = payload?.jobs ?? payload?.activities ?? [];
      const pagination = payload?.pagination;

      const total =
        pagination?.totalItems ??
        payload?.total ??
        payload?.totalCount ??
        jobs.length;
      const totalPages =
        pagination?.totalPages ??
        payload?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        jobs,
        page: pagination?.currentPage ?? payload?.page ?? page,
        limit: pagination?.itemsPerPage ?? payload?.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

function getPerson(
  value: JobActivityItem["postedBy"] | JobActivityItem["vendorAssigned"]
): JobActivityPerson | null {
  if (!value) return null;
  if (typeof value === "string") return { name: value };
  return value;
}

export function getJobCategory(job: JobActivityItem): string {
  return job.jobCategory ?? "—";
}

export function getPostedBy(job: JobActivityItem): JobActivityPerson | null {
  return getPerson(job.postedBy);
}

export function getVendorAssigned(job: JobActivityItem): JobActivityPerson | null {
  return getPerson(job.vendorAssigned);
}

export function getPersonName(person: JobActivityPerson | null): string {
  return person?.name ?? person?.userName ?? "—";
}

export function getPersonImageUrl(
  person: JobActivityPerson | null
): string | undefined {
  if (!person) return undefined;
  if (person.avatar) return person.avatar;
  if (!person.profilePicture) return undefined;
  if (typeof person.profilePicture === "string") return person.profilePicture;
  return person.profilePicture.location ?? undefined;
}

export function getPersonInitials(name?: string) {
  if (!name?.trim()) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getJobDatePosted(job: JobActivityItem): string | undefined {
  return job.datePosted;
}

export function getJobStatus(job: JobActivityItem): string {
  return job.status ?? "—";
}

export function formatJobActivityStatus(status?: string) {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function getJobActivityStatusColor(status?: string) {
  const normalized = status?.toLowerCase();
  if (
    normalized === "active" ||
    normalized === "completed" ||
    normalized === "accepted"
  ) {
    return "text-[#22C55E]";
  }
  if (normalized === "pending" || normalized === "in-progress") {
    return "text-[#F59E0B]";
  }
  if (normalized === "rejected" || normalized === "cancelled" || normalized === "inactive") {
    return "text-[#EF4444]";
  }
  return "text-slate-600";
}
