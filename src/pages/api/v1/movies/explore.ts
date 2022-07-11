import type { NextApiRequest, NextApiResponse } from "next";
import { ExploreApiRespData, TmdbCategory } from "../../../../types/common";
import sql from "../../../../util/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const category = req.body.category as string;
  const page = req.body.page as string;

  const categoryTypes: Array<TmdbCategory> = ["now_playing", "popular", "top_rated", "upcoming"];
  if (req.method !== "POST" || !categoryTypes.includes(req.body.category) || req.body.page <= 0) {
    return res.status(400).send("Bad Request");
  }

  const resp = await fetch(
    `https://api.themoviedb.org/3/movie/${category}?` +
      new URLSearchParams({
        api_key: process.env.TMDB_KEY as string,
        language: "en-US",
        page: page,
      }),
    {
      method: "GET",
    }
  );

  const movieData = (await resp.json()) as ExploreApiRespData;
  if (movieData.results) {
    const resultIDs: Array<string> = [];
    movieData.results.forEach(({ id }) => resultIDs.push(id.toString()));
    const likes: Array<{ imdb_id: string; likes: number }> | null = await sql`
      SELECT json_agg(json_build_object('imdb_id', imdb_id, 'likes', likes))
      FROM likes
      WHERE(
        imdb_id = ANY(${resultIDs})
      )
    `.then((sqlData) => sqlData[0].json_agg);
    movieData.results.forEach((obj) => {
      if (likes === null) {
        obj.likes = 0;
      } else {
        const locate = likes.find(({ imdb_id }) => imdb_id === obj.id.toString());
        obj.likes = locate ? locate.likes : 0;
      }
    });

    return res.status(200).json(movieData);
  } else {
    return res.status(500).send("Internal Server Error");
  }
};
