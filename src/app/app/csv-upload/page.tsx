
"use client";
import SearchInput from "@/components/global/search-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddCategoryModal } from "./_components/upload-modal";
import CSVDataTable from "./_components/csv-data-table";

export default function CSVUpload() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return(
    <div className="">
      <h1 className="heading">CSV Upload</h1>
        <div className="flex justify-end items-center pb-4">

      <div className="flex flex-col items-end gap-2 ">
        <Button onClick={() => setIsModalOpen(true)} className="px-6">CSV Upload</Button>
        <div className="flex items-center gap-2">
          <SearchInput />
          {/* <Button className="">Download Template</Button> */}
        </div>
      </div>
    </div>
<AddCategoryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
<CSVDataTable />

    </div>
  );
}