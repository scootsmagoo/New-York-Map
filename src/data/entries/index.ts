import type { Entry } from "../../types";
import { lenapeEntries } from "./lenape";
import { newAmsterdamEntries } from "./newAmsterdam";
import { britishColonyEntries } from "./britishColony";
import { revolutionEntries } from "./revolution";
import { earlyRepublicEntries } from "./earlyRepublic";
import { antebellumEntries } from "./antebellum";
import { civilWarGildedEntries } from "./civilWarGilded";
import { greaterNYEntries } from "./greaterNY";

export const allEntries: Entry[] = [
  ...lenapeEntries,
  ...newAmsterdamEntries,
  ...britishColonyEntries,
  ...revolutionEntries,
  ...earlyRepublicEntries,
  ...antebellumEntries,
  ...civilWarGildedEntries,
  ...greaterNYEntries,
];

export function entriesForEra(eraId: string): Entry[] {
  return allEntries
    .filter((e) => e.era === eraId)
    .sort((a, b) => a.year - b.year);
}
