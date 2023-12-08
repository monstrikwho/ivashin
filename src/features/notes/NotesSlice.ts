import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { Note, Tag, DBData, Snackbar } from "../../models";

import {
  addDBNotes,
  updateDBNotes,
  deleteDBNotes,
  addDBActiveTags,
  deleteDBActiveTags,
  addDBTags,
  updateDBTags,
  deleteDBTags,
} from "../../services/database";
import sortByTime from "../../utils/sortByTime";

export interface NotesState {
  list: Note[];
  tags: {
    active: string[];
    list: {
      [key: string]: Tag;
    };
  };
  snackbar: Snackbar;
}

const initialState: NotesState = {
  list: [],
  tags: {
    active: [],
    list: {},
  },
  snackbar: {
    isOpen: false,
    message: "",
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

      // Создал новый копию массива с тегами иначе прокидывался нулевой объект
      // Прокидывал state.list[index].tags
      // Cannot perform 'get' on a proxy that has been revoked
      // TypeError: Cannot perform 'get' on a proxy that has been revoked at updateDBNotes
      const latestTags: Tag[] = [];

      for (let tag of state.list[index].tags) {
        if (state.tags.list[tag.name]) {
          if (state.tags.list[tag.name].count === 1) {
            delete state.tags.list[tag.name];
            state.tags.active = state.tags.active.filter(
              (item) => item !== tag.name
            );
            deleteDBActiveTags(tag.name);
            deleteDBTags(tag);
          } else {
            state.tags.list[tag.name].count--;
            updateDBTags(tag);
          }
        }
        latestTags.push({
          name: tag.name,
          count: tag.count,
          color: tag.color,
        });
      }

      for (let tag of action.payload.tags) {
        state.tags.list[tag.name]
          ? state.tags.list[tag.name].count++
          : (state.tags.list[tag.name] = tag);
      }

      updateDBNotes(action.payload, latestTags);

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
              (item) => item !== tag.name
            );
            deleteDBActiveTags(tag.name);
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
        addDBActiveTags(action.payload);
      } else {
        state.tags.active.splice(index, 1);
        deleteDBActiveTags(action.payload);
      }
    },
    insertDB: (state: NotesState, action: PayloadAction<DBData>) => {
      // инициализирую заметки
      const notes = sortByTime(action.payload.notes);
      state.list = notes;

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
    updateSnackbar: (state: NotesState, action: PayloadAction<Snackbar>) => {
      state.snackbar = { ...action.payload };
    },
  },
});

export const {
  addNote,
  updateNote,
  deleteNote,
  addFilters,
  insertDB,
  updateSnackbar,
} = notesSlice.actions;

export const notesSelector = (state: RootState) => {
  return state.notes;
};

export default notesSlice.reducer;
