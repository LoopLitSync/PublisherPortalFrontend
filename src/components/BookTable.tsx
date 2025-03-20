import { useEffect, useState } from "react";
import { fetchPublisherBooks } from "../api/BookService";
import { Book } from "../models/Book";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date.ts";
import { useAuth } from "../AuthContext.tsx";
import Button from "./Button.tsx";

const BookTable = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const { publisher } = useAuth();

 const formatDateWithoutTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { year: "numeric", month: "2-digit", day: "2-digit" }); 
  };

  const formatDateToYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { year: "numeric" }); 
  };
  
  useEffect(() => {
    if (publisher && publisher.id !== undefined) {
      fetchPublisherBooks(publisher.id).then(setBooks);
    }
  }, [publisher]);

  if(!publisher) {
    return <p className="text-center mt-10">Loading publisher dashboard...</p>;
  }

  return (
    <div className="p-6">
      <table className="w-full border border-black bg-white shadow-lg">
        <thead>
          <tr className="bg-[#8075FF] text-white text-left border-b border-black">
            <th className="p-3 border-r border-black">ISBN</th>
            <th className="p-3 border-r border-black">Title</th>
            <th className="p-3 border-r border-black">Author</th>
            <th className="p-3 border-r border-black">Publication Year</th>
            <th className="p-3 border-r border-black">Description</th>
            <th className="p-3 border-r border-black">Submitted</th>
            <th className="p-3 border-r border-black">Last Modified</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr key={index} 
              className="hover:bg-gray-100 border-b border-black"
              onClick={() => navigate(`/book/${book.id}`)}>
                <td className="p-3 border-r border-black">{book.isbn}</td>
                <td className="p-3 border-r border-black">{book.title}</td>
                <td className="p-3 border-r border-black">
                  {book.authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ")}
                </td>
                <td className="p-3 border-r border-black">{formatDateToYear(book.publicationDate)}</td>
                <td className="p-3 border-r border-black">
                  {book.description.length > 100 ? `${book.description.slice(0, 20)}...` : book.description}
                </td>
                <td className="p-3 border-r border-black">{formatDate(book.submissionDate)}</td>
                <td className="p-3 border-r border-black">{formatDateWithoutTime(book.updatedDate)}</td>
                <td className="p-3 border-r border-black">{book.validationStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 border-t border-gray-300">
                No books available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-5">
      <Button onClick={() => navigate("/book-submission")}>Submit New Book</Button>
      </div>
    </div>
  );
};

export default BookTable;
