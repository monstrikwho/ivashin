import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  updateNote,
  deleteNote,
  updateSnackbar,
} from "../../features/notes/NotesSlice";
import { highlightTags } from "../../utils/highlightTags";

import { Note } from "../../models/Note";
import { Tag } from "../../models/Tag";

interface NotesItemProps {
  item: Note;
}

export default function NotesItem({ item }: NotesItemProps) {
  const dispatch = useDispatch();
  const [tags, setTags] = useState<Tag[]>();
  const [text, setText] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (event: ContentEditableEvent) => {
    const value = event.target.value;

    const { highlightHtml, tags } = highlightTags(value);

    setTags(tags);
    setText(highlightHtml);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      dispatch(updateNote({ ...item, text: highlightHtml, tags }));
      dispatch(
        updateSnackbar({ isOpen: true, message: "Заметка успешно обновлена!" })
      );
    }, 1000);
  };

  const handleDeleteNote = () => {
    dispatch(deleteNote(item));
    dispatch(
      updateSnackbar({ isOpen: true, message: "Заметка успешно удалена!" })
    );
  };

  return (
    <div className="notes-item">
      <div className="note-tags">
        {(tags || item.tags).map(({ name }, key) => (
          <span className="tag" key={key}>
            {name}
          </span>
        ))}
      </div>
      <div className="del-button">
        <IconButton
          aria-label="delete"
          size="small"
          color="primary"
          onClick={() => {
            handleDeleteNote();
          }}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </div>
      <ContentEditable
        html={text || item.text}
        className="content-editable"
        onChange={handleChange}
      />
    </div>
  );
}
