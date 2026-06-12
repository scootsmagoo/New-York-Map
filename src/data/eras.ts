import type { Era } from "../types";

/**
 * Era periodization loosely follows the part structure of Burrows & Wallace's
 * "Gotham: A History of New York City to 1898", extended to 1919 where the
 * sequel "Greater Gotham" leaves off.
 */
export const TIME_MIN = -10000;
export const TIME_MAX = 1919;

export const eras: Era[] = [
  {
    id: "lenape",
    name: "Lenapehoking",
    subtitle: "The island before the city",
    start: TIME_MIN,
    end: 1609,
    color: "#5b6e4f",
    summary:
      "For thousands of years the estuary belonged to Munsee-speaking Lenape peoples — Wecquaesgeek, Canarsee, Rockaway, Hackensack, Raritan and others — who moved seasonally among planting fields, shell-fisheries, and hunting grounds. Mannahatta, 'the island of many hills,' carried a web of trails and villages from the Battery to Inwood. European contact began with Verrazzano's visit of 1524, eight decades before any colonist stayed.",
    wikiTitle: "Lenape",
  },
  {
    id: "newAmsterdam",
    name: "New Amsterdam",
    subtitle: "A Dutch company town, 1609–1664",
    start: 1609,
    end: 1664,
    color: "#c4762c",
    summary:
      "After Henry Hudson's 1609 voyage, the Dutch West India Company planted a fur-trading post at Manhattan's tip. New Amsterdam grew into a polyglot port of perhaps 1,500 souls — Dutch, Walloon, English, African (enslaved and half-free), Jewish — ruled at the last by Peter Stuyvesant, walled at its northern edge, and surrendered to the English without a shot in 1664.",
    wikiTitle: "New Amsterdam",
  },
  {
    id: "britishColony",
    name: "British New York",
    subtitle: "Crown port and slave market, 1664–1763",
    start: 1664,
    end: 1763,
    color: "#9d3b3b",
    summary:
      "Renamed for the Duke of York, the town became a contentious British seaport of merchants, privateers, artisans, and the largest urban enslaved population north of Charleston. It weathered Leisler's Rebellion, slave conspiracies real and imagined, and the Zenger trial, while its wharves, coffee-houses, and new King's College tied it ever tighter to Atlantic trade and war.",
    wikiTitle: "Province of New York",
  },
  {
    id: "revolution",
    name: "Revolution & Occupation",
    subtitle: "Liberty poles, fire, and exile, 1763–1783",
    start: 1763,
    end: 1783,
    color: "#7d5ba6",
    summary:
      "New York led resistance to the Stamp Act, then paid dearly: Washington's army was routed across Brooklyn and Manhattan in 1776, fire gutted a quarter of the town, and the British held the city for seven years as their North American headquarters. More Americans died in the prison ships of Wallabout Bay than in every battle of the war combined. The British sailed away on Evacuation Day, November 25, 1783.",
    wikiTitle: "New York and New Jersey campaign",
  },
  {
    id: "earlyRepublic",
    name: "Early Republic",
    subtitle: "Capital, port, and grid, 1783–1825",
    start: 1783,
    end: 1825,
    color: "#2e6e8e",
    summary:
      "Briefly the capital of the United States — Washington took the first presidential oath on Wall Street — New York rebuilt, banked, speculated, and surged past Philadelphia to become the nation's busiest port. The Commissioners' Plan of 1811 ruled its future in a relentless street grid, and the Erie Canal's opening in 1825 married the harbor to the continent's interior.",
    wikiTitle: "History of New York City (1784–1854)",
  },
  {
    id: "antebellum",
    name: "Antebellum Metropolis",
    subtitle: "Immigrant city of extremes, 1825–1861",
    start: 1825,
    end: 1861,
    color: "#4f7a4a",
    summary:
      "Irish and German immigration remade the city; Five Points became a byword for slum poverty while merchant princes built marble palaces a mile north. The era brought Croton water, the penny press, P.T. Barnum, riots over abolition and actors alike, an independent City of Brooklyn, and — carved from squatters' land at the island's heart — Central Park.",
    wikiTitle: "History of New York City (1784–1854)",
  },
  {
    id: "civilWarGilded",
    name: "Civil War & Gilded Age",
    subtitle: "Draft riots to consolidation, 1861–1898",
    start: 1861,
    end: 1898,
    color: "#8a6d1f",
    summary:
      "The bloodiest riot in American history tore through Manhattan in 1863; Boss Tweed perfected municipal plunder; Morgan, Gould, and Vanderbilt made Wall Street the world's counting-house. Elevated railroads, tenements, the Brooklyn Bridge, and the Statue of Liberty defined the skyline of 'the other half' and the half above it, until Greater New York united five boroughs on January 1, 1898.",
    wikiTitle: "Gilded Age",
  },
  {
    id: "greaterNY",
    name: "Greater New York",
    subtitle: "The imperial city, 1898–1919",
    start: 1898,
    end: TIME_MAX,
    color: "#3f5573",
    summary:
      "The consolidated city of 3.4 million dug subways, raised steel towers, and absorbed the greatest immigration wave in its history through Ellis Island. Skyscrapers, the Triangle fire, ragtime, suffrage marches, and Great War mobilization carried New York to 1919 — capital of capital, second city of the world and gaining on London — where Wallace's 'Greater Gotham' closes.",
    wikiTitle: "History of New York City (1898–1945)",
  },
];

export function eraForYear(year: number): Era {
  for (const era of eras) {
    if (year >= era.start && year < era.end) return era;
  }
  return year < eras[0].end ? eras[0] : eras[eras.length - 1];
}

export function formatYear(year: number): string {
  if (year <= -1000) {
    const rounded = Math.round(Math.abs(year) / 100) * 100;
    return `${rounded.toLocaleString()} BCE`;
  }
  if (year < 1) return `${Math.abs(Math.round(year))} BCE`;
  return String(Math.round(year));
}
