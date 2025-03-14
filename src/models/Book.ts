import { Author } from "./Author";

export interface Book {
    id: number;
    isbn: string;
    title: string;
    description: string;
    publicationDate: string;
    authors: Author[];
    genres: string[];
    language: string;
    coverImg?: string | null;
    submissionDate: string;
    updatedDate: string;
    validationStatus: string;
  }