import { useEffect, useState } from "react";
import { fetchBooksByQuery, fetchPublisherBooks } from "../api/BookService";
import { Book } from "../models/Book";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date.ts";
import { useAuth } from "../AuthContext.tsx";
import Button from "./Button.tsx";
import { FaExclamationTriangle } from 'react-icons/fa'; 


const BookTable: React.FC<{ searchQuery: string}> = ({ searchQuery }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0); 
  const [validationStatus, setValidationStatus] = useState<string>("ALL"); 
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const { publisher } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [genres, setGenres] = useState<string[]>([]); // State to hold the available genres
  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/v1/books/genres');
        if (response.ok) {
          const data = await response.json();
          setGenres(data); // Set the fetched genres
        } else {
          console.error('Failed to fetch genres');
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []); // Empty dependency array means this runs only once when the component mounts

  useEffect(() => {
    if (publisher && publisher.id !== undefined) {
      if (searchQuery.trim() === "") {
        fetchPublisherBooks(publisher.id, 0, 1000, "ALL", selectedGenre !== "ALL" ? selectedGenre : undefined)
          .then(({ books }) => {
            setAllBooks(books);
            setTotalPages(Math.ceil(books.length / 500));
          });
      } else {
        fetchBooksByQuery(searchQuery).then(setAllBooks);
      }
    }
  }, [publisher, searchQuery, selectedGenre]); 
  
  useEffect(() => {
    setBooks(
      allBooks
        .filter((book) => validationStatus === "ALL" || book.validationStatus === validationStatus)
        .slice(0, 500)
    );
  }, [validationStatus, allBooks]); 
  

  const handleValidationStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValidationStatus(e.target.value);
    setCurrentPage(0); 
  };

  const handleSort = (column: keyof Book) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    const sortedBooks = [...allBooks].sort((a, b) => {
      const aValue = a[column] as string;
      const bValue = b[column] as string;
      if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
      return 0;
    });
    setAllBooks(sortedBooks);
    setCurrentPage(0);
  };

  if (!publisher) {
    return <p className="text-center mt-10">Loading publisher dashboard...</p>;
  }

  const approvedCount = allBooks.filter(book => book.validationStatus === "APPROVED").length;
  const needsRevisionCount = allBooks.filter(book => book.validationStatus === "NEEDS_REVISION").length;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <div>
          <label htmlFor="validationStatus" className="mr-2">Filter by Validation Status:</label>
          <select 
            id="validationStatus"
            value={validationStatus}
            onChange={handleValidationStatusChange}
          >
            <option value="ALL">All</option>
            <option value="NEEDS_REVISION">Needs revision</option>
          </select>
        </div>
        <div className="text-right font-semibold">
        Approved: {approvedCount} |{" "}
        <span className={needsRevisionCount > 0 ? "text-red-500" : ""}>
          Needs Revision: {needsRevisionCount}
        </span>
      </div>

        <div>
          <label htmlFor="genreFilter" className="mr-2">Filter by Genre:</label>
          <select 
            id="genreFilter"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="ALL">All</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-black bg-white shadow-lg table-fixed">
          <thead>
            <tr className="bg-[#8075FF] text-white text-left border-b border-black">
              {["isbn", "title", "authors", "publicationYear", "description", "submissionDate", "updatedDate", "validationStatus"].map((col) => (
                <th
                  key={col}
                  className="p-3 border-r border-black cursor-pointer"
                  onClick={() => handleSort(col as keyof Book)}
                >
                  {col.toUpperCase()} {sortColumn === col && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b border-black" onClick={() => navigate(`/book/${book.id}`)}>
                  <td className="p-3 border-r border-black truncate">{book.isbn}</td>
                  <td className="p-3 border-r border-black truncate">{book.title}</td>
                  <td className="p-3 border-r border-black truncate">
                    {book.authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ")}
                  </td>
                  <td className="p-3 border-r border-black truncate">{book.publicationYear}</td>
                  <td className="p-3 border-r border-black truncate">
                    {book.description.length > 0 ? (
                      book.description.length > 100 ? `${book.description.slice(0, 20)}...` : book.description
                    ) : (
                      <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-2" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-r border-black truncate">{formatDate(book.submissionDate)}</td>
                  <td className="p-3 border-r border-black truncate">{formatDate(book.updatedDate)}</td>
                  <td className="p-3 border-r border-black truncate relative group cursor-pointer">
                    {book.validationStatus === "NEEDS_REVISION" ? (
                      <div className="text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        Needs revision
                      </div>
                    ) : (
                      "Approved"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4 border-t border-gray-300">
                  No books available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-5">
        <button 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Previous
        </button>

        <button 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Next
        </button>
      </div>

      <div className="flex justify-end mt-5">
        <Button onClick={() => navigate("/book-submission")}>Submit New Book</Button>
      </div>
    </div>
  );
};

export default BookTable;
