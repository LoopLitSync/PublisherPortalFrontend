import React, { useState } from "react";
import { submitBook } from "../api/BookService";
import { Book } from "../models/Book";

const BookSubmissionForm = () => {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [authors, setAuthors] = useState<{ firstName: string; lastName: string }[]>([
    { firstName: "", lastName: "" },
  ]);
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookData: Partial<Book> = {
      isbn,
      title,
      description,
      publicationDate,
      authorFirstName: authors[0]?.firstName || "",
      authorLastName: authors[0]?.lastName || "",
      genres: [genre],
      language,
      coverImg: coverImage,
    };

    const resetForm = () => {
        setTitle("");
        setIsbn("");
        setAuthors([{ firstName: "", lastName: "" }]);
        setLanguage("");
        setGenre("");
        setPublicationDate("");
        setCoverImage(null);
        setDescription("");
      };

    try {
        const result = await submitBook(bookData);
        if (result) {
          setMessage("Book submitted successfully!");
          resetForm();
        } else {
          setMessage("Failed to submit the book. Please try again.");
        }
      } catch {
        setMessage("An error occurred while submitting the book.");
      }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Submit a Book</h2>
      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Authors</label>
            {authors.map((author, index) => (
              <div key={index} className="flex space-x-4 mb-2">
                <input
                  type="text"
                  value={author.firstName}
                  onChange={(e) =>
                    setAuthors((prev) =>
                      prev.map((a, i) =>
                        i === index ? { ...a, firstName: e.target.value } : a
                      )
                    )
                  }
                  placeholder="First Name"
                  required
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={author.lastName}
                  onChange={(e) =>
                    setAuthors((prev) =>
                      prev.map((a, i) =>
                        i === index ? { ...a, lastName: e.target.value } : a
                      )
                    )
                  }
                  placeholder="Last Name"
                  required
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setAuthors((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAuthors((prev) => [...prev, { firstName: "", lastName: "" }])}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Add Author
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Publication Date</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCoverImage(URL.createObjectURL(file));
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {coverImage && (
              <div className="mt-2">
                <img src={coverImage} alt="Cover preview" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Submit Book
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookSubmissionForm;
