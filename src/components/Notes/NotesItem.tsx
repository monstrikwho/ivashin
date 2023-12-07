import { useState } from "react";
import { useDispatch } from "react-redux";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { Note } from "../../models/Note";
import { highlightTags } from "../../utils/highlightTags";
import { updateNote, deleteNote } from "../../features/notes/NotesSlice";
import { Tag } from "../../models/Tag";

interface NotesItemProps {
  item: Note;
}

export default function NotesItem({ item }: NotesItemProps) {
  const dispatch = useDispatch();
  const [tags, setTags] = useState<Tag[]>();
  const [text, setText] = useState("");

  const handleChange = (event: ContentEditableEvent) => {
    const value = event.target.value;

    const { highlightHtml, tags } = highlightTags(value);

    setTags(tags);
    setText(highlightHtml);
    dispatch(updateNote({ ...item, text: highlightHtml, tags }));
  };

  const handleDeleteNote = () => {
    dispatch(deleteNote(item));
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
