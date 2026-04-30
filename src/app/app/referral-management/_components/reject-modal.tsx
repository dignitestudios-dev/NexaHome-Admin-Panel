import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DangerIconRed } from "./danger-icons";

type RejectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  partnerName?: string;
};

export const RejectModal = ({
  isOpen,
  onClose,
  onReject,
  partnerName = "this partner",
}: RejectModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[360px] max-w-[360px] rounded-[16px] p-6 shadow-xl border-none gap-0">
        {/* Danger Icon */}
        <div className="flex justify-center mb-4">
          <DangerIconRed />
        </div>

        {/* Content */}
        <DialogHeader className="space-y-2 text-center mb-6">
          <DialogTitle className="text-[24px] font-bold text-[#181818] capitalize">
            Reject
          </DialogTitle>

          <DialogDescription className="text-[16px] font-normal text-[#565656] leading-normal">
            Are you sure you want to reject {partnerName}?
          </DialogDescription>
        </DialogHeader>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#ECECEC] text-[#181818] rounded-[12px] font-semibold text-[12px] hover:bg-gray-300 transition-colors"
          >
            No
          </button>

          <button
            onClick={onReject}
            className="flex-1 px-4 py-3 bg-[#F01A1A] text-white rounded-[12px] font-semibold text-[12px] hover:bg-red-700 transition-colors"
          >
            Yes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
