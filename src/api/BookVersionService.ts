import { Book } from "../models/Book";

const API_URL = "http://localhost:8081/api/v1/bookVersions";

export const fetchBookVersionsByBookId = async (id: number): Promise<Book[]> => {
  const response = await fetch(API_URL + `/${id}`);
  
  if (!response.ok) {
      throw new Error("Failed to fetch book versions");
  }
  return response.json();
};