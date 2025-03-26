import { Author } from "./Author";

export interface Book {
    id: number;
    isbn: string;
    title: string;
    description: string;
    publicationYear?: number | null; 
    authors: Author[];
    genres: string[];
    language: string;
    coverImg?: string | null;
    submissionDate: string;
    updatedDate: string;
    validationStatus: string;
  }