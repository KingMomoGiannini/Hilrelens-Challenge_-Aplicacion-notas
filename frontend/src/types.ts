export type Note = {
  id: number;
  title: string;
  content: string | null;
  archived: boolean;
  categories: string[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
};

export type CreateNote = { title: string; content?: string | null };
export type UpdateNote = { title?: string; content?: string | null };
export type CreateCategory = { name: string };
