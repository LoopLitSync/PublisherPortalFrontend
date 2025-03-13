export interface Book {
    id: number;
    isbn: string;
    title: string;
    description: string;
    publicationDate: string;
    authorFirstName: string;
    authorLastName: string;
    genres: string[];
    language: string;
    coverImg?: string | null;
    submissionDate: string;
    updatedDate: string;
    validationStatus: string;
  }