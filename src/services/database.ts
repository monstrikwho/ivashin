import Dexie, { Table } from "dexie";
import { Tag } from "../models/Tag";
import { Note } from "../models/Note";

interface IActiveTags {
  name: string;
}

class DatabaseService extends Dexie {
  notes!: Table<Note>;
  tags!: Table<Tag>;
  activeTags!: Table<IActiveTags>;

  constructor() {
    super("Database");
    this.version(1).stores({
      notes: "id, tags, text, createdAt",
      tags: "name, count, isActive, color",
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

const updateDBNotes = async (note: Note, stateTags: Tag[]) => {
  // const noteDB = await db.notes.get(note.id);
  // if (noteDB) {
  //   noteDB.tags = note.tags;
  //   noteDB.text = note.text;
  //   db.notes.put(noteDB);
  // }
  // console.log(stateTags);
  // console.log(note.tags);
  // for (let tag of stateTags) {
  //   const item = stateTags.find((value) => value.name === tag.name);
  //   if (item) {
  //     if (item.count === 1) {
  //       await deleteDBTags(tag);
  //     } else {
  //       await updateDBTags(tag);
  //     }
  //   }
  // }
  // for (let tag of note.tags) {
  //   await addDBTags(tag);
  // }
  // Обновить активные теги в ДБ
};

const deleteDBNotes = async (noteId: string) => {
  await db.notes.delete(noteId);
};

const getDBActiveTags = async () => {
  return await db.activeTags.toArray();
};

const updateDBActiveTags = async (tagName: string) => {
  const tag = await db.activeTags.get(tagName);

  if (tag) {
    await db.activeTags.delete(tagName);
  } else {
    db.activeTags.add({ name: tagName });
  }

  return await db.activeTags.toArray();
};

const getDBTags = async () => {
  return await db.tags.toArray();
};

const addDBTags = async (tag: Tag) => {
  const dbTag = await db.tags.get(tag.name);
  if (dbTag) {
    dbTag.count++;
    await db.tags.put(dbTag);
  } else {
    await db.tags.add(tag);
  }
};

const updateDBTags = async (tag: Tag) => {
  const dbTag = await db.tags.get(tag.name);
  if (dbTag) {
    dbTag.count--;
    await db.tags.put(dbTag);
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
  updateDBActiveTags,
  getDBTags,
  addDBTags,
  updateDBTags,
  deleteDBTags,
};
