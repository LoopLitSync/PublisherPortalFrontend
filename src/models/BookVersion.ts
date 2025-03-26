import { Author } from "./Author";
import { Genre } from "./Genre";

export interface BookVersion {
    id: {
        bookId: number;
        version: number;
    };
    isbn: string;
    title: string;
    description: string;
    validationStatus: string;
    updatedDate: string;
    publicationYear: number;
    language: string;
    coverImage: string | null;
    activeVersion: boolean;
    authors: Author[];
    genres: Genre[];
};
