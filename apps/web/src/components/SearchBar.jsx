import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSearchQuery } from "../features/ui/uiSlice";

export function SearchBar() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);

  return (
    <label className="field compact-field">
      <span>Search insights</span>
      <input
        value={searchQuery}
        onChange={(event) => dispatch(setSearchQuery(event.target.value))}
        placeholder="Filter by title, content, or category"
      />
    </label>
  );
}
