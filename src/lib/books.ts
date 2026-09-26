import type { BookId, BookRef, Entry } from "../types";
import { bookRefs } from "../data/bookRefs";

export const BOOK_TITLE: Record<BookId, string> = {
  gotham: "Gotham",
  greaterGotham: "Greater Gotham",
  gothamAtWar: "Gotham at War",
};

/** Which volume an entry's margin note speaks for, by era. */
export function noteBook(entry: Entry): BookId {
  if (entry.era === "greaterNY") return "greaterGotham";
  if (entry.era === "capitalWorld") return "gothamAtWar";
  return "gotham";
}

export function bookRefFor(entry: Entry): BookRef | undefined {
  return bookRefs[entry.id];
}

/** "ch. 16, The Gibraltar of North America, pp. 253–55" (title set apart by the caller). */
export function formatBookLocation(ref: BookRef): string {
  const numbered = /^(\d+)\. (.+)$/.exec(ref.chapter);
  const where = numbered ? `ch. ${numbered[1]}, ${numbered[2]}` : ref.chapter;
  if (!ref.pages) return where;
  const plural = /[–,]/.test(ref.pages);
  return `${where}, ${plural ? "pp." : "p."} ${ref.pages}`;
}
