import Button from "../components/Button";
import statusComponents from "../components/validationStatus/StatusComponents.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book } from "../models/Book";
import { fetchBookById, updateBook } from "../api/BookService";
import EditBookModal from "../components/EditBookModal.tsx";
import { Author } from "../models/Author.ts";
import { formatDate } from "../utils/date.ts";
import { fetchBookVersionsByBookId, rollbackBookVersion } from "../api/BookVersionService.ts";
import { BookVersion } from "../models/BookVersion.ts";
import React from "react";

function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [bookVersions, setBookVersions] = useState<BookVersion[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            fetchBookById(Number(id)).then(setBook);
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

    async function handleSave(formData: { id: number, title: string; authors: Author[]; description: string; language: string; publicationDate: string; genres: string[]; }) {
        const updatedBook: Book = {
            ...book,
            ...formData,
            isbn: book?.isbn || "",
            validationStatus: book?.validationStatus || "PENDING",
            submissionDate: book?.submissionDate || "",
            updatedDate: book?.updatedDate || "",
        };
        try {
            await updateBook(updatedBook.id, updatedBook);
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
    

    if (!book) {
        return <p className="text-center mt-10">Loading book details...</p>;
    }

    const StatusComponent = statusComponents[book.validationStatus] || statusComponents["PENDING"];

    return (
        <>
            <div className="flex gap-30 m-10">
                <div>
                    {book.coverImg ? (
                        <img className="rounded-lg w-40 h-60 object-cover" src={book.coverImg} alt={book.title} />
                    ) : (
                        <div className="w-40 h-60 flex items-center justify-center bg-white text-gray-600 border border-gray-400 rounded-lg">
                            No cover available
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="text-5xl text-black">{book.title}</h1>
                    <p>{book.authors.map(author => `${author.firstName} ${author.lastName}`).join(", ")}</p>
                    <p>{book.isbn}</p>
                    <p>{book.description}</p>
                    <hr></hr>
                    <div className='flex flex-row gap-2'>
                        <p>Language:</p>
                        <p>{book.language}</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p>Publication date:</p>
                        <p>{book.publicationDate}</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p>Genres:</p>
                        {book.genres.map((genre, index) => (
                            <p key={index}>{genre}</p>
                        ))}
                    </div>
                    <hr></hr>
                    <div className="flex flex-row gap-2">
                        <p>Submitted:</p>
                        <p>{formatDate(book.submissionDate)}</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p>Last updated:</p>
                        <p>{formatDate(book.updatedDate)}</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p>Validation status:</p>
                        <StatusComponent />
                        {book.validationStatus === "NEEDS_REVISION" ? (
                            <p>NEEDS REVISION</p>
                        ) : (
                            <p>{book.validationStatus}</p>
                        )}
                    </div>
                    <Button onClick={() => setIsEditModalOpen(true)}> Edit </Button>
                </div>

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
        </tr>
      </thead>
      <tbody>
        {bookVersions.length > 0 ? (
          bookVersions.slice().reverse().map((book, index) => (
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
              </tr>

              {/* Expanded Row */}
              {expandedRow === index && (
                <tr className="bg-gray-50 border-b border-black">
                  <td colSpan={5} className="p-4">
                    <div className="flex gap-4 relative">
                      {/* Cover Image */}
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-24 h-32 object-cover border" />
                      ) : (
                        <div className="w-24 h-32 flex items-center justify-center bg-gray-200 border">
                          No Image
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
                            <Button onClick={() => onRollback(book.id.bookId, book.id.version)}>Rollback</Button>
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