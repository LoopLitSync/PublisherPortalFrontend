import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Book } from "../models/Book";
import { submitBooks } from "../api/BookService";

const BookBulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Book[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateBooks = (books: Book[]) => {
    const errors: string[] = [];
    const isbnSet = new Set();

    //Validering, kan legge til mer etterhvert
    books.forEach((book, index) => {
      if (!book.isbn) errors.push(`Row ${index + 1}: Missing ISBN`);
      if (!book.title) errors.push(`Row ${index + 1}: Missing Title`);
      if (!book.publicationDate) errors.push(`Row ${index + 1}: Missing Publication Date`);
      if (book.isbn && !/^\d{3}\d{10}$/.test(book.isbn)) {
        errors.push(`Row ${index + 1}: Invalid ISBN format (Expected: 978XXXXXXXXXX)`);
      }
      if (isbnSet.has(book.isbn)) {
        errors.push(`Row ${index + 1}: Duplicate ISBN detected`);
      } else {
        isbnSet.add(book.isbn);
      }
    });

    setValidationErrors(errors);
  };

  const handleSubmit = async () => {
    try {
        const report = await submitBooks(selectedFile);
        alert("Bulk upload complete: " + report);
    } catch{
        alert("Error uploading books");
    }
};
  
  // går gjennom fila kun json
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;
      const jsonData = JSON.parse(event.target.result as string);
      const parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
      setPreviewData(parsedData.slice(0, 5));  // viser kun 5 bøker fra rapport, vet ikke om vi vil vise bøker her eller om det bare skal være i rapporten
      validateBooks(parsedData);
    };
    reader.readAsText(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Bulk Upload Books</h2>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 bg-gray-100 text-gray-500 text-center py-10 rounded-lg cursor-pointer">
        <input {...getInputProps()} />
        <p>{selectedFile ? `Selected file: ${selectedFile.name}` : "Choose file or drag it here (JSON only)"}</p>
      </div>
      {previewData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Preview</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-purple-500 text-white">
                <th className="border border-gray-300 px-4 py-2">ISBN</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Publication Date</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((book, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{book.isbn}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.publicationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 borde text-red-700 rounded">
          <h3 className="font-semibold mb-2">Validation Errors:</h3>
          <ul className="list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
       {validationErrors.length === 0 && previewData.length > 0 && (
                <button 
                    onClick={handleSubmit} // Use handleSubmit instead of submitBooks
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Submit Books
                </button>
            )}
    </div>
  );
};

export default BookBulkUpload;
