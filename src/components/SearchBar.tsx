
import { Search } from "lucide-react";
import UserProfile from "./UserProfile";

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-secondary/50 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <UserProfile />
    </div>
  );
};

export default SearchBar;
