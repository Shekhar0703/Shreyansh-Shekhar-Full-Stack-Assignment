import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSortMode } from "../features/ui/uiSlice";

const options = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "content-asc", label: "Content A-Z" },
  { value: "content-desc", label: "Content Z-A" },
];

export function SortControls() {
  const dispatch = useAppDispatch();
  const sortMode = useAppSelector((state) => state.ui.sortMode);

  return (
    <label className="field compact-field">
      <span>Sort</span>
      <select value={sortMode} onChange={(event) => dispatch(setSortMode(event.target.value))}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
