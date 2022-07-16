import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadMovies } from "../helpers";
import ExploreScreen from "../screens/ExploreScreen";
import { ExploreApiRespData } from "../types/common";

type HomeProps = {
  movieData: ExploreApiRespData;
};
const Home: NextPage<HomeProps> = (props) => {

  const router = useRouter();
  const [movieData, setMovieData] = useState<ExploreApiRespData | null>(null);

  async function loadInitialData() {
    const movieData = await loadMovies(1, "popular");
    if (movieData !== null) {
      setMovieData(movieData);
    } else {
      router.push("/500");
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [])

  if(movieData !== null) {
    return (
      <>
        <Head>
          <title>MovieMe - Movie Explorer & Journal</title>
          <meta name="description" content="MovieMe - the best movie journal and explorer." />
        </Head>
  
        <ExploreScreen movieData={movieData} />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>MovieMe - Movie Explorer & Journal</title>
          <meta name="description" content="MovieMe - the best movie journal and explorer." />
        </Head>
  
        <div className="min-h-screen w-full">
          Loading...
        </div>
      </>
    );
  }
};

export default Home;
