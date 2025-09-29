import { useState } from "react";
import type { CreateNote, UpdateNote, Note } from "../types";

type Props = {
  initial?: Partial<Note>;
  onSubmit: (data: CreateNote | UpdateNote) => Promise<void> | void;
  submitLabel?: string;
};

export default function NoteForm({ initial, onSubmit, submitLabel = "Guardar" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ title: title.trim(), content });
        setTitle(""); setContent("");
      }}
    >
      <div className="field">
        <label>Título</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
      </div>

      <div className="field">
        <label>Contenido</label>
        <textarea className="textarea" value={content ?? ""} onChange={(e) => setContent(e.target.value)} rows={3} />
      </div>

      <button className="btn btn-primary" type="submit">{submitLabel}</button>
    </form>
  );
}
