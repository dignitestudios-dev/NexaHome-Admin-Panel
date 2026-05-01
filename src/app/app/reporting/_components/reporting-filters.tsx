"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CgClose } from "react-icons/cg";
import { FaFilter } from "react-icons/fa";
import type { ReportDateFilters } from "@/features/reports/reports.types";
import {
  formatApiDate,
  formatDate,
  parseApiDate,
} from "@/lib/date";
import { cn } from "@/lib/utils";

type ReportingFiltersProps = {
  value?: ReportDateFilters;
  onApply: (filters: ReportDateFilters) => void;
};

const EMPTY_FILTERS: ReportDateFilters = {
  startDate: "",
  endDate: "",
};

function toApiDate(date?: Date) {
  if (!date) return "";
  return formatApiDate(date);
}

function formatDisplayDate(value?: string) {
  return formatDate(value, "mm/dd/yyyy");
}

function DateField({
  id,
  label,
  value,
  minDate,
  maxDate,
  open,
  onOpenChange,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  minDate?: Date;
  maxDate?: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
}) {
  const selected = parseApiDate(value);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </Label>
      <button
        id={id}
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-[15px] transition hover:bg-slate-100",
          selected ? "text-slate-900" : "text-slate-400"
        )}
      >
        <span>{formatDisplayDate(value)}</span>
        <CalendarIcon className="h-4 w-4 text-[#005864]" />
      </button>

      {open ? (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(toApiDate(date));
              onOpenChange(false);
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            className="mx-auto"
          />
        </div>
      ) : null}
    </div>
  );
}

export function ReportingFilters({
  value = EMPTY_FILTERS,
  onApply,
}: ReportingFiltersProps) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(value.startDate ?? "");
  const [endDate, setEndDate] = useState(value.endDate ?? "");
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setStartDate(value.startDate ?? "");
    setEndDate(value.endDate ?? "");
    setActivePicker(null);
    setError("");
  }, [open, value.startDate, value.endDate]);

  const handleClearAll = () => {
    setStartDate("");
    setEndDate("");
    setActivePicker(null);
    setError("");
  };

  const handleApply = () => {
    if (startDate && endDate && startDate > endDate) {
      setError("End date must be after start date.");
      return;
    }

    setError("");
    onApply({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    setOpen(false);
  };

  const startDateObj = parseApiDate(startDate);
  const endDateObj = parseApiDate(endDate);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="h-[40px] w-[40px]">
          <FaFilter className="h-[20px] w-[20px] text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="heading">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button className="absolute top-4 right-4">
              <CgClose className="h-[22px] w-[22px] text-white" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="p-4">
          <div className="mb-4 flex justify-between">
            <span className="text-[20px] font-semibold">Date Range</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#005864] underline"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-4">
            <DateField
              id="report-start-date"
              label="Start Date"
              value={startDate}
              maxDate={endDateObj}
              open={activePicker === "start"}
              onOpenChange={(isOpen) =>
                setActivePicker(isOpen ? "start" : null)
              }
              onChange={(next) => {
                setError("");
                setStartDate(next);
              }}
            />

            <DateField
              id="report-end-date"
              label="End Date"
              value={endDate}
              minDate={startDateObj}
              open={activePicker === "end"}
              onOpenChange={(isOpen) => setActivePicker(isOpen ? "end" : null)}
              onChange={(next) => {
                setError("");
                setEndDate(next);
              }}
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </div>

        <DrawerFooter className="flex w-full justify-center bg-[#F8F8F8]">
          <DrawerClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </DrawerClose>
          <Button onClick={handleApply} className="flex-1">
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
