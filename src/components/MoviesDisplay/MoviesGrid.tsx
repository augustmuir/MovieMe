import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import Image from "next/image";
import { TmdbMovie } from "../../types/common";
import InfiniteScroll from "react-infinite-scroller";
import { parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";

const MoviesGrid = ({ movies, loadMore }: { movies: Array<TmdbMovie>; loadMore: (page: number) => void }): JSX.Element => {
  const [likedMovies, setLikedMovies] = useState<Array<string>>([]);

  async function likeMovie(imdbID: string) {
    const cookies = parseCookies();
    const newLikedMovies = cookies["likedMovies"] ? JSON.parse(cookies["likedMovies"]).concat(imdbID) : [imdbID];
    setLikedMovies(newLikedMovies);
    setCookie(null, "likedMovies", JSON.stringify(newLikedMovies));
    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/like`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imdbID: imdbID,
        action: "like",
      }),
    });
  }

  async function unlikeMovie(imdbID: string) {
    const cookies = parseCookies();
    const newLikedMovies = JSON.parse(cookies["likedMovies"]);
    newLikedMovies.splice(newLikedMovies.indexOf(imdbID), 1);
    setLikedMovies([...newLikedMovies]);
    setCookie(null, "likedMovies", JSON.stringify(newLikedMovies));
    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/like`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imdbID: imdbID,
        action: "unlike",
      }),
    });
  }

  useEffect(() => {
    const cookies: { likedMovies?: string } = parseCookies();
    setLikedMovies(cookies["likedMovies"] ? JSON.parse(cookies["likedMovies"]) : []);
  }, []);

  return (
    <div className="w-full h-full">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={true}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4 sm:mt-0">
          {movies.map((movie, movieIdx) => (
            <li key={movie.id + movieIdx} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 h-44 max-h-44 sm:my-4">
              <div className="w-full h-36 flex items-center justify-between px-2 py-2">
                <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={100} height={150} className="rounded-lg" />
                <div className="w-full h-full pl-2 text-sm overflow-y-none">
                  <div className="w-full font-medium text-center">{movie.title}</div>
                  <div className="italic font-light text-gray-400 text-center">{movie.release_date}</div>
                  <p className="italic font-light text-gray-400 text-center line-clamp-3 mt-2">{movie.overview}</p>
                </div>
              </div>
              {likedMovies.includes(movie.id.toString()) ? (
                <button className="w-full flex justify-center h-8 bg-white rounded-b-md pt-0.5 group" onClick={() => unlikeMovie(movie.id.toString())}>
                  <HeartIconSolid className="w-5 h-5 text-red-500 mt-1" />
                  <span className="text-gray-600 text-sm self-center ml-1">{movie.likes}</span>
                </button>
              ) : (
                <button className="w-full flex justify-center h-8 bg-white rounded-b-md pt-0.5 group" onClick={() => likeMovie(movie.id.toString())}>
                  <HeartIcon className="w-5 h-5 text-gray-500 mt-1 group-hover:text-red-500" />
                  <span className="text-gray-600 text-sm self-center ml-1">{movie.likes}</span>
                </button>
              )}
            </li>
          ))}
          {/* Each search result should display poster, title, year of release and a button */}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default MoviesGrid;
