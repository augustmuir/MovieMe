import type { NextPage } from "next";
import Head from "next/head";
import { loadMovies } from "../helpers";
import ExploreScreen from "../screens/ExploreScreen";
import { ExploreApiRespData } from "../types/common";

type HomeProps = {
  movieData: ExploreApiRespData;
};
const Home: NextPage<HomeProps> = (props) => {
  return (
    <>
      <Head>
        <title>MovieMe - Movie Explorer & Journal</title>
        <meta name="description" content="MovieMe - the best movie journal and explorer." />
      </Head>

      <ExploreScreen movieData={props.movieData} />
    </>
  );
};

export async function getServerSideProps() {
  const movieData = await loadMovies(1, "popular");
  if (movieData !== null) {
    return {
      props: {
        movieData: movieData,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/500",
      },
    };
  }
}

export default Home;
