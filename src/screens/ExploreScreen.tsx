import { createRef, useEffect, useState } from "react";
import useOnClickOutside from "use-onclickoutside";
import MoviesGrid from "../components/MoviesDisplay/MoviesGrid";
import { loadMovies } from "../helpers";
import { ExploreApiRespData, TmdbCategory, TmdbMovie } from "../types/common";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

const ExploreScreen = ({ movieData }: { movieData: ExploreApiRespData }): JSX.Element => {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const [tabs, setTabs] = useState<Array<{ txt: string; apiCategory: TmdbCategory; page: number }>>([
    { txt: "Popular", apiCategory: "popular", page: 2 },
    { txt: "Top Rated", apiCategory: "top_rated", page: 1 },
    { txt: "In Theatres", apiCategory: "now_playing", page: 1 },
    { txt: "Upcoming", apiCategory: "upcoming", page: 1 },
  ]);
  const [movies, setMovies] = useState<Record<string, Array<TmdbMovie>>>({
    Popular: movieData.results,
    "Top Rated": [],
    "In Theatres": [],
    Upcoming: [],
  });

  async function loadMore() {
    const moviesResp = await loadMovies(tabs[currentTabIdx].page, tabs[currentTabIdx].apiCategory);
    if (moviesResp !== null) {
      movies[tabs[currentTabIdx].txt] = movies[tabs[currentTabIdx].txt].concat(...moviesResp.results);
    }
    setMovies({ ...movies });
    tabs[currentTabIdx].page++;
    setTabs([...tabs]);
  }

  function changeTab(tabIdx: number) {
    setCurrentTabIdx(tabIdx);
  }

  return (
    <div className="w-full">
      <div className="sm:flex place-content-between">
        <h1 className="pb-6 text-2xl font-semibold text-gray-900">Explore Movies</h1>
        <div className="w-fit">
          <span className="relative z-0 inline-flex shadow-sm rounded-md mx-auto">
            {tabs.map((tab, tabIdx) => (
              <button
                key={tab.txt}
                type="button"
                className={classNames(
                  tabIdx === 0 ? "rounded-l-md" : "-ml-px",
                  tabIdx === tabs.length - 1 ? "rounded-r-md" : "",
                  tabIdx === currentTabIdx ? "bg-gray-100" : "bg-white hover:bg-gray-50",
                  "-mt-4 sm:-mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 focus:z-10 focus:outline-none focus:ring-none focus:ring-none"
                )}
                onClick={() => changeTab(tabIdx)}
                disabled={tabIdx === currentTabIdx}
              >
                {tab.txt}
              </button>
            ))}
          </span>
        </div>
      </div>

      <MoviesGrid movies={movies[tabs[currentTabIdx].txt]} loadMore={loadMore} key={currentTabIdx} />
    </div>
  );
};

export default ExploreScreen;
