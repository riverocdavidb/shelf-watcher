
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MovementSearchBarProps {
  search: string;
  setSearch: (search: string) => void;
}

const MovementSearchBar: React.FC<MovementSearchBarProps> = ({ search, setSearch }) => {
  return (
    <div className="relative">
      <Input
        className="pl-8 w-full md:w-[260px] bg-muted"
        placeholder="Search movement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Search className="absolute left-2 top-2.5 text-muted-foreground h-4 w-4" />
    </div>
  );
};

export default MovementSearchBar;
