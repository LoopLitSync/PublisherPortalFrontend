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

export const updateBook = async (id: number, book: Book): Promise<void> => {
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error("Failed to update book");
  } catch (error) {
    console.error("Error updating book:", error);
  }
};
