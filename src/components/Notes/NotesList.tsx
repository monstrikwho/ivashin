import { useSelector } from "react-redux";

import NotesItem from "./NotesItem";
import { notesSelector } from "../../features/notes/NotesSlice";

import NotesNull from "../../images/null.png";

export default function NotesList() {
  const { list, tags } = useSelector(notesSelector);

  if (!list.length) {
    return (
      <div className="notes-empty">
        <img src={NotesNull} alt="notes list empty" />
      </div>
    );
  }

  const filteredList = tags.active.length
    ? list.filter((item) => {
        for (let tag of item.tags) {
          if (tags.active.indexOf(tag.name) !== -1) {
            return true;
          }
        }
        return false;
      })
    : list;

  return (
    <>
      {filteredList.map((item, key) => (
        <NotesItem item={item} key={key} />
      ))}
    </>
  );
}
