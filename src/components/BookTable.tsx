import { useEffect, useState } from "react";
import { fetchPublisherBooks } from "../api/BookService";
import { Book } from "../models/Book";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date.ts";
import { useAuth } from "../AuthContext.tsx";

const BookTable = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const { publisher } = useAuth();
  
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
            <th className="p-3 border-r border-black">Description</th>
            <th className="p-3 border-r border-black">Submitted Date</th>
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
                <td className="p-3 border-r border-black">{book.description}</td>
                <td className="p-3 border-r border-black">{formatDate(book.submissionDate)}</td>
                <td className="p-3 border-r border-black">{formatDate(book.updatedDate)}</td>
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
    </div>
  );
};

export default BookTable;
