import { useEffect, useState } from "react";

interface Book {
  isbn: string;
  title: string;
  description: string;
  publicationDate: string;
  authorFirstName: string;
  authorLastName: string;
  genres: string[];
  language: string;
  coverImg: string | null;
}

const BookTable = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/v1/books")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch books");
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <table className="w-full border bg-white border-gray-400 shadow-lg">
        <thead>
          <tr className="bg-[#8075FF] text-white text-left border-b border-gray-400">
            <th className="p-3 border-r border-black">ISBN</th>
            <th className="p-3 border-r border-black">Title</th>
            <th className="p-3 border-r border-black">Description</th>
            <th className="p-3 border-r border-black">Submitted Date</th>
            <th className="p-3 border-r border-black">Language</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                <td className="p-3 border-r border-black underline">{book.isbn}</td>
                <td className="p-3 border-r border-black">{book.title}</td>
                <td className="p-3 border-r border-black">{book.description}</td>
                <td className="p-3 border-r border-black">{book.publicationDate}</td>
                <td className="p-3 border-r border-black">{book.language}</td>
                <td className="p-3"></td> 
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center p-4 border-t border-gray-300">
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