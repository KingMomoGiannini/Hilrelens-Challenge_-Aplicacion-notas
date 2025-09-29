import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listNotes, createNote, deleteNote, archiveNote, addCategoryToNote, removeCategoryFromNote } from "../api/notes";
import { listCategories, createCategory } from "../api/categories";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import FilterBar from "../components/FilterBar";
import type { CreateNote } from "../types";

export default function ActiveNotes() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", { archived: false, category }],
    queryFn: () => listNotes({ archived: false, category }),
  });

  const mCreate = useMutation({ mutationFn: createNote, onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }) });
  const mDelete = useMutation({ mutationFn: deleteNote, onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }) });
  const mArchive = useMutation({ mutationFn: archiveNote, onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }) });
  const mAddCat = useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: number; categoryId: number }) => addCategoryToNote(noteId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
  const mRemoveCat = useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: number; categoryId: number }) => removeCategoryFromNote(noteId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
  const mCreateCat = useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <div className="page">
      <h2>Notas activas</h2>

      <FilterBar
        categories={categories}
        selected={category}
        onSelect={setCategory}
        onCreateCategory={(name) => mCreateCat.mutate({ name })}
      />

      <h3>Nueva nota</h3>
      <NoteForm 
      submitLabel="Crear" 
      onSubmit={(data) => {
          if (data.title && data.content) {
          mCreate.mutate(data as CreateNote);
          }
      }} 
      />
      <h3 style={{ marginTop: 16 }}>Listado</h3>
      {isLoading ? <p>Cargando…</p> : (
        <div className="grid">
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              categories={categories}
              onArchive={() => mArchive.mutate(n.id)}
              onDelete={() => mDelete.mutate(n.id)}
              onAddCategory={(catId) => mAddCat.mutate({ noteId: n.id, categoryId: catId })}
              onRemoveCategory={(name) => {
                const cat = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
                if (cat) mRemoveCat.mutate({ noteId: n.id, categoryId: cat.id });
              }}
            />
          ))}
          {!notes.length && <p>No hay notas activas.</p>}
        </div>
      )}

      <style>{`
        .page { display:grid; gap: 12px; padding: 16px; max-width: 980px; margin: 0 auto; }
        .grid { display:grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
      `}</style>
    </div>
  );
}
