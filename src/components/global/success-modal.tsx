import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ApproveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
};

export const SuccessModal = ({
  isOpen,
  onClose,
  onApprove,
}: ApproveModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[460px] max-w-[460px] rounded-[16px] p-6 shadow-xl border-none gap-0">
        {/* Danger Icon */}
        <div className="flex justify-center mb-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="40"
              cy="40"
              r="40"
              fill="url(#paint0_linear_5996_13495)"
            />
            <path
              d="M26.875 41.875L35.625 50.625L53.125 31.875"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_5996_13495"
                x1="30"
                y1="33.5"
                x2="238.5"
                y2="252.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#005864" />
                <stop offset="1" stop-color="#D7DF23" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <DialogHeader className="space-y-2 text-center mb-6">
          <DialogTitle className="text-[24px] font-bold text-[#181818] capitalize">
            CSV Uploaded
          </DialogTitle>

          <DialogDescription className="text-[16px] font-normal text-[#565656] leading-normal">
            Email sent successfully
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
