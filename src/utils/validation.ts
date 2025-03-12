export interface FormData {
    title: string;
    authorFirstName: string;
    authorLastName: string;
    description: string;
    language: string;
    publicationDate: string;
    genres: string; 
}

export interface Errors {
    title: string;
    authorFirstName: string;
    authorLastName: string;
    description: string;
    language: string;
    publicationDate: string;
    genres: string;
}

export function validateForm(formData: FormData): { isValid: boolean; errors: Errors } {
    const errors: Errors = {
        title: "",
        authorFirstName: "",
        authorLastName: "",
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

    if (!formData.authorFirstName) {
        errors.authorFirstName = "Author first name is required";
        isValid = false;
    }

    if (!formData.authorLastName) {
        errors.authorLastName = "Author last name is required";
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

    if (!formData.genres) {
        errors.genres = "Genres are required";
        isValid = false;
    }

    return { isValid, errors };
}