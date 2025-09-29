import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listNotes, deleteNote, unarchiveNote, removeCategoryFromNote, addCategoryToNote } from "../api/notes";
import { listCategories } from "../api/categories";
import NoteCard from "../components/NoteCard";

export default function ArchivedNotes() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", { archived: true }],
    queryFn: () => listNotes({ archived: true }),
  });

  const mDelete = useMutation({ mutationFn: deleteNote, onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }) });
  const mUnarchive = useMutation({ mutationFn: unarchiveNote, onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }) });
  const mAddCat = useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: number; categoryId: number }) => addCategoryToNote(noteId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
  const mRemoveCat = useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: number; categoryId: number }) => removeCategoryFromNote(noteId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <div className="page">
      <h2>Notas archivadas</h2>
      {isLoading ? <p>Cargando…</p> : (
        <div className="grid">
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              categories={categories}
              onUnarchive={() => mUnarchive.mutate(n.id)}
              onDelete={() => mDelete.mutate(n.id)}
              onAddCategory={(catId) => mAddCat.mutate({ noteId: n.id, categoryId: catId })}
              onRemoveCategory={(name) => {
                const cat = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
                if (cat) mRemoveCat.mutate({ noteId: n.id, categoryId: cat.id });
              }}
            />
          ))}
          {!notes.length && <p>No hay notas archivadas.</p>}
        </div>
      )}
      <style>{`
        .page { display:grid; gap: 12px; padding: 16px; max-width: 980px; margin: 0 auto; }
        .grid { display:grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
      `}</style>
    </div>
  );
}
