import { clsx } from "clsx";
import { useSelector, useDispatch } from "react-redux";

import { notesSelector, addFilters } from "../../features/notes/NotesSlice";

export default function FilterTagsList() {
  const dispatch = useDispatch();
  const { tags } = useSelector(notesSelector);

  const handleAddFilter = (tagName: string) => {
    dispatch(addFilters(tagName));
  };

  const tagsItem = (isActive: boolean) =>
    clsx({
      "tags-item": true,
      active: isActive,
    });

  const tagsList = Object.entries(tags.list);
  const sorted = tagsList.sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="filter-tags">
      {sorted.map(([_, tag], key) => {
        const isActive = tags.active.includes(tag.name);
        return (
          <span
            className={tagsItem(isActive)}
            key={key}
            onClick={() => {
              handleAddFilter(tag.name);
            }}
          >
            <span className="text">{tag.name}</span>
            <span className="counter">{tag.count}</span>
          </span>
        );
      })}
    </div>
  );
}
