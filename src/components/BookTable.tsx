import { useEffect, useState } from "react";
import { fetchBooks } from "../api/BookService";
import { Book } from "../models/Book";

const BookTable = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks().then(setBooks);
  }, []);

  return (
    <div className="p-6">
      <table className="w-full border border-gray-400 bg-white shadow-lg">
        <thead>
          <tr className="bg-[#8075FF] text-white text-left border-b border-gray-400">
            <th className="p-3 border-r border-gray-300">ISBN</th>
            <th className="p-3 border-r border-gray-300">Title</th>
            <th className="p-3 border-r border-gray-300">Description</th>
            <th className="p-3 border-r border-gray-300">Submitted Date</th>
            <th className="p-3 border-r border-gray-300">Last Modified</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                <td className="p-3 border-r border-gray-300">{book.isbn}</td>
                <td className="p-3 border-r border-gray-300">{book.title}</td>
                <td className="p-3 border-r border-gray-300">{book.description}</td>
                <td className="p-3 border-r border-gray-300">{book.publicationDate}</td>
                <td className="p-3 border-r border-gray-300">-</td>
                <td className="p-3">-</td>
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
