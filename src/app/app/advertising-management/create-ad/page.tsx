"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/global/custom-select";

const categoryOptions = [
  { label: "Home Services", value: "home-services" },
  { label: "Pet Services", value: "pet-services" },
  { label: "Food Services", value: "food-services" },
];

const locationOptions = [
  { label: "California", value: "california" },
  { label: "New York", value: "new-york" },
  { label: "Washington", value: "washington" },
];

export default function CreateAdPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brandName: "",
    fixedPrice: "",
    redirectUrl: "",
    category: "",
    location: "",
    package: "",
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Images:", uploadedImages);
    // TODO: Submit to API
  };

  return (
    <div className=" w-full min-h-screen overflow-hidden">
      {/* Background Elements */}
      {/* <div className="absolute inset-0 bg-[#EAFCFF] rounded-[50px]"></div> */}

      {/* Gradient Blob */}
      {/* <div
        className="absolute rounded-full blur-[400px]"
        style={{
          width: "569px",
          height: "549.48px",
          left: "613px",
          top: "693.35px",
          background: "linear-gradient(180deg, #D7DF23 0%, #005864 100%)",
          pointerEvents: "none",
        }}
      ></div> */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading">Ad Creation</h1>
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-0  w-full h-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-6 p-6">
            {/* Left Form Section */}
            <div
              className="bg-white rounded-[24px] p-6 flex-1"
              style={{
                width: "604px",
                minHeight: "531px",
              }}
            >
              {/* Brand Name */}
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-sm font-medium text-black">
                  Brand Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter brand name"
                  value={formData.brandName}
                  onChange={(e) =>
                    handleInputChange("brandName", e.target.value)
                  }
                  className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                />
              </div>

              {/* Redirect URL */}
              <div className="flex flex-col gap-2 my-4">
                <Label className="text-sm font-medium text-black">
                  Redirect URL
                </Label>
                <Input
                  type="text"
                  placeholder="Fixed Price"
                  value={formData.redirectUrl}
                  onChange={(e) =>
                    handleInputChange("redirectUrl", e.target.value)
                  }
                  className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4 text-[#959393]"
                />
              </div>

              {/* Category Selection */}
              <div className="flex flex-col gap-2 w-full  my-4">
                {/* Label */}
                <Label className="text-[14px] font-medium leading-[18px] text-black">
                  Category Selection
                </Label>

                {/* Select */}
                <CustomSelect
                  value={formData.category}
                  onChange={(val) => handleInputChange("category", val)}
                  options={categoryOptions}
                  placeholder="Select Category"
                />
              </div>

              {/* Location Targeting */}
              <div className="flex flex-col gap-2 my-4">
                <Label className="text-sm font-medium text-black">
                  Location Targeting
                </Label>
                <CustomSelect
                  value={formData.location}
                  onChange={(val) => handleInputChange("location", val)}
                  options={locationOptions}
                  placeholder="Select Location"
                />
              </div>

              {/* Package Selection */}
              <div className="flex flex-col gap-2 my-4">
                <Label className="text-sm font-medium text-black">
                  Package Selection
                </Label>
                <Input
                  type="text"
                  placeholder="Fixed Price"
                  value={formData.package}
                  onChange={(e) => handleInputChange("package", e.target.value)}
                  className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4 text-[#959393]"
                />
              </div>
            </div>

            {/* Right Image Upload Section */}
            <div
              className="bg-white rounded-[24px] p-6 flex flex-col gap-4"
              style={{
                width: "482px",
                minHeight: "531px",
              }}
            >
              <h3 className="text-[22px] font-semibold text-black">
                Product Images
              </h3>

              {/* Upload Area */}
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#D9D9D9] rounded-[7px] bg-[#FBFBFB] cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={30.84} className="text-[#959393]" />
                  <span className="text-center text-black text-base font-medium">
                    Click to Upload Or Drag & Drop
                  </span>
                </div>
              </label>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-square rounded-[7px] overflow-hidden bg-gray-200"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="flex-1 h-[48px] rounded-[12px]"
                >
                  Save
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  className="flex-1 h-[48px] rounded-[12px]"
                >
                  Activate
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
