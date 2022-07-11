import type { NextApiRequest, NextApiResponse } from "next";
import { searchMovies } from "../../../../helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const searchTerm = req.body.term;
  if (req.method !== "POST" || searchTerm === undefined || searchTerm === null || typeof searchTerm !== "string" || searchTerm.length <= 1) {
    return res.status(400).send("Bad Request");
  }

  const results = await searchMovies(searchTerm);

  return res.status(200).json(results);
};
