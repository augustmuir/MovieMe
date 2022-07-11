import { MenuAlt2Icon } from "@heroicons/react/outline";
import { Dispatch, SetStateAction } from "react";
import SearchBar from "../Search/SearchBar";

const TopBar = ({
  setSideBarOpen,
  showResults,
  setShowResults,
}: {
  setSideBarOpen: Dispatch<SetStateAction<boolean>>;
  showResults: boolean;
  setShowResults: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={() => setSideBarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <SearchBar showResults={showResults} setShowResults={setShowResults} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
