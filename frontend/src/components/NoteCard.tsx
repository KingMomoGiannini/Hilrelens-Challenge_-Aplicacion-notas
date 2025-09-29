import { useState } from "react";
import type { Note, Category } from "../types";
import CategoryChips from "./CategoryChips";

type Props = {
  note: Note;
  categories: Category[];
  onArchive?: () => void;
  onUnarchive?: () => void;
  onDelete?: () => void;
  onAddCategory?: (categoryId: number) => void;
  onRemoveCategory?: (name: string) => void;
};

export default function NoteCard({
  note, categories, onArchive, onUnarchive, onDelete, onAddCategory, onRemoveCategory
}: Props) {
  const [catId, setCatId] = useState<number | "">("");

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="m-0">{note.title}</h3>
        <div className="card-actions">
          {note.archived
            ? <button className="btn" onClick={onUnarchive}>Desarchivar</button>
            : <button className="btn" onClick={onArchive}>Archivar</button>}
          <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
        </div>
      </div>

      {note.content && <p className="content">{note.content}</p>}

      <CategoryChips categories={note.categories} onRemove={onRemoveCategory} />

      <div className="assign">
        <select className="select" value={catId} onChange={(e) => setCatId(e.target.value ? Number(e.target.value) : "")}>
          <option value="">Agregar categoría…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" disabled={catId === ""} onClick={() => { if (catId !== "" && onAddCategory) onAddCategory(catId as number); setCatId(""); }}>
          Asignar
        </button>
      </div>
    </div>
  );
}
