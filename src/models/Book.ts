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
    updatedDate: string;
    validationStatus: string;
  }