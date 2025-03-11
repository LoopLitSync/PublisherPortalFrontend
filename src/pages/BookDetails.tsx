import Button from "../components/Button";
import Pending from "../components/Pending";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book } from "../models/Book";
import { fetchBookByIsbn } from "../api/BookService";

function BookDetails() {
    const { isbn } = useParams();
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        if (isbn) {
            fetchBookByIsbn(isbn).then(setBook);
        }
    }, [isbn]);

    if (!book) {
        return <p className="text-center mt-10">Loading book details...</p>;
    }

    return (
        <div className="flex gap-20 m-10">
            <div>
            <img className="rounded-lg" src={book.coverImg || "default_book.webp"} alt={book.title} />
            </div>
            <div className="flex flex-col gap-5">
                <h1 className="text-5xl text-black">{book.title}</h1>
                <p>{book.authorFirstName} {book.authorLastName}</p>
                <p>{book.isbn}</p>
                <p>{book.description}</p>
                <hr></hr>
                <div className='flex flex-row gap-2'>
                    <p>Language:</p>
                    <p>{book.language}</p>
                </div>
                <div className='flex flex-row gap-2'>
                    <p>Publication date:</p>
                    <p></p>
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
                    <Pending></Pending>
                    <p>{}</p>
                </div>
                <Button text="Edit"></Button>
            </div>
        </div>
    )
}

export default BookDetails;