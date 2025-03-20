import keycloak from "../keycloak";
import { Book } from "../models/Book";

const API_URL = "http://localhost:8081/api/v1/books";

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch books");
    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const fetchPublisherBooks = async (publisherId: number): Promise<Book[]> => {
  try {
    const response = await fetch(API_URL + `/publisher/${publisherId}`);
    if (!response.ok) throw new Error("Failed to fetch books");
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export const submitBook = async (bookData: Partial<Book>, coverFile: File | null) => {
  const formData = new FormData();
  formData.append('bookCreateDTO', new Blob([JSON.stringify(bookData)], { type: "application/json" }));

  if (coverFile) {
    const imageBlob = new Blob([coverFile], { type: coverFile.type || "image/jpeg" });
    formData.append('file', imageBlob, coverFile.name);
  }

  try {
    const token = keycloak.token;
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData, 
      headers: {
        "Accept": "application/json", 
        "Authorization": `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error submitting book:', response.status, errorText);
      throw new Error(errorText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting book:', error);
    throw new Error('Failed to submit book');
  }
};

export const fetchBookById = async (id: number): Promise<Book> => {
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${keycloak.token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You are not authorized to view this book.");
      }
      if (response.status === 404) {
        throw new Error("Book not found.");
      }
      throw new Error(`Failed to fetch book details. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching book:", error);
    throw error;
  }
};


export const fetchLanguages = async (): Promise<string[]> => {
  const response = await fetch(API_URL + "/languages");
  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }
  return response.json();
};

export const fetchGenres = async (): Promise<string[]> => {
  const response = await fetch(API_URL + "/genres");
  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }
  return response.json();
};

export const updateBook = async (id: number, bookData: Partial<Book>, coverFile?: File | null): Promise<void> => {
  const formData = new FormData();
  formData.append('bookUpdateDTO', new Blob([JSON.stringify(bookData)], { type: "application/json" }));

  if (coverFile) {
    const imageBlob = new Blob([coverFile], { type: coverFile.type || "image/jpeg" });
    formData.append('file', imageBlob, coverFile.name);
  }

  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        "Authorization": `Bearer ${keycloak.token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error updating book:", response.status, errorText);
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Error updating book:", error);
    throw new Error("Failed to update book");
  }
};

