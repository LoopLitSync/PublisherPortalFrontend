import { Author } from "../models/Author";

export interface FormData {
    title: string;
    authors: Author[];
    description: string;
    language: string;
    publicationDate: string;
    genres: string[]; 
}

export interface Errors {
    title: string;
    authors: string;
    description: string;
    language: string;
    publicationDate: string;
    genres: string;
}

export function validateForm(formData: FormData): { isValid: boolean; errors: Errors } {
    const errors: Errors = {
        title: "",
        authors: "",
        description: "",
        language: "",
        publicationDate: "",
        genres: "",
    };

    let isValid = true;

    if (!formData.title) {
        errors.title = "Title is required";
        isValid = false;
    }

    if (!formData.authors) {
        errors.authors = "Author is required";
        isValid = false;
    }

    if (!formData.description) {
        errors.description = "Description is required";
        isValid = false;
    }

    if (!formData.language) {
        errors.language = "Language is required";
        isValid = false;
    }

    if (!formData.publicationDate) {
        errors.publicationDate = "Publication date is required";
        isValid = false;
    }

    if (formData.genres.length === 0) {
        errors.genres = "At least one genre must be selected";
        isValid = false;
    }

    return { isValid, errors };
}