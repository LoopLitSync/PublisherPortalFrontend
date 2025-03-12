import { Author } from "./Author";

export interface Book {
    isbn: string;
    title: string;
    description: string;
    publicationDate: string;
    authors: Author[];
    genres: string[];
    language: string;
    coverImg?: string | null;
    validationStatus?: string | null;
    uploadedDate: string;
  }