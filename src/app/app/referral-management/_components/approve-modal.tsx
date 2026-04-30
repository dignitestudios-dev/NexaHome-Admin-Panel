import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DangerIconGradient } from "./danger-icons";

type ApproveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  partnerName?: string;
};

export const ApproveModal = ({
  isOpen,
  onClose,
  onApprove,
  partnerName = "this partner",
}: ApproveModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[360px] max-w-[360px] rounded-[16px] p-6 shadow-xl border-none gap-0">
        {/* Danger Icon */}
        <div className="flex justify-center mb-4">
          <DangerIconGradient />
        </div>

        {/* Content */}
        <DialogHeader className="space-y-2 text-center mb-6">
          <DialogTitle className="text-[24px] font-bold text-[#181818] capitalize">
            Approve Partner
          </DialogTitle>

          <DialogDescription className="text-[16px] font-normal text-[#565656] leading-normal">
            Are you sure you want to approve {partnerName}?
          </DialogDescription>
        </DialogHeader>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[rgba(0,88,100,0.06)] text-[#005864] rounded-[12px] font-semibold text-[12px] hover:bg-[rgba(0,88,100,0.12)] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onApprove}
            className="flex-1 px-4 py-3 bg-[#005864] text-white rounded-[12px] font-semibold text-[12px] hover:bg-[#004450] transition-colors"
          >
            Approve
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
