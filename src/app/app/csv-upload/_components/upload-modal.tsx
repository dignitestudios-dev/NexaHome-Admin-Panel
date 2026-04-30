"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCategoryModal = ({
  open,
  onOpenChange,
}: AddCategoryModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
    } else {
      alert("Only CSV file allowed");
    }
  };

  const handleCancel = () => {
    setFile(null);
    onOpenChange(false);
  };

  const handleAdd = () => {
    console.log("Uploaded File:", file);
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />

        <div className="fixed left-1/2 top-1/2 z-50 w-[490px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white shadow-lg">

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 py-10">

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-6">
              CSV Upload
            </h2>

            {/* Upload Box */}
            <div
              className="border border-dashed rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
              {file ? (
                <p className="font-medium flex flex-col items-center gap-1">
                    <FileText className="w-10 h-10 text-gray-600" />
                    {file.name}
                </p>
              ) : (
                <>
                  <p className="font-medium">Upload CSV</p>
                  <p className="text-sm text-gray-500">
                    Click to browse
                  </p>
                </>
              )}
            </div>

                {/* File Name Preview
                {file && (
                <p className="mt-3 text-sm text-gray-600">
                    Selected: {file.name}
                </p>
                )} */}

            {/* Buttons */}
            <div className="flex gap-3 justify-center pt-6">

              <Button
                onClick={handleCancel}
                className="w-[200px] h-[45px] bg-gray-100 text-[#005864] hover:bg-gray-200"
              >
                Cancel
              </Button>

              <Button
                onClick={handleAdd}
                disabled={!file}
                className="w-[200px] h-[45px] "
              >
                Upload
              </Button>

            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};