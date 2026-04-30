"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

type EditAdModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adData?: {
    _id: string;
    name: string;
    targetLocation: string;
    category: string;
    redirectUrl: string;
  };
};

export default function EditAdModal({
  open,
  onOpenChange,
  adData,
}: EditAdModalProps) {
  const [formData, setFormData] = useState({
    targetLocation: "",
    service: "",
    link: "",
  });

  useEffect(() => {
    if (adData && open) {
      setFormData({
        targetLocation: adData.targetLocation || "",
        service: adData.category || "",
        link: adData.redirectUrl || "",
      });
    }
  }, [adData, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Updated form data:", formData);
    // TODO: Submit to API
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />

        {/* Header Section */}
        <div className="fixed left-[50%] top-[50%] z-50 w-[490px] translate-x-[-50%] translate-y-[-50%] rounded-[24px] border-0 bg-white p-0 shadow-lg">
          <div className="relative pt-[35.5px] px-[30px]">
            <DialogHeader className="mb-[10px]">
              <DialogTitle className="text-[32px] font-semibold text-[#1C1C1C] leading-[40px] text-left">
                Edit Ad
              </DialogTitle>
            </DialogHeader>

            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-[30px] top-[35.5px] w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} className="text-[rgba(24,24,24,0.8)]" />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-[30px] pb-[16px] mb-2">
            <div className="mb-[16px]">
              <div className="w-full h-[220px] rounded-[16px] overflow-hidden bg-black">
                <video
                  poster="/images/video-thumbnail.jpg"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            {/* Target Location */}
            <div className="flex flex-col gap-[9px] mb-[10px]">
              <Label className="text-[20px] font-medium leading-[25px] text-[#1C1C1C]">
                Target Location
              </Label>
              <Input
                value={formData.targetLocation}
                onChange={(e) =>
                  handleInputChange("targetLocation", e.target.value)
                }
                placeholder="Gardening"
                className="h-[48px] bg-[rgba(0,88,100,0.14)] border-0 rounded-[12px] px-4 text-[rgba(24,24,24,0.8)]"
              />
            </div>

            {/* Service */}
            <div className="flex flex-col gap-[9px] mb-[10px]">
              <Label className="text-[20px] font-medium leading-[25px] text-[#1C1C1C]">
                Service
              </Label>
              <Input
                value={formData.service}
                onChange={(e) => handleInputChange("service", e.target.value)}
                placeholder="Gardening"
                className="h-[48px] bg-[rgba(0,88,100,0.03)] border-0 rounded-[12px] px-4 text-[rgba(24,24,24,0.8)]"
              />
            </div>

            {/* Link */}
            <div className="flex flex-col gap-[9px] mb-[10px]">
              <Label className="text-[20px] font-medium leading-[25px] text-[#1C1C1C]">
                Link
              </Label>
              <Input
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="https://www.examplelink.io/contact-request"
                className="h-[48px] bg-[rgba(0,88,100,0.14)] border-0 rounded-[12px] px-4 text-[rgba(24,24,24,0.8)] text-[16px] leading-[20px]"
              />
            </div>

            {/* Save Changes Button */}
            <Button
              onClick={handleSave}
              className="w-full h-[48px] bg-[#005864] hover:bg-[#004653] text-white font-semibold text-[16px] leading-[20px] rounded-[12px]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
