import Button from "../components/Button";
import statusComponents from "../components/validationStatus/StatusComponents.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book } from "../models/Book";
import { fetchBookById } from "../api/BookService";
import EditBookModal from "../components/EditBookModal.tsx";
import { Author } from "../models/Author.ts";

function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBookById(Number(id)).then(setBook);
        }
    }, [id]);

    async function handleSave (formData: { id: number, title: string; authors: Author[]; description: string; language: string; publicationDate: string; genres: string[]; }) {
        const updatedBook: Book = {
            ...book,
            ...formData,
            isbn: book?.isbn || "",
            validationStatus: book?.validationStatus || "PENDING",
            submissionDate: book?.submissionDate || "",
            updatedDate: book?.updatedDate || "",
        };

        // await updateBook(isbn, updatedBook);
        setBook((prev => ({...prev, ...updatedBook})));
    }

    if (!book) {
        return <p className="text-center mt-10">Loading book details...</p>;
    }

    const StatusComponent = statusComponents[book.validationStatus] || statusComponents["PENDING"];

    return (
        <div className="flex gap-20 m-10">
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
                <div className='flex flex-row gap-2'>
                    <p>Validation status:</p>
                    <StatusComponent />
                    {book.validationStatus === "NEEDS_REVISION" ? (
                        <p>NEEDS REVISION</p>
                    ) : (
                        <p>{book.validationStatus}</p>
                    )} 
                </div>
                <Button onClick={() => setIsEditModalOpen(true)} text="Edit"></Button>
            </div>
            <EditBookModal
                book={book}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}>
            </EditBookModal>
        </div>
    )
}

export default BookDetails;