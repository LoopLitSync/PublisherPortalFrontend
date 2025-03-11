import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const BookBulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const acceptedFormats = {
    "text/csv": [".csv"],
    "application/json": [".json"],
    "application/xml": [".xml", ".xaml"]
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFormats
  });

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bulk Upload Books</h2>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 bg-gray-100 text-gray-500 text-center py-10 rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <p>Selected file: {selectedFile.name}</p>
        ) : (
          <p>Choose file or drag it here (CSV, JSON, XML)</p>
        )}
      </div>
    </div>
  );
};

export default BookBulkUpload;
