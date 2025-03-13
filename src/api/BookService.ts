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

export const submitBook = async (bookData: Partial<Book>): Promise<Book | null> => {
  console.log(bookData)
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) throw new Error("Failed to submit book");
    return await response.json();
  } catch (error) {
    console.error("Error submitting book:", error);
    return null;
  }
};

export const fetchGenres = async (): Promise<string[]> => {
  try {
    const response = await fetch(API_URL + "/genres");
    if (!response.ok) throw new Error("Failed to fetch genres");
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const fetchLanguages = async (): Promise<string[]> => {
  try {
    const response = await fetch(API_URL + "/languages");
    if (!response.ok) throw new Error("Failed to fetch genres");
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};


export const fetchBookByIsbn = async (isbn: string): Promise<Book> => {
  const response = await fetch(API_URL + `/${isbn}`);
  if (!response.ok) {
      throw new Error("Failed to fetch book details");
  }
  return response.json();
};

