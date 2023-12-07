import { useEffect } from "react";
import { useDispatch } from "react-redux";

import NotesFilter from "./NotesFilter";
import NotesList from "./NotesList";

import { getAllDB } from "../../services/database";
import { insertDB } from "../../features/notes/NotesSlice";
import "./Notes.sass";

export default function Notes() {
  const dispatch = useDispatch();

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      if (didCancel) return;

      const result = await getAllDB();
      dispatch(insertDB(result));
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [dispatch]);

  return (
    <div className="notes">
      <div className="title">Список заметок</div>
      <NotesFilter />
      <NotesList />
    </div>
  );
}
