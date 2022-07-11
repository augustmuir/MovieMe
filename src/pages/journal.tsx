import type { NextPage } from "next";
import Head from "next/head";
import JournalScreen from "../screens/JournalScreen";

const Journal: NextPage = () => {
  return (
    <>
      <Head>
        <title>Movie Journal - MovieMe</title>
        <meta name="description" content="The #1 movie exploration and journaling platform." />
      </Head>

      <JournalScreen />
    </>
  );
};

export default Journal;
