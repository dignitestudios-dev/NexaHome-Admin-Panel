import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CgClose } from "react-icons/cg";
import { FaFilter } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export function CategoriesFilters() {
  const handleApply = () => {};
  const handleClearAll = () => {};

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="w-[44px] h-[44px]">
          <FaFilter className="w-[22px] h-[22px] text-white  " />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="heading">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button className="absolute top-4 right-4">
              <CgClose className="w-[22px] h-[22px] text-white  " />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4">
          <span className="text-[20px] font-semibold">Status</span>

          <div className="flex flex-col gap-3 mb-4">
            <Button variant="ghost" className="justify-start">
              Active
            </Button>
            <Button variant="ghost" className="justify-start">
              Inactive
            </Button>
          </div>
        </div>

        <DrawerFooter className=" w-[200px] mx-auto flex justify-center">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
          <DrawerClose asChild>
            <Button onClick={handleApply} className="w-full">
              Apply
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
