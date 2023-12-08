import Dexie, { Table } from "dexie";
import { Note, Tag, ActiveTag } from "../models";

class DatabaseService extends Dexie {
  notes!: Table<Note>;
  tags!: Table<Tag>;
  activeTags!: Table<ActiveTag>;

  constructor() {
    super("Database");
    this.version(1).stores({
      notes: "id, tags, text, createdAt",
      tags: "name, count, color",
      activeTags: "name",
    });
  }
}

const db = new DatabaseService();

const getDBNotes = async () => {
  return await db.notes.toArray();
};

const addDBNotes = (note: Note) => {
  db.notes.add(note);
};

const updateDBNotes = async (note: Note, latestTags: Tag[]) => {
  const noteDB = await db.notes.get(note.id);
  const tagsDB = await getDBTags();

  if (noteDB) {
    noteDB.tags = note.tags;
    noteDB.text = note.text;
    db.notes.put(noteDB);
  }

  for (let tag of latestTags) {
    const status = tagsDB.find((value) => value.name === tag.name);
    if (status) {
      if (status.count === 1) {
        deleteDBTags(tag);
      } else {
        updateDBTags(tag);
      }
    }
  }

  for (let tag of note.tags) {
    addDBTags(tag);
  }
};

const deleteDBNotes = async (noteId: string) => {
  db.notes.delete(noteId);
};

const getDBActiveTags = async () => {
  return await db.activeTags.toArray();
};

const addDBActiveTags = (tagName: string) => {
  db.activeTags.add({ name: tagName });
};

const deleteDBActiveTags = async (tagName: string) => {
  const tag = await db.activeTags.get(tagName);
  if (tag) {
    db.activeTags.delete(tagName);
  }
};

const getDBTags = async () => {
  return await db.tags.toArray();
};

const addDBTags = async (tag: Tag) => {
  const dbTag = await db.tags.get(tag.name);
  if (dbTag) {
    dbTag.count++;
    db.tags.put(dbTag);
  } else {
    db.tags.add(tag);
  }
};

const updateDBTags = async (tag: Tag) => {
  const dbTag = await db.tags.get(tag.name);
  if (dbTag) {
    dbTag.count--;
    db.tags.put(dbTag);
  }
};

const deleteDBTags = async (tag: Tag) => {
  db.tags.delete(tag.name);
};

const getAllDB = async () => {
  const notes = await getDBNotes();
  const tags = await getDBTags();
  const activeTags = await getDBActiveTags();

  return { notes, tags, activeTags };
};

export {
  db,
  getAllDB,
  getDBNotes,
  addDBNotes,
  updateDBNotes,
  deleteDBNotes,
  getDBActiveTags,
  addDBActiveTags,
  deleteDBActiveTags,
  getDBTags,
  addDBTags,
  updateDBTags,
  deleteDBTags,
};
