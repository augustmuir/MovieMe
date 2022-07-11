import type { NextApiRequest, NextApiResponse } from "next";
import sql from "../../../../util/db";

async function addJournalEntry(req: NextApiRequest, res: NextApiResponse) {
  const name = req.body.name;
  const year = req.body.year;
  const desc = req.body.desc;
  const note = req.body.note;
  const rating = req.body.rating;
  const userID = req.body.userID;

  [name, desc, note, userID].forEach((val) => {
    if (typeof val !== "string" || val.length === 0) {
      return res.status(400).send("Bad Request");
    }
  });
  [year, rating].forEach((val) => {
    if (typeof val !== "number") {
      return res.status(400).send("Bad Request");
    }
  });

  await sql`
    INSERT INTO journal_entries(user_id, name, year, description, note, rating)
    VALUES(${userID}, ${name}, ${year}, ${desc}, ${note}, ${rating})
  `;

  return res.status(200).send("OK");
}

async function editJournalEntry(req: NextApiRequest, res: NextApiResponse) {
  const entryID: string | undefined = req.query.entryID ? (req.query.entryID as string) : undefined;
  const userID = req.query.userID as string;
  const name = req.query.name as string;
  const year = req.query.year as string;
  const desc = req.query.desc as string;
  const note = req.query.note as string;
  const rating = req.query.rating as string;

  [name, year, desc, note, rating].forEach((val) => {
    if (typeof val !== "string" || val.length === 0) {
      return res.status(400).send("Bad Request");
    }
  });

  if (entryID === undefined) {
    //(user_id, name, year, description, note, rating)
    await sql`
      UPDATE journal_entries
      SET
        name=${name},
        year=${year},
        description=${desc},
        note=${note},
        rating=${rating}
      WHERE
        name=${name}
        AND
        user_id=${userID}
    `;
  } else {
    await sql`
      UPDATE journal_entries
      SET
        name=${name},
        year=${year},
        description=${desc},
        note=${note},
        rating=${rating}
      WHERE
        entry_id=${entryID}
        AND
        user_id=${userID}
    `;
  }

  return res.status(200).send("OK");
}

async function deleteJournalEntry(req: NextApiRequest, res: NextApiResponse) {
  const entryID: string | undefined = req.query.entryID ? (req.query.entryID as string) : undefined;
  const userID = req.query.userID as string;
  const movieName = req.query.movieName as string;

  [movieName, userID].forEach((val) => {
    if (typeof val !== "string" || val.length === 0) {
      return res.status(400).send("Bad Request");
    }
  });
  if (entryID === undefined) {
    await sql`
      DELETE from journal_entries
      WHERE(
        user_id=${userID}
        AND
        name=${movieName}
      )
    `;
  } else {
    await sql`
      DELETE from journal_entries
      WHERE(
        user_id=${userID}
        AND
        entry_id=${entryID}
      )
    `;
  }

  return res.status(200).send("OK");
}

async function getJournalEntries(req: NextApiRequest, res: NextApiResponse) {
  const { userID } = req.query;
  if (typeof userID !== "string" || userID.length < 10) {
    return res.status(400).send("Bad Request");
  }

  const entries = await sql`
    SELECT * FROM journal_entries
    WHERE user_id=${userID}
  `;

  return res.status(200).json(entries);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await addJournalEntry(req, res);
  }
  if (req.method === "PUT") {
    return await editJournalEntry(req, res);
  }
  if (req.method === "GET") {
    return await getJournalEntries(req, res);
  }
  if (req.method === "DELETE") {
    return await deleteJournalEntry(req, res);
  }
};
