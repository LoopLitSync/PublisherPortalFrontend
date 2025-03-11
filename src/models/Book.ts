export interface Book {
    isbn: string;
    title: string;
    description: string;
    publicationDate: string;
    authorFirstName: string;
    authorLastName: string;
    genres: string[];
    language: string;
    coverImg?: string | null;
    validationStatus?: string | null;
    uploadedDate: string;
  }