import { useState } from "react";
import type { Category } from "../types";

type Props = {
  categories: Category[];
  selected?: string;
  onSelect: (name?: string) => void;
  onCreateCategory?: (name: string) => Promise<void> | void;
};

export default function FilterBar({ categories, selected, onSelect, onCreateCategory }: Props) {
  const [newCat, setNewCat] = useState("");

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <label>Filtrar por categoría:</label>
        <select className="select" value={selected ?? ""} onChange={(e) => onSelect(e.target.value || undefined)}>
          <option value="">(todas)</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {onCreateCategory && (
        <form className="toolbar-right" onSubmit={(e) => { e.preventDefault(); const v = newCat.trim(); if (v) { onCreateCategory(v); setNewCat(""); } }}>
          <input className="input" placeholder="Nueva categoría" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
          <button className="btn btn-ghost" type="submit">Crear</button>
        </form>
      )}
    </div>
  );
}
