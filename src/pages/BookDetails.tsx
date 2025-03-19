import Button from "../components/Button";
import statusComponents from "../components/validationStatus/StatusComponents.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book } from "../models/Book";
import { fetchBookById } from "../api/BookService";
import EditBookModal from "../components/EditBookModal.tsx";
import { formatDate } from "../utils/date.ts";
import { fetchBookVersionsByBookId, rollbackBookVersion } from "../api/BookVersionService.ts";
import { BookVersion } from "../models/BookVersion.ts";
import { Book as BookIcon } from "lucide-react";
import React from "react";
import Card from "../components/Card.tsx";
import TextTruncate from "../components/TextTruncate.tsx";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [bookVersions, setBookVersions] = useState<BookVersion[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const bookData = await fetchBookById(Number(id));
          setBook(bookData);
        } catch (err) {
          setError((err as Error).message);
        }
      };
  
      fetchBook();
    }
  }, [id]);
  

  useEffect(() => {
    if (book) {
      fetchBookVersionsByBookId(book.id).then(setBookVersions);
    }
  }, [book]);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  async function handleSave() {
    try {
      setBook(null);
      const book = await fetchBookById(Number(id));
      setBook(book);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  }

  async function onRollback(id: number, version: number) {
    try {
      await rollbackBookVersion(id, version);
      window.location.reload();
    }
    catch (error) {
      console.error("Error rolling back book version:", error);
    }
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!book) {
    return <p className="text-center mt-10">Loading book details...</p>;
  }

  const StatusComponent = statusComponents[book.validationStatus] || statusComponents["PENDING"];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-10 m-10 items-start">
        <div>
          {book.coverImg ? (
            <img className="rounded-lg w-56 h-80 object-cover" src={book.coverImg} alt={book.title} />
          ) : (
            <div className="w-56 h-80 flex items-center justify-center rounded-lg border border-gray-400 bg-gradient-to-br from-white to-[#8075FF] text-gray-700">
              <BookIcon className="size-12 text-[#8075FF]" />
            </div>
          )}
        </div>
        <Card className="flex flex-col gap-3 max-w-[1000px] w-full">
          <h1 className="text-5xl text-black">{book.title}</h1>
          <div className="flex flex-row gap-2">
            <p className="font-bold">Authors:</p>
            <p>{book.authors.map(author => `${author.firstName} ${author.lastName}`).join(", ")}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="font-bold">ISBN:</p>
            <p>{book.isbn}</p>
          </div>

          <p className="font-bold">Description:</p>
          <TextTruncate text={book.description} maxLength={500} />

          <div className="border-t border-gray-800 w-full"></div>

          <div className='flex flex-row gap-2'>
            <p className="font-bold">Language:</p>
            <p>{book.language}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <p className="font-bold">Publication date:</p>
            <p>{book.publicationDate}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <p className="font-bold">Genres:</p>
            {book.genres.map((genre, index) => (
              <p key={index}>{genre}</p>
            ))}
          </div>

          <div className="border-t border-gray-800 w-full"></div>

          <div className="flex flex-row gap-2">
            <p className="font-bold">Submitted:</p>
            <p>{formatDate(book.submissionDate)}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <p className="font-bold">Last updated:</p>
            <p>{formatDate(book.updatedDate)}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <p className="font-bold">Validation status:</p>
            <StatusComponent />
            {book.validationStatus === "NEEDS_REVISION" ? (
              <p>NEEDS REVISION</p>
            ) : (
              <p>{book.validationStatus}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsEditModalOpen(true)} text="Edit"></Button>
          </div>
        </Card>

        <EditBookModal
          book={book}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}>
        </EditBookModal>
      </div>
      <div className="flex flex-col gap-5 m-10">
        <h2 className="text-3xl text-black">History</h2>
        <table className="w-full border border-black bg-white shadow-lg">
          <thead>
            <tr className="bg-[#8075FF] text-white text-left border-b border-black">
              <th className="p-3 border-r border-black">ISBN</th>
              <th className="p-3 border-r border-black">Title</th>
              <th className="p-3 border-r border-black">Version</th>
              <th className="p-3 border-r border-black">Updated</th>
              <th className="p-3 border-r border-black">Status</th>
              <th className="p-3 border-r border-black"></th>
            </tr>
          </thead>
          <tbody>
            {bookVersions.length > 0 ? (
              bookVersions
                .sort((a, b) => b.id.version - a.id.version)
                .map((book, index) => (
                  <React.Fragment key={index}>
                    {/* Main Row */}
                    <tr
                      className="hover:bg-gray-100 border-b border-black cursor-pointer"
                      onClick={() => toggleRow(index)}
                    >
                      <td className="p-3 border-r border-black">{book.isbn}</td>
                      <td className="p-3 border-r border-black">{book.title}</td>
                      <td className="p-3 border-r border-black">{book.id.version}</td>
                      <td className="p-3 border-r border-black">{formatDate(book.updatedDate)}</td>
                      <td className="p-3 border-r border-black">{book.validationStatus}</td>
                      <td className="p-3 text-center border-black">
                        <span
                          className={`transition-transform duration-300 inline-block ${expandedRow === index ? "rotate-180" : ""
                            }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </td>

                    </tr>

                    {/* Expanded Row */}
                    {expandedRow === index && (
                      <tr className="bg-gray-50 border-b border-black">
                        <td colSpan={5} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-4 relative">
                            {/* Cover Image */}
                            {book.coverImage ? (
                              <img className="rounded-lg w-56 h-80 object-cover" src={book.coverImage} alt={book.title} />
                            ) : (
                              <div className="w-56 h-80 flex items-center justify-center rounded-lg border border-gray-400 bg-gradient-to-br from-white to-[#8075FF] text-gray-700">
                                <BookIcon className="size-12 text-[#8075FF]" />
                              </div>
                            )}

                            {/* Additional Details */}
                            <div className="flex flex-col gap-2">
                              <p><strong>Description:</strong> {book.description}</p>
                              <p><strong>Language:</strong> {book.language}</p>
                              <p><strong>Publication Date:</strong> {book.publicationDate}</p>
                              <p><strong>Genres:</strong> {book.genres.map(g => g.type).join(", ")}</p>
                              <p><strong>Authors:</strong></p>
                              <ul className="list-disc ml-6">
                                {book.authors.map(author => (
                                  <li key="">{author.firstName} {author.lastName} ({author.year})</li>
                                ))}
                              </ul>
                            </div>
                            <div className="absolute bottom-0 right-0">
                              {!book.activeVersion ? (
                                <Button text="Rollback"
                                  onClick={() => {
                                    const confirmRollback = window.confirm("Are you sure you want to rollback to this previous version?");
                                    if (confirmRollback) {
                                      onRollback(book.id.bookId, book.id.version);
                                    }
                                  }}></Button>
                              ) : (
                                <p>Current version</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 border-t border-gray-300">
                  No book versions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default BookDetails;