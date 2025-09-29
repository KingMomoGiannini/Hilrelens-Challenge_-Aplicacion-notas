type Props = {
  categories: string[];
  onRemove?: (name: string) => void;
};

export default function CategoryChips({ categories, onRemove }: Props) {
  if (!categories?.length) return null;
  return (
    <div className="chips">
      {categories.map((c) => (
        <span key={c} className="chip">
          {c}
          {onRemove && <button className="x" onClick={() => onRemove(c)} title="Quitar">×</button>}
        </span>
      ))}
    </div>
  );
}
