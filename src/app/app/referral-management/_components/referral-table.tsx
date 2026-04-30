"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ApproveModal } from "./approve-modal";
import { RejectModal } from "./reject-modal";

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

export const ReferralTable = ({ data }: ReferralTableProps) => {
  const router = useRouter();
  const [approveModal, setApproveModal] = useState<{
    isOpen: boolean;
    referralId: number | null;
    partnerName: string;
  }>({ isOpen: false, referralId: null, partnerName: "" });

  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    referralId: number | null;
    partnerName: string;
  }>({ isOpen: false, referralId: null, partnerName: "" });

  const handleApproveClick = (e: React.MouseEvent, referral: ReferralRow) => {
    e.stopPropagation();
    setApproveModal({
      isOpen: true,
      referralId: referral.id,
      partnerName: referral.partnerName,
    });
  };

  const handleRejectClick = (e: React.MouseEvent, referral: ReferralRow) => {
    e.stopPropagation();
    setRejectModal({
      isOpen: true,
      referralId: referral.id,
      partnerName: referral.partnerName,
    });
  };

  const handleApproveConfirm = () => {
    console.log("Approved referral:", approveModal.referralId);
    setApproveModal({ isOpen: false, referralId: null, partnerName: "" });
  };

  const handleRejectConfirm = () => {
    console.log("Rejected referral:", rejectModal.referralId);
    setRejectModal({ isOpen: false, referralId: null, partnerName: "" });
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Partner Name</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Users Referred</TableHead>
              <TableHead>Jobs Posted</TableHead>
              <TableHead>Revenue Generated</TableHead>
              <TableHead>Onboarded By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="rounded-r-3xl">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((referral, index) => (
              <TableRow
                onClick={() =>
                  router.push(`/app/referral-management/${referral.id}`)
                }
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

                {/* Users Referred */}
                <TableCell>{referral.usersReferred}</TableCell>

                {/* Jobs Posted */}
                <TableCell>{referral.jobsPosted}</TableCell>

                {/* Revenue Generated */}
                <TableCell>{referral.revenueGenerated}</TableCell>

                {/* Onboarded By */}
                <TableCell>{referral.onboardedBy}</TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`font-medium ${
                      referral.status === "Active"
                        ? "text-[#16BC4E]"
                        : "text-[#FF0000]"
                    }`}
                  >
                    {referral.status}
                  </span>
                </TableCell>

                {/* Action */}
                <TableCell>
                  <button
                    onClick={(e) =>
                      referral.action === "Approve"
                        ? handleApproveClick(e, referral)
                        : handleRejectClick(e, referral)
                    }
                    className={`font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                      referral.action === "Approve"
                        ? "text-[#16BC4E]"
                        : "text-[#FF0000]"
                    }`}
                  >
                    {referral.action}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ApproveModal
        isOpen={approveModal.isOpen}
        partnerName={approveModal.partnerName}
        onClose={() =>
          setApproveModal({ isOpen: false, referralId: null, partnerName: "" })
        }
        onApprove={handleApproveConfirm}
      />

      <RejectModal
        isOpen={rejectModal.isOpen}
        partnerName={rejectModal.partnerName}
        onClose={() =>
          setRejectModal({ isOpen: false, referralId: null, partnerName: "" })
        }
        onReject={handleRejectConfirm}
      />
    </>
  );
};
