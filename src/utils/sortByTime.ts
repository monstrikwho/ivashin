import moment from "moment";
import { Note } from "../models/Note";

export default function sortByTime(array: Note[]) {
  return array.sort((a, b) => {
    const timeA = moment(a.createdAt, "DD.MM.YYYY, HH:mm:ss");
    const timeB = moment(b.createdAt, "DD.MM.YYYY, HH:mm:ss");
    if (timeB.isBefore(timeA)) return -1;
    if (timeB.isAfter(timeA)) return 1;
    return 0;
  });
}
