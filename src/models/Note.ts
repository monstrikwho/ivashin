import { Tag } from "./Tag";

export interface Note {
  id: string;
  text: string;
  tags: Tag[];
  createdAt: string;
}
