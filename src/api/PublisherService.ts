import { Publisher } from "../models/Publisher";
import keycloak from "../keycloak";

const API_URL = "http://localhost:8081/api/v1/publishers";

// export const fetchPublishers = async (): Promise<Publisher[]> => {
//   try {
//     const response = await fetch(API_URL);
//     if (!response.ok) throw new Error("Failed to fetch publishers");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching publishers:", error);
//     return [];
//   }
// };

export const fetchPublisherById = async (id: number): Promise<Publisher> => {
  const response = await fetch(API_URL + `/${id}`);
  if (!response.ok) {
      throw new Error("Failed to fetch publisher details");
  }
  return response.json();
};

export const updatePublisher = async (id: number, publisher: Publisher): Promise<void> => {
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify(publisher),
    });
    if (!response.ok) throw new Error("Failed to update publisher in backend");
  } catch (error) {
    console.error("Error updating publisher:", error);
  }
};
