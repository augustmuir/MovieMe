import { ExploreApiRespData, OmdbMovie, TmdbCategory } from "./types/common";

export async function loadMovies(page: number, apiCategory: TmdbCategory): Promise<ExploreApiRespData | null> {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/explore`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: apiCategory,
      page: page.toString(),
    }),
  });
  if (resp.status === 200) {
    const returnData = (await resp.json()) as ExploreApiRespData;

    return returnData as ExploreApiRespData;
  } else {
    return null;
  }
}

export async function searchMovies(term: string) {
  const resp = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&` +
      new URLSearchParams({
        plot: "short",
        type: "movie",
        page: "1",
        r: "json",
        s: term,
      }),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (resp.status === 200) {
    return (await resp.json())["Search"] as Array<OmdbMovie>;
  } else {
    return [];
  }
}

export default function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}
