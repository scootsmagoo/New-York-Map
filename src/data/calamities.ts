/**
 * Great fires and epidemics as dated areas: the district a fire burned, or
 * the quarter an epidemic hit hardest. Outlines follow the streets the
 * sources name (corners from the city's street centerlines), so they're
 * truer than the footprints but still drawn, not surveyed.
 */
import type { BookRef } from "../types";

export interface Calamity {
  id: string;
  kind: "fire" | "epidemic";
  name: string;
  /** First year it's on the map. */
  from: number;
  /** Last year at full strength (ruins left standing, a block still sick). */
  to: number;
  /** Area, [lon, lat] corners in order (unclosed). */
  ring: [number, number][];
  /** Where the name goes, when the middle is crowded; over the river is best. */
  label?: [number, number];
  /** One or two sentences for the tooltip and search. */
  note: string;
  /** Other words people might search for. */
  aka?: string;
  book?: BookRef;
  /** Entry to open when the area is clicked. */
  entryId?: string;
}

/** Years an area takes to fade once it's over. */
export const CALAMITY_FADE = 5;

export const calamities: Calamity[] = [
  {
    id: "fire-1776",
    kind: "fire",
    name: "Great Fire of 1776",
    from: 1776,
    // The burned district lay in ruins ("Canvas Town") through the occupation.
    to: 1783,
    label: [-74.0158, 40.7105],
    ring: [
      [-74.013, 40.70311], // Whitehall Slip, where it began
      [-74.01158, 40.70403],
      [-74.01333, 40.70504],
      [-74.01195, 40.70746], // Trinity
      [-74.00999, 40.70981],
      [-74.01012, 40.71209], // west of St. Paul's, which was saved
      [-74.01136, 40.71493],
      [-74.01496, 40.70477],
      [-74.01429, 40.70456],
    ],
    note: "Set off in a tavern by Whitehall Slip days after the British took the city, it ran up the west side past Trinity Church to the lots beyond St. Paul's: over 500 houses, a quarter of the town. The ruins stood through the occupation as the tent camp called Canvas Town.",
    aka: "Revolution British occupation Trinity Church Canvas Town",
    book: { book: "gotham", chapter: "15. Revolution", pages: "241–42" },
    entryId: "great-fire-1776",
  },
  {
    id: "yellow-fever-1798",
    kind: "epidemic",
    name: "Yellow fever, 1798",
    from: 1798,
    to: 1798,
    label: [-74.001, 40.705],
    ring: [
      [-74.00795, 40.70555],
      [-74.00433, 40.70783],
      [-74.0025, 40.70885],
      [-74.00134, 40.70728],
      [-74.00361, 40.70684],
      [-74.00629, 40.70424],
    ],
    note: "The first cases came from the East River docks at the end of July. Everyone who could fled; the fever killed 2,086, close to one New Yorker in twenty, most of them poor.",
    aka: "yellow jack epidemic mosquitoes",
    book: { book: "gotham", chapter: "23. The Road to City Hall", pages: "357–58" },
    entryId: "yellow-fever",
  },
  {
    id: "yellow-fever-1822",
    kind: "epidemic",
    name: "The infected district, 1822",
    from: 1822,
    to: 1822,
    ring: [
      [-74.01165, 40.71513],
      [-74.00631, 40.71417],
      [-74.00406, 40.71314],
      [-74.00526, 40.71201],
      [-74.0025, 40.70885],
      [-74.00134, 40.70728],
      [-74.00629, 40.70424],
      [-74.00796, 40.70321],
      [-74.01255, 40.70151],
      [-74.01429, 40.70456],
      [-74.01566, 40.70484],
      [-74.0122, 40.71449],
    ],
    note: "Yellow fever broke out on the fashionable streets near the Battery. The city fenced off everything below City Hall with a barricade along Chambers Street, and thousands fled to Greenwich Village, which boomed.",
    aka: "yellow fever barricade Chambers Street Greenwich Village",
    book: { book: "gotham", chapter: "27. The Canal Era", pages: "447–48" },
  },
  {
    id: "cholera-1832",
    kind: "epidemic",
    name: "Cholera, 1832",
    from: 1832,
    to: 1832,
    // The Sixth Ward, around the Five Points.
    ring: [
      [-74.00631, 40.71417],
      [-74.00189, 40.71941],
      [-73.99606, 40.71624],
      [-73.99757, 40.71409],
      [-73.99863, 40.71352],
      [-74.00406, 40.71314],
    ],
    note: "Some 3,500 died in July and August, worst of all around the Five Points, where wells and privies shared the wet ground of the filled Collect Pond. Preachers called it God's judgment on the poor.",
    aka: "Five Points Sixth Ward epidemic Bellevue",
    book: { book: "gotham", chapter: "35. Filth, Fever, Water, Fire", pages: "589–94" },
  },
  {
    id: "fire-1835",
    kind: "fire",
    name: "Great Fire of 1835",
    from: 1835,
    to: 1835,
    label: [-74.0052, 40.7032],
    ring: [
      [-74.00801, 40.70799], // William Street at Maiden Lane
      [-74.0095, 40.70639],
      [-74.0096, 40.70466],
      [-74.0105, 40.70381], // Coenties Slip, where gunpowder stopped it
      [-74.0101, 40.7025],
      [-74.00796, 40.70321],
      [-74.00629, 40.70424],
      [-74.00475, 40.70524],
    ],
    note: "On a night so cold the hydrants froze, fire took thirteen acres from Maiden Lane to Coenties Slip and William Street to the East River, nearly 700 buildings. Marines blew up buildings with gunpowder to stop it at the slip.",
    aka: "Merchants' Exchange Wall Street Croton",
    book: { book: "gotham", chapter: "35. Filth, Fever, Water, Fire", pages: "596–98" },
    entryId: "great-fire-1835",
  },
  {
    id: "fire-1845",
    kind: "fire",
    name: "Great Fire of 1845",
    from: 1845,
    to: 1845,
    label: [-74.0128, 40.7082],
    ring: [
      [-74.01251, 40.70678],
      [-74.01119, 40.70629],
      [-74.01158, 40.70403],
      [-74.01319, 40.70405],
      [-74.01333, 40.70504],
    ],
    note: "A July fire around Broad Street, spread by an exploding saltpeter warehouse, rivaled 1835's. Critics blamed the brawling volunteer companies, who still refused steam engines.",
    aka: "Broad Street saltpeter volunteer firemen",
    book: { book: "gotham", chapter: "46. Louis Napoleon and Fernando Wood", pages: "827" },
  },
  {
    id: "cholera-1849",
    kind: "epidemic",
    name: "Cholera, 1849",
    from: 1849,
    to: 1849,
    // Orange (now Baxter) Street and its neighbors at the Five Points.
    ring: [
      [-74.00212, 40.71517],
      [-74.00046, 40.71437],
      [-73.99956, 40.71393],
      [-73.99859, 40.71711],
      [-73.99931, 40.71756],
      [-73.99996, 40.71803],
    ],
    note: "It started in an Orange Street basement at the Five Points and killed over 5,000 New Yorkers, 642 more in Brooklyn. The dead were rowed to Randall's Island. Over 40 percent of them had been born in Ireland.",
    aka: "Orange Street Baxter Street Five Points Irish famine",
    book: { book: "gotham", chapter: "44. Into the Crazy-Loved Dens of Death", pages: "785" },
  },
  {
    id: "polio-1916",
    kind: "epidemic",
    name: "Polio, 1916",
    from: 1916,
    to: 1916,
    // The old South Brooklyn section: Atlantic Avenue to Red Hook, the
    // waterfront to Fourth Avenue (corners from the street centerlines).
    ring: [
      [-73.99951, 40.69166],
      [-73.97839, 40.68443],
      [-73.98865, 40.67033],
      [-73.99777, 40.67475],
      [-74.01543, 40.67521],
      [-74.00139, 40.68776],
    ],
    note: "Declared epidemic in Brooklyn on June 17, 1916; by the end of June nearly all of the 183 cases were in the old South Brooklyn section. More than 2,000 New Yorkers died that year, most of them children under five.",
    aka: "infantile paralysis poliomyelitis South Brooklyn Red Hook Carroll Gardens",
    entryId: "polio-1916",
  },
  {
    id: "lung-block",
    kind: "epidemic",
    name: "The \"lung block\"",
    from: 1903,
    // Cleared in 1933 for Knickerbocker Village.
    to: 1932,
    label: [-73.9955, 40.7093],
    ring: [
      [-73.99678, 40.71135],
      [-73.99427, 40.7116],
      [-73.99414, 40.71057],
      [-73.99649, 40.71021],
    ],
    note: "The tenement block of Cherry, Catherine, Market, and Monroe streets had more deaths from tuberculosis than any other in the city, so a 1903 report named it the lung block. It was torn down in 1933 for Knickerbocker Village.",
    aka: "tuberculosis consumption Cherry Street tenements Knickerbocker Village",
  },
];

/** How strongly an area shows in `year`: 0 before and long after, 1 while it lasts. */
export function calamityOpacity(c: Calamity, year: number): number {
  if (year < c.from) return 0;
  if (year <= c.to) return 1;
  return Math.max(0, 1 - (year - c.to) / CALAMITY_FADE);
}

export function calamityCenter(c: Calamity): [number, number] {
  let x = 0;
  let y = 0;
  for (const p of c.ring) {
    x += p[0];
    y += p[1];
  }
  return [x / c.ring.length, y / c.ring.length];
}
