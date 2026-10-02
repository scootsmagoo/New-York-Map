import type { Era } from "../types";

/**
 * Era periodization loosely follows the part structure of Burrows & Wallace's
 * "Gotham: A History of New York City to 1898", extended to 1919 where the
 * sequel "Greater Gotham" leaves off, then on through the Depression and the
 * Second World War. Wallace's third volume, "Gotham at War" (2025), covers
 * 1933–1945; the 1920s fall between the books. The postwar era, to the
 * fiscal crisis of 1975, and the two after it, to the present, go past
 * them and are written from Wikipedia.
 */
export const TIME_MIN = -10000;
export const TIME_MAX = 2025;

export const eras: Era[] = [
  {
    id: "lenape",
    name: "Lenapehoking",
    subtitle: "The island before the city",
    start: TIME_MIN,
    end: 1609,
    color: "#586a4c",
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
    color: "#925821",
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
    color: "#77569f",
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
    color: "#2d6c8b",
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
    color: "#486f43",
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
    color: "#7b611c",
    summary:
      "The bloodiest riot in American history tore through Manhattan in 1863; Boss Tweed perfected municipal plunder; Morgan, Gould, and Vanderbilt made Wall Street the world's counting-house. Elevated railroads, tenements, the Brooklyn Bridge, and the Statue of Liberty defined the skyline of 'the other half' and the half above it, until Greater New York united five boroughs on January 1, 1898.",
    wikiTitle: "Gilded Age",
  },
  {
    id: "greaterNY",
    name: "Greater New York",
    subtitle: "The imperial city, 1898–1919",
    start: 1898,
    end: 1919,
    color: "#3f5573",
    summary:
      "The consolidated city of 3.4 million dug subways, raised steel towers, and absorbed the greatest immigration wave in its history through Ellis Island. Skyscrapers, the Triangle fire, ragtime, suffrage marches, and Great War mobilization carried New York to 1919 — capital of capital, second city of the world and gaining on London — where Wallace's 'Greater Gotham' closes.",
    wikiTitle: "History of New York City (1898–1945)",
  },
  {
    id: "capitalWorld",
    name: "Capital of the World",
    subtitle: "Jazz Age, Depression, and war, 1919–1945",
    start: 1919,
    end: 1945,
    color: "#6e4561",
    summary:
      "Prohibition, the Harlem Renaissance, and a building boom that raised the Chrysler and Empire State towers ended in the 1929 crash and shantytowns in Central Park. La Guardia's city hall and Robert Moses's bridges, parkways, pools, and public housing rebuilt the city with New Deal money; the 1939 World's Fair sold 'the World of Tomorrow' on a Queens ash dump, and the port and Navy Yard sent a war overseas until V-J Day filled Times Square.",
    wikiTitle: "History of New York City (1898–1945)",
  },
  {
    id: "postwar",
    name: "The Postwar City",
    subtitle: "Expressways, towers, and the fiscal crisis, 1945–1975",
    start: 1945,
    end: 1975,
    color: "#4a4f57",
    summary:
      "The richest city in the world came out of the war with its port, garment lofts, and factories at full stretch, and the UN on the East River. Then it remade itself: Robert Moses drove expressways through the Bronx and Brooklyn, public housing and urban renewal cleared whole neighborhoods, and the suburbs of Queens and Staten Island filled in. A million white New Yorkers left and as many Black and Puerto Rican New Yorkers arrived; the Dodgers and Giants went west; manufacturing and the docks faded. By 1975 the city could not pay its bills.",
    wikiTitle: "History of New York City (1946–1977)",
  },
  {
    id: "comeback",
    name: "The Comeback City",
    subtitle: "Bankruptcy, crack, and the long recovery, 1975–2001",
    start: 1975,
    end: 2001,
    color: "#3d5a6e",
    summary:
      "Saved from default in 1975 by the state and the unions' pension funds, the city went dark in the 1977 blackout and burned in the South Bronx, then rebuilt: Koch's housing program, Wall Street's boom, the crack epidemic and AIDS, the 1990s fall in crime, and a new wave of immigrants from the Caribbean, Latin America, Asia, and the former Soviet Union that carried the population past eight million.",
    wikiTitle: "History of New York City (1978–present)",
  },
  {
    id: "present",
    name: "The Twenty-First-Century City",
    subtitle: "September 11, Sandy, and the city today, 2001–present",
    start: 2001,
    end: TIME_MAX,
    color: "#5a4a6e",
    summary:
      "The September 11 attacks destroyed the World Trade Center and killed nearly 2,800 people. The city rebuilt downtown, rezoned whole waterfronts for towers, and reached a record population; Hurricane Sandy flooded its shores in 2012, and the COVID-19 pandemic struck it first and hardest in 2020.",
    wikiTitle: "History of New York City (1978–present)",
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
