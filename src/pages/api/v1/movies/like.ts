import type { NextApiRequest, NextApiResponse } from "next";
import sql from "../../../../util/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const imdbID = req.body.imdbID;
  const action = req.body.action;
  if (req.method !== "POST" || imdbID === undefined || imdbID === null || typeof imdbID !== "string" || imdbID.length === 0 || (action !== "like" && action !== "unlike")) {
    return res.status(400).send("Bad Request");
  }

  if (action === "like") {
    const update = await sql`
      UPDATE likes
      SET likes = likes + 1
      WHERE imdb_id=${imdbID}
      RETURNING imdb_id
    `;
    if (update.length === 0) {
      await sql`
        INSERT INTO likes(imdb_id, likes)
        VALUES(${imdbID}, 1)
      `;
    }
  } else {
    await sql`
      UPDATE likes
      SET likes = likes - 1
      WHERE imdb_id=${imdbID}
      RETURNING imdb_id
    `;
  }

  return res.status(200).send("OK");
};
