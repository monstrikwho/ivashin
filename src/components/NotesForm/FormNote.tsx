import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import { TextField, Button } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import FormNoteTags from "./FormNoteTags";
import { addNote, updateSnackbar } from "../../features/notes/NotesSlice";
import { highlightTags, parseTags } from "../../utils/highlightTags";

import { Tag } from "../../models/Tag";

export default function NotesForm() {
  const [textValue, setTextValue] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const dispatch = useDispatch();

  const dispatchAddNote = useCallback(() => {
    if (!textValue.trim()) return;

    const { highlightHtml, tags } = highlightTags(textValue);

    const data = {
      id: uuidv4(),
      text: highlightHtml,
      tags: tags,
      createdAt: moment().format("DD.MM.YYYY, HH:mm:ss"),
    };

    dispatch(addNote(data));
    dispatch(
      updateSnackbar({ isOpen: true, message: "Заметка успешно добавлена!" })
    );

    setTextValue("");
    setTags([]);
  }, [dispatch, textValue]);

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
