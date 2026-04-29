import { Search } from "lucide-react";
import React from "react";
import { SearchInputUI } from "../ui/search-input-ui";

const SearchInput = () => {
  return (
    <div className="w-[300px]  bg-white  rounded-[22px] h-[44px] px-4 flex items-center justify-between gap-2">
      <SearchInputUI placeholder="Search" />
      <Search className=" w-[18px] h-[18px] text-[#181818CC]" />
    </div>
  );
};

export default SearchInput;
