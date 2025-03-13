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

export const fetchBookById = async (id: number): Promise<Book> => {
  const response = await fetch(API_URL + `/${id}`);
  if (!response.ok) {
      throw new Error("Failed to fetch book details");
  }
  return response.json();
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
