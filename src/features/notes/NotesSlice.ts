import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Note } from "../../models/Note";
import { Tag } from "../../models/Tag";
import {
  getAllDB,
  getDBNotes,
  addDBNotes,
  updateDBNotes,
  deleteDBNotes,
  getDBActiveTags,
  updateDBActiveTags,
  getDBTags,
  addDBTags,
  updateDBTags,
  deleteDBTags,
} from "../../services/database";

export interface NotesState {
  list: Note[];
  tags: {
    active: string[];
    list: {
      [key: string]: Tag;
    };
  };
}

interface DBData {
  notes: Note[];
  tags: Tag[];
  activeTags: {
    name: string;
  }[];
}

const initialState: NotesState = {
  list: [],
  tags: {
    active: [],
    list: {},
  },
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state: NotesState, action: PayloadAction<Note>) => {
      const note: Note = action.payload;

      state.list.unshift(note);
      addDBNotes(note);

      for (let tag of note.tags) {
        state.tags.list[tag.name]
          ? state.tags.list[tag.name].count++
          : (state.tags.list[tag.name] = tag);
        addDBTags(tag);
      }
    },
    updateNote: (state: NotesState, action: PayloadAction<Note>) => {
      const index = state.list.findIndex(
        (item) => item.id === action.payload.id
      );

      // updateDBNotes(action.payload, state.list[index].tags);

      for (let tag of state.list[index].tags) {
        if (state.tags.list[tag.name]) {
          if (state.tags.list[tag.name].count === 1) {
            delete state.tags.list[tag.name];
            state.tags.active = state.tags.active.filter(
              (item) => item === tag.name
            );
          } else {
            state.tags.list[tag.name].count--;
          }
        }
      }

      for (let tag of action.payload.tags) {
        state.tags.list[tag.name]
          ? state.tags.list[tag.name].count++
          : (state.tags.list[tag.name] = tag);
      }

      state.list[index] = action.payload;
    },
    deleteNote: (state: NotesState, action: PayloadAction<Note>) => {
      const filteredList = state.list.filter(
        (item) => item.id !== action.payload.id
      );

      for (let tag of action.payload.tags) {
        if (state.tags.list[tag.name]) {
          if (state.tags.list[tag.name].count === 1) {
            delete state.tags.list[tag.name];
            state.tags.active = state.tags.active.filter(
              (item) => item === tag.name
            );
            // Обновить активные теги в ДБ
            deleteDBTags(tag);
          } else {
            state.tags.list[tag.name].count--;
            updateDBTags(tag);
          }
        }
      }

      state.list = filteredList;
      deleteDBNotes(action.payload.id);
    },
    addFilters: (state: NotesState, action: PayloadAction<string>) => {
      const index = state.tags.active.indexOf(action.payload);
      if (index === -1) {
        state.tags.active.push(action.payload);
      } else {
        state.tags.active.splice(index, 1);
      }
      updateDBActiveTags(action.payload);
    },
    insertDB: (state: NotesState, action: PayloadAction<DBData>) => {
      // инициализирую заметки
      state.list = action.payload.notes;

      // инициализирую теги
      const tagList: { [key: string]: Tag } = {};

      action.payload.tags.reduce((acc, obj) => {
        acc[obj.name] = obj;
        return acc;
      }, tagList);

      state.tags.list = tagList;

      // инициализирую активные теги
      state.tags.active = action.payload.activeTags.map((item) => item.name);
    },
  },
});

export const { addNote, updateNote, deleteNote, addFilters, insertDB } =
  notesSlice.actions;

export const notesSelector = (state: RootState) => {
  return state.notes;
};

export default notesSlice.reducer;
