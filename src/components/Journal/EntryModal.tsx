import { Dialog, Transition } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/solid";
import { createRef, Fragment, useEffect, useState } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const EntryModal = ({
  errorMsg,
  addEntry,
  onClose,
  mode,
  editData,
  editEntry,
}: {
  errorMsg: string | null;
  addEntry: (name: string | undefined, year: string | undefined, desc: string | undefined, note: string | undefined, rating: number) => void;
  onClose: () => void;
  mode: "new" | "edit";
  editData?: {
    name: string;
    year: string;
    desc: string;
    note: string;
    rating: number;
    id?: string;
    entryIdx: number;
  };
  editEntry: (name: string | undefined, year: string | undefined, desc: string | undefined, note: string | undefined, rating: number, id: string | undefined, entryIdx: number) => void;
}): JSX.Element => {
  const [open, setOpen] = useState(true);

  const nameRef = createRef<HTMLInputElement>();
  const yearRef = createRef<HTMLInputElement>();
  const descRef = createRef<HTMLInputElement>();
  const noteRef = createRef<HTMLInputElement>();
  const [rating, setRating] = useState<number>(3);

  useEffect(() => {
    if (mode === "edit" && editData && nameRef.current && yearRef.current && descRef.current && noteRef.current) {
      nameRef.current.value = editData.name;
      yearRef.current.value = editData.year;
      descRef.current.value = editData.desc;
      noteRef.current.value = editData.note;
      setRating(editData.rating);
    }
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpen(false);
          onClose();
        }}
      >
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        {mode === "new" ? "Add Journal Entry" : "Edit Journal Entry"}
                      </Dialog.Title>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label htmlFor="movieName" className="block text-sm font-medium text-gray-700">
                            Movie Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="movieName"
                              id="movieName"
                              className={
                                mode === "new"
                                  ? "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  : "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                              }
                              placeholder="What was the movie called?"
                              disabled={mode === "edit"}
                              ref={nameRef}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                            Release Year
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="year"
                              id="year"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              ref={yearRef}
                              placeholder="When was it released?"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="description"
                              id="description"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              ref={descRef}
                              placeholder="What was it about?"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="notes"
                              id="notes"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              ref={noteRef}
                              placeholder="What did you think of it?"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="block text-sm font-medium text-gray-700">Rating</div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((rate) => (
                              <StarIcon
                                key={rate}
                                className={classNames(rate <= rating ? "text-yellow-400" : "text-gray-200", "h-5 w-5 flex-shrink-0")}
                                aria-hidden="true"
                                onClick={() => {
                                  setRating(rate);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {errorMsg === null ? null : <div className="text-red-500 text-sm py-2">{errorMsg}</div>}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      if (mode === "new" || !editData) {
                        addEntry(nameRef.current?.value, yearRef.current?.value, descRef.current?.value, noteRef.current?.value, rating);
                      } else {
                        editEntry(nameRef.current?.value, yearRef.current?.value, descRef.current?.value, noteRef.current?.value, rating, editData?.id, editData.entryIdx);
                      }
                    }}
                  >
                    {mode === "new" ? "Add Entry" : "Edit Entry"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      onClose();
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EntryModal;
