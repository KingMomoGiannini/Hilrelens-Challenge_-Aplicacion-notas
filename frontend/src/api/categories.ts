import { api } from "./client";
import type { Category, CreateCategory } from "../types";

export async function listCategories() {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}

export async function createCategory(data: CreateCategory) {
  const res = await api.post<Category>("/categories", data);
  return res.data;
}
