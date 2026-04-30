"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCategoryModal = ({
  open,
  onOpenChange,
}: AddCategoryModalProps) => {
  const [formData, setFormData] = useState({
    categoryName: "",
    oneTimePricing: "",
    recurringPricing: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({ categoryName: "", oneTimePricing: "", recurringPricing: "" });
    onOpenChange(false);
  };

  const handleAdd = () => {
    // Handle form submission
    console.log("Category added:", formData);
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <div className="fixed left-[50%] top-[50%] z-50 w-[490px] translate-x-[-50%] translate-y-[-50%] rounded-[24px] border-0 bg-white p-0 shadow-lg">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-10 top-10 z-10 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>

          {/* Modal Content */}
          <div className="px-7.5 py-10">
            {/* Title */}
            <h2 className="text-[32px] font-semibold leading-[40px] text-[#1C1C1C] capitalize mb-6">
              Add Category
            </h2>

            {/* Category Name Field */}
            <div className="mb-6">
              <Label className="text-[20px] font-medium leading-[25px] text-[#1C1C1C] capitalize mb-3 block">
                Category Name
              </Label>
              <Input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                placeholder="Gardening"
                className="w-full h-[48px] bg-[rgba(0,88,100,0.06)] border-0 rounded-[12px] px-4 py-3 text-[16px] placeholder:text-[rgba(24,24,24,0.8)] focus:outline-none focus:ring-2 focus:ring-[#005864]"
              />
            </div>

            {/* Category Pricing Section */}
            <div className="mb-6">
              <Label className="text-[20px] font-medium leading-[25px] text-[#1C1C1C] capitalize mb-3 block">
                Category Pricing
              </Label>
              <div className="flex gap-[10px] justify-center">
                {/* One Time Pricing */}
                <div className="flex-1">
                  <Input
                    type="text"
                    name="oneTimePricing"
                    value={formData.oneTimePricing}
                    onChange={handleInputChange}
                    placeholder="One time"
                    className="w-full h-[48px] bg-[rgba(0,88,100,0.06)] border-0 rounded-[12px] px-4 py-3 text-[16px] placeholder:text-[rgba(24,24,24,0.8)] focus:outline-none focus:ring-2 focus:ring-[#005864]"
                  />
                </div>

                {/* Recurring Pricing */}
                <div className="flex-1">
                  <Input
                    type="text"
                    name="recurringPricing"
                    value={formData.recurringPricing}
                    onChange={handleInputChange}
                    placeholder="Recurring"
                    className="w-full h-[48px] bg-[rgba(0,88,100,0.06)] border-0 rounded-[12px] px-4 py-3 text-[16px] placeholder:text-[rgba(24,24,24,0.8)] focus:outline-none focus:ring-2 focus:ring-[#005864]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px] justify-center pt-4">
              {/* Cancel Button */}
              <Button
                onClick={handleCancel}
                className="w-[209px] h-[48px] bg-[rgba(0,88,100,0.06)] border-0 rounded-[12px] text-[#005864] font-semibold text-[16px] leading-[20px] capitalize hover:bg-[rgba(0,88,100,0.1)] transition"
              >
                Cancel
              </Button>

              {/* Add Button */}
              <Button
                onClick={handleAdd}
                className="w-[209px] h-[48px] bg-[#005864] border-0 rounded-[12px] text-white font-semibold text-[16px] leading-[20px] capitalize hover:bg-[#004450] transition"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};
