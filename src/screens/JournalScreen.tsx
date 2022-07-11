import { BookOpenIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon, StarIcon } from "@heroicons/react/solid";
import { parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import EntryModal from "../components/Journal/EntryModal";
import { v4 as uuidv4 } from "uuid";
import classNames from "../helpers";

const JournalScreen = (): JSX.Element => {
  const [journalEntries, setJournalEntries] = useState<Array<{
      name: string;
      year: number;
      desc: string;
      note: string;
      rating: number;
      id?: string;
    }> | "loading" >("loading");
  const [modalErrMsg, setModalErrMsg] = useState<null | string>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [modalEditData, setModalEditData] = useState<{
    name: string;
    year: string;
    desc: string;
    note: string;
    rating: number;
    id?: string;
    entryIdx: number;
  }>();

  function getUserID(): string {
    const cookies: { userID?: string } = parseCookies();
    if (!cookies.userID) {
      const userID = uuidv4();
      setCookie(null, "userID", userID);
      return userID;
    }
    return cookies.userID;
  }

  async function addEntry(name: string | undefined, year: string | undefined, desc: string | undefined, note: string | undefined, rating: number) {
    setModalErrMsg(null);
    if (name === undefined || year === undefined || desc === undefined || note === undefined || name.length === 0 || year.length === 0 || desc.length === 0 || note.length === 0) {
      setModalErrMsg("All fields are required.");
      return;
    }
    if (year.length !== 4) {
      setModalErrMsg("Release year is invalid.");
      return;
    }

    if (journalEntries !== "loading") {
      journalEntries.push({
        name,
        year: parseInt(year),
        desc,
        note,
        rating,
      });
      setJournalEntries([...journalEntries]);
      setShowModal(false);
    } else {
      setJournalEntries([
        {
          name,
          year: parseInt(year),
          desc,
          note,
          rating,
        },
      ]);
      setShowModal(false);
    }

    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/journal?`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        year: parseInt(year),
        desc: desc,
        note: note,
        rating: rating,
        userID: getUserID(),
      }),
    });
  }

  async function editEntry(name: string | undefined, year: string | undefined, desc: string | undefined, note: string | undefined, rating: number, id: string | undefined, entryIdx: number) {
    setModalErrMsg(null);
    if (journalEntries === "loading") {
      return;
    }
    if (name === undefined || year === undefined || desc === undefined || note === undefined || name.length === 0 || year.length === 0 || desc.length === 0 || note.length === 0) {
      setModalErrMsg("All fields are required.");
      return;
    }
    if (year.length !== 4) {
      setModalErrMsg("Release year is invalid.");
      return;
    }

    journalEntries[entryIdx] = {
      name,
      year: parseInt(year),
      desc,
      note,
      rating,
      id: journalEntries[entryIdx].id,
    };

    setJournalEntries([...journalEntries]);
    setShowModal(false);

    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/journal?` +
        (id !== undefined
          ? new URLSearchParams({
              entryID: id,
              name: name,
              year: year,
              desc: desc,
              note: note,
              rating: rating.toString(),
              userID: getUserID(),
            })
          : new URLSearchParams({
              name: name,
              year: year,
              desc: desc,
              note: note,
              rating: rating.toString(),
              userID: getUserID(),
            })),
      {
        method: "PUT",
        headers: {
          Accept: "*",
        },
      }
    );
    /*
      const entryID: string | undefined = req.query.entryID ? (req.query.entryID as string) : undefined;
      const userID = req.query.userID as string;
      const name = req.query.name as string;
      const year = req.query.year as string;
      const desc = req.query.desc as string;
      const note = req.query.note as string;
      const rating = req.query.rating as string;
        */
  }

  function displayEditEntry(
    entry: {
      name: string;
      year: string | number;
      desc: string;
      note: string;
      rating: number;
      id?: string;
    },
    entryIdx: number
  ) {
    setModalMode("edit");
    setModalEditData({
      name: entry.name,
      year: entry.year.toString(),
      desc: entry.desc,
      note: entry.note,
      rating: entry.rating,
      id: entry.id,
      entryIdx: entryIdx,
    });
    setShowModal(true);
  }

  async function deleteEntry(entryId: string | undefined, movieName: string, movieIdx: number) {
    if (journalEntries === "loading") {
      return;
    }

    journalEntries.splice(movieIdx, 1);
    setJournalEntries([...journalEntries]);

    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/journal?` +
        (entryId !== undefined
          ? new URLSearchParams({
              entryID: entryId,
              movieName: movieName,
              userID: getUserID(),
            })
          : new URLSearchParams({
              movieName: movieName,
              userID: getUserID(),
            })),
      {
        method: "DELETE",
        headers: {
          Accept: "*",
        },
      }
    );
  }

  async function loadEntries() {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/v1/movies/journal?` +
        new URLSearchParams({
          userID: getUserID(),
        }),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const respData = (await resp.json()) as Array<{
      entry_id: number;
      user_id: string;
      name: string;
      year: number;
      description: string;
      note: string;
      rating: number;
    }>;

    //useState<Array<{ name: string; year: number; desc: string; note: string; rating: number, id?: string }> | "loading">("loading");
    const entriesTmp: Array<{
      name: string;
      year: number;
      desc: string;
      note: string;
      rating: number;
      id?: string;
    }> = [];
    respData.forEach((entry) => {
      entriesTmp.push({
        name: entry.name,
        year: entry.year,
        desc: entry.description,
        note: entry.note,
        rating: entry.rating,
        id: entry.entry_id.toString(),
      });
    });
    setJournalEntries(entriesTmp);
    setShowModal(false);
    setModalMode("new");
  }

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <div className="w-full h-full">
      {showModal ? (
        <EntryModal
          errorMsg={modalErrMsg}
          addEntry={addEntry}
          editEntry={editEntry}
          onClose={() => {
            setShowModal(false);
            setModalMode("new");
          }}
          mode={modalMode}
          editData={modalEditData}
        />
      ) : null}
      <div className="flex h-8 mb-6">
        <h1 className="pb-6 text-2xl font-semibold text-gray-900">Your Journal</h1>
        <button
          type="button"
          className="ml-4 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setShowModal(true)}
        >
          Add Entry
          <PlusIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {journalEntries === "loading" ? (
        <div className="mt-20 w-full h-full text-gray-500 mx-auto text-center font-light">
          <svg role="status" className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : journalEntries.length === 0 ? (
        <div className="mt-20 w-full h-full text-gray-500 mx-auto text-center font-light">
          <BookOpenIcon className="h-8 w-8 tect-gray-500 mx-auto" />
          Your journal is empty.
        </div>
      ) : (
        <ul className="space-y-3">
          {journalEntries.map((entry, idx) => (
            <div key={idx.toString() + entry.name} className="w-full h-auto bg-white rounded-lg shadow text-gray-900 p-4 space-y-1">
              <div className="md:text-xl font-bold">{entry.name}</div>
              <div className="italic font-light mt-1">
                <span className="text-gray-500">{entry.year.toString() + " - "}</span>
                {entry.desc}
              </div>
              <div>
                <span className="font-bold pt-1">Note:&nbsp;</span>
                {entry.note}
              </div>
              <div className="flex">
                <span className="font-bold">Rating:&nbsp;</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <StarIcon key={rate} className={classNames(rate <= entry.rating ? "text-yellow-400" : "text-gray-200", "h-5 w-5 flex-shrink-0")} aria-hidden="true" />
                  ))}
                </div>
              </div>
              <div className="flex place-content-end">
                <TrashIcon
                  className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    deleteEntry(entry.id, entry.name, idx);
                  }}
                />
                <PencilIcon
                  className="ml-2 w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    displayEditEntry(entry, idx);
                  }}
                />
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JournalScreen;
