import { Book } from "./Book";

export interface Publisher {
    id: number;
    keycloakId: string;
    name: string;
    email: string;
    picture?: string | null;
    isEnabled: boolean;
    bookList: Book[];
  }