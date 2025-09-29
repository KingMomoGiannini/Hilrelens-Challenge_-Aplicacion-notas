import { api } from "./client";
import type { Note, CreateNote, UpdateNote } from "../types";

export async function listNotes(params: { archived: boolean; category?: string }) {
  const res = await api.get<Note[]>("/notes", { params });
  return res.data;
}

export async function getNote(id: number) {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(data: CreateNote) {
  const res = await api.post<Note>("/notes", data);
  return res.data;
}

export async function updateNote(id: number, data: UpdateNote) {
  const res = await api.put<Note>(`/notes/${id}`, data);
  return res.data;
}

export async function archiveNote(id: number) {
  const res = await api.patch<Note>(`/notes/${id}/archive`);
  return res.data;
}

export async function unarchiveNote(id: number) {
  const res = await api.patch<Note>(`/notes/${id}/unarchive`);
  return res.data;
}

export async function deleteNote(id: number) {
  await api.delete(`/notes/${id}`);
}

export async function addCategoryToNote(noteId: number, categoryId: number) {
  const res = await api.post<Note>(`/notes/${noteId}/categories/${categoryId}`);
  return res.data;
}

export async function removeCategoryFromNote(noteId: number, categoryId: number) {
  await api.delete(`/notes/${noteId}/categories/${categoryId}`);
}
