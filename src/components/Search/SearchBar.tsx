import { Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { createRef, Dispatch, Fragment, SetStateAction, useState } from "react";
import { OmdbMovie } from "../../types/common";
import Image from "next/image";
import { XCircleIcon } from "@heroicons/react/outline";

const SearchBar = ({ showResults, setShowResults }: { showResults: boolean; setShowResults: Dispatch<SetStateAction<boolean>> }): JSX.Element => {
  const searchRef = createRef<HTMLInputElement>();
  const [searchResults, setSearchResults] = useState<Array<OmdbMovie>>([]);

  async function search() {
    if (!searchRef.current || searchRef.current.value.length <= 1) {
      setSearchResults([]);
      searchRef.current?.focus();
      return;
    }
    const searchTerm = searchRef.current.value;
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/search`, {
      body: JSON.stringify({
        term: searchTerm,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    try {
      const results = (await req.json()) as Array<OmdbMovie>;
      setSearchResults(results.slice(0, results.length > 6 ? 6 : results.length));
      setShowResults(true);
      searchRef.current.focus();
    } catch (e) {
      console.error("Search error");
      return;
    }
  }

  return (
    <div className="w-full flex md:ml-0">
      <label htmlFor="search-field" className="sr-only">
        Search by Movie or Actor
      </label>
      <div className="relative w-full h-full text-gray-400 focus-within:text-gray-600">
        <div className="relative h-full">
          <div className="w-full h-full">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
              id="search-field"
              className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
              placeholder="Search"
              type="search"
              name="search"
              ref={searchRef}
              autoFocus
              onChange={() => {
                search();
              }}
            />
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            show={searchResults.length > 0 && showResults === true}
            afterEnter={() => {
              if (searchRef.current) {
                searchRef.current.focus();
              }
            }}
            afterLeave={() => {
              if (searchRef.current) {
                searchRef.current.focus();
              }
            }}
          >
            {searchResults.length === 0 ? (
              <div>&nbsp;</div>
            ) : (
              <div className="origin-top-left -0 mt-2 w-full rounded-md shadow-2xl py-1 bg-gray-50 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="pb-2 text-lg font-semibold text-gray-900">Search Results</div>
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4 sm:mt-0">
                  {searchResults.map((result) => (
                    <li key={result.imdbID} className="col-span-1 bg-white rounded-lg shadow drop-shadow-md divide-y divide-gray-200 h-32 max-h-32 mb-1">
                      <div className="w-full h-32 flex items-center justify-between px-2 py-2">
                        {result.Poster === "N/A" ? (
                          <div
                            style={{
                              width: 100,
                              height: 110,
                            }}
                            className="rounded-lg border border-gray-200"
                          >
                            <XCircleIcon className="h-4 w-4 text-gray-200 mx-auto mt-9" />
                            <p className="text-xs font-light text-gray-200 text-center mt-1">No Poster</p>
                          </div>
                        ) : (
                          <Image src={result.Poster} width={100} height={150} className="rounded-lg" />
                        )}
                        <div className="w-full h-full pl-2 text-sm overflow-y-none flex flex-col justify-center items-center">
                          <div className="w-full font-medium text-center">{result.Title}</div>
                          <div className="italic font-light text-gray-400 text-center">{result.Year}</div>
                          <p className="italic font-light text-gray-400 text-center line-clamp-3 mt-2">{result.Plot}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
