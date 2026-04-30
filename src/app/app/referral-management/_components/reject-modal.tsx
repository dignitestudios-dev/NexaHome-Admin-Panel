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
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M25.3352 7.77366L38.0555 29.8501C38.3355 30.5091 38.458 31.0449 38.493 31.6015C38.563 32.9021 38.108 34.1662 37.2157 35.139C36.3233 36.1084 35.116 36.6806 33.8038 36.75H8.18808C7.64567 36.7171 7.10326 36.5939 6.59585 36.4032C4.05878 35.3801 2.83398 32.5015 3.86631 30.0062L16.6742 7.75805C17.1116 6.97599 17.7765 6.30143 18.5988 5.86791C20.9784 4.54829 24.0054 5.41532 25.3352 7.77366ZM22.5182 22.3225C22.5182 23.1549 21.8358 23.8502 20.9959 23.8502C20.1561 23.8502 19.4562 23.1549 19.4562 22.3225V17.4168C19.4562 16.5827 20.1561 15.9082 20.9959 15.9082C21.8358 15.9082 22.5182 16.5827 22.5182 17.4168V22.3225ZM20.9958 29.7803C20.1559 29.7803 19.4561 29.0849 19.4561 28.2543C19.4561 27.4202 20.1559 26.7266 20.9958 26.7266C21.8357 26.7266 22.518 27.4046 22.518 28.2352C22.518 29.0849 21.8357 29.7803 20.9958 29.7803Z"
              fill="#F01A1A"
            />
          </svg>
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
