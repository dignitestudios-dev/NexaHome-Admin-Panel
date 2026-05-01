import { Search } from "lucide-react";
import { SearchInputUI } from "../ui/search-input-ui";

type SearchInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search",
}: SearchInputProps) => {
  return (
    <div className="w-[300px] bg-white rounded-[22px] h-[44px] px-4 flex items-center justify-between gap-2">
      <SearchInputUI
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
      <Search className="w-[18px] h-[18px] text-[#181818CC]" />
    </div>
  );
};

export default SearchInput;
