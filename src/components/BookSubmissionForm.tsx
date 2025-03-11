import React, { useState } from "react";

const BookSubmissionForm = () => {
  const [title, setTitle] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [authors, setAuthors] = useState<{ firstName: string; lastName: string }[]>([
    { firstName: "", lastName: "" },
  ]);
  const [language, setLanguage] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [publicationDate, setPublicationDate] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const handleAuthorChange = (index: number, field: "firstName" | "lastName", value: string) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index][field] = value;
    setAuthors(updatedAuthors);
  };

  const handleAddAuthor = () => {
    setAuthors([...authors, { firstName: "", lastName: "" }]);
  };

  const handleRemoveAuthor = (index: number) => {
    if (authors.length > 1) {
      const updatedAuthors = authors.filter((_, i) => i !== index);
      setAuthors(updatedAuthors);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authorsData = authors.map((author) => ({
      firstName: author.firstName,
      lastName: author.lastName,
    }));

    const bookData = {
      isbn,
      title,
      description,
      publicationDate,
      authorFirstName: authorsData[0]?.firstName || "", // Assuming first author for now
      authorLastName: authorsData[0]?.lastName || "",
      genres: [genre],
      language,
      coverImg: coverImage,
    };

    try {
      const response = await fetch("http://localhost:8081/api/v1/books", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit book");
      }

      const result = await response.json();
      console.log("Book submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Submit a Book</h2>
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
                  onChange={(e) => handleAuthorChange(index, "firstName", e.target.value)}
                  placeholder="First Name"
                  required
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={author.lastName}
                  onChange={(e) => handleAuthorChange(index, "lastName", e.target.value)}
                  placeholder="Last Name"
                  required
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAuthor(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAuthor}
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
              onChange={handleImageChange}
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
