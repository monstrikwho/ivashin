import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { v4 as uuidv4 } from "uuid";

import FormNoteTags from "./FormNoteTags";
import { addNote } from "../../features/notes/NotesSlice";
import { parseTags } from "../../utils/highlightTags";

import { Tag } from "../../models/Tag";

export default function NotesForm() {
  const [textValue, setTextValue] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const dispatch = useDispatch();

  const dispatchAddNote = useCallback(() => {
    if (!textValue.trim()) return;
    dispatch(
      addNote({
        id: uuidv4(),
        text: textValue,
        tags: tags,
        createdAt: new Date().toString(),
      })
    );
    setTextValue("");
    setTags([]);
  }, [dispatch, tags, textValue]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        dispatchAddNote();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatchAddNote]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatchAddNote();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const tags = parseTags(value);
    setTags(tags);
    setTextValue(value);
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        value={textValue}
        onChange={handleChange}
        label="Введите текст заметки"
        multiline
        rows={4}
      />
      <FormNoteTags tags={tags} />
      <div className="actions">
        <Button type="submit" disabled={!Boolean(textValue.trim())}>
          <span>Сохранить</span>
          <span className="keys-cups">
            Ctrl <KeyboardReturnIcon />
          </span>
        </Button>
      </div>
    </form>
  );
}
