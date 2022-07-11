import { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const LayoutWrapper = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  return (
    <div className="min-h-screenh-full bg-gray-100">
      <div
        className="min-h-screen h-full"
        onClick={() => {
          if (showResults) {
            setShowResults(false);
          }
        }}
      >
        {/* SideBar */}
        <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

        <div className="md:pl-64 flex flex-col flex-1">
          {/* Search & Mobile Hamburger Container */}
          <TopBar setSideBarOpen={setSideBarOpen} showResults={showResults} setShowResults={setShowResults} />

          {/* Main Content Container */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
