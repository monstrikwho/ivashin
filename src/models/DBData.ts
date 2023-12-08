import { Note, Tag } from "./index";

export interface ActiveTag {
  name: string;
}

export interface DBData {
  notes: Note[];
  tags: Tag[];
  activeTags: ActiveTag[];
}
