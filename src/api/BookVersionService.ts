import { BookVersion } from "../models/BookVersion";

const API_URL = "http://localhost:8081/api/v1/bookVersions";

export const fetchBookVersionsByBookId = async (id: number): Promise<BookVersion[]> => {
    const response = await fetch(API_URL + `/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch book versions");
    }
    return response.json();
};

export const rollbackBookVersion = async (bookId: number, version: number): Promise<BookVersion> => {
    const response = await fetch(API_URL + `/${bookId}/rollback`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(version),
    });

    if (!response.ok) {
        throw new Error("Failed to rollback book version");
    }
    return response.json();
};