import { BOROUGHS, type Borough } from "../lib/boroughs";

interface BoroughChipsProps {
  value: Borough | null;
  onChange: (b: Borough | null) => void;
  /** Counts to show beside each chip, if known. */
  counts?: Partial<Record<Borough | "all", number>>;
  label: string;
}

/** "All · Manhattan · Brooklyn · …" as a row of toggle chips. */
export function BoroughChips({ value, onChange, counts, label }: BoroughChipsProps) {
  const chip = (id: Borough | null, text: string) => {
    const n = counts?.[id ?? "all"];
    const pressed = value === id;
    return (
      <button
        key={id ?? "all"}
        type="button"
        className="borough-chip"
        aria-pressed={pressed}
        disabled={n === 0 && !pressed}
        onClick={() => onChange(id)}
      >
        {text}
        {n !== undefined && <span className="borough-chip-count">{n}</span>}
      </button>
    );
  };
  return (
    <div className="borough-chips" role="group" aria-label={label}>
      {chip(null, "All")}
      {BOROUGHS.map((b) => chip(b.id, b.label))}
    </div>
  );
}
