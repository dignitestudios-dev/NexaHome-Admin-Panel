import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ReferralRow = {
  id: number;
  avatar: string;
  partnerName: string;
  referralCode: string;
  usersReferred: string;
  jobsPosted: string;
  revenueGenerated: string;
  onboardedBy: string;
  status: "Active" | "Inactive";
  action: "Approve" | "Reject";
};

type ReferralTableProps = {
  data: ReferralRow[];
};

export const TrackingTable = ({ data }: ReferralTableProps) => {
  return (
    <>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Partner Name</TableHead>
              <TableHead>Referral Code</TableHead>

              <TableHead>Jobs Posted</TableHead>
              <TableHead>Revenue Generated</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((referral, index) => (
              <TableRow
                key={index}
                className="font-normal cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {/* Partner Name */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={referral.avatar}
                        alt={referral.partnerName}
                      />
                      <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                        {referral.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <span>{referral.partnerName}</span>
                  </div>
                </TableCell>

                {/* Referral Code */}
                <TableCell>{referral.referralCode}</TableCell>

                {/* Jobs Posted */}
                <TableCell>{referral.jobsPosted}</TableCell>

                {/* Revenue Generated */}
                <TableCell>{referral.revenueGenerated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
