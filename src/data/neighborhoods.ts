/**
 * Neighborhood and village names through time. Dates are when a name was in
 * common use, not legal incorporations; places are label positions, not
 * boundaries. Lenape place names before 1609 live in lenapeSites.ts.
 */

export interface Neighborhood {
  id: string;
  /** Label anchor [lon, lat]. */
  coords: [number, number];
  /** Names in order; each holds from its year until the next one's. */
  names: { name: string; from: number }[];
  /** Year the name fell out of use, if it did within the timeline. */
  to?: number;
  /** Major places show at lower zoom. */
  major?: boolean;
}

const n = (
  id: string,
  coords: [number, number],
  names: [string, number][],
  opts: { to?: number; major?: boolean } = {}
): Neighborhood => ({
  id,
  coords,
  names: names.map(([name, from]) => ({ name, from })),
  ...opts,
});

export const neighborhoods: Neighborhood[] = [
  // ----- Manhattan -----
  n("bouwerij", [-73.9885, 40.7295], [["Stuyvesant's Bouwerij", 1651]], { to: 1800 }),
  n("lispenard", [-74.0055, 40.7215], [["Lispenard Meadows", 1730]], { to: 1810 }),
  n("five-points", [-73.9995, 40.7152], [["Five Points", 1820]], { to: 1895 }),
  n("chinatown", [-73.9975, 40.7158], [["Chinatown", 1880]]),
  n("little-italy", [-73.9975, 40.7195], [["Little Italy", 1885]]),
  n("les", [-73.986, 40.716], [["Lower East Side", 1895]], { major: true }),
  n("greenwich", [-74.0015, 40.7335], [["Greenwich", 1713], ["Greenwich Village", 1830]], { major: true }),
  n("chelsea", [-74.0005, 40.7465], [["Chelsea", 1750]]),
  n("gramercy", [-73.9855, 40.7378], [["Gramercy Park", 1840]]),
  n("kips-bay", [-73.978, 40.7415], [["Kips Bay", 1655]]),
  n("murray-hill", [-73.978, 40.748], [["Murray Hill", 1850]]),
  n("tenderloin", [-73.9905, 40.7475], [["The Tenderloin", 1876]], { to: 1915 }),
  n("tin-pan-alley", [-73.9895, 40.7455], [["Tin Pan Alley", 1890]], { to: 1935 }),
  n("turtle-bay", [-73.967, 40.7525], [["Turtle Bay", 1640]]),
  n("times-square", [-73.9855, 40.758], [["Longacre Square", 1872], ["Times Square", 1904]], { major: true }),
  n("hells-kitchen", [-73.9935, 40.7635], [["Hell's Kitchen", 1880]]),
  n("san-juan-hill", [-73.9885, 40.7705], [["San Juan Hill", 1900]]),
  n("bloomingdale", [-73.975, 40.7955], [["Bloomingdale", 1700], ["Upper West Side", 1895]], { major: true }),
  n("yorkville", [-73.949, 40.7765], [["Yorkville", 1790]], { major: true }),
  n("harlem", [-73.9442, 40.8095], [["Nieuw Haarlem", 1658], ["Harlem", 1664]], { major: true }),
  n("manhattanville", [-73.957, 40.8155], [["Manhattanville", 1806]]),
  n("sugar-hill", [-73.9435, 40.8265], [["Sugar Hill", 1920]]),
  n("washington-heights", [-73.939, 40.8445], [["Washington Heights", 1890]], { major: true }),
  n("inwood", [-73.9215, 40.8675], [["Inwood", 1864]]),

  // ----- Brooklyn -----
  n("brooklyn-heights", [-73.9955, 40.6962], [["Breuckelen", 1646], ["Brooklyn Village", 1664], ["Brooklyn Heights", 1820]], { major: true }),
  n("red-hook", [-74.0095, 40.6765], [["Red Hook", 1636]]),
  n("williamsburg", [-73.957, 40.7105], [["Williamsburgh", 1827], ["Williamsburg", 1855]], { major: true }),
  n("greenpoint", [-73.951, 40.7295], [["Greenpoint", 1850]]),
  n("bushwick", [-73.9185, 40.6945], [["Boswijck", 1661], ["Bushwick", 1700]], { major: true }),
  n("bedford", [-73.9545, 40.686], [["Bedford", 1670]], { to: 1935 }),
  n("bed-stuy", [-73.9415, 40.6835], [["Bedford-Stuyvesant", 1935]], { major: true }),
  n("park-slope", [-73.9795, 40.672], [["Park Slope", 1880]]),
  n("crown-heights", [-73.9449, 40.6694], [["Crown Heights", 1916]]),
  n("flatbush", [-73.9595, 40.6415], [["Midwout", 1652], ["Flatbush", 1664]], { major: true }),
  n("flatlands", [-73.9335, 40.6215], [["Nieuw Amersfoort", 1647], ["Flatlands", 1664]]),
  n("new-utrecht", [-73.9965, 40.6045], [["New Utrecht", 1657]]),
  n("bay-ridge", [-74.0282, 40.6263], [["Yellow Hook", 1700], ["Bay Ridge", 1853]]),
  n("gravesend", [-73.9725, 40.5975], [["Gravesend", 1645]]),
  n("sheepshead-bay", [-73.944, 40.5865], [["Sheepshead Bay", 1870]]),
  n("coney-island", [-73.978, 40.5755], [["Coney Island", 1664]], { major: true }),
  n("canarsie", [-73.9025, 40.6395], [["Canarsie", 1665]]),
  n("east-new-york", [-73.8825, 40.6665], [["East New York", 1835]]),
  n("brownsville", [-73.9105, 40.6625], [["Brownsville", 1886]]),

  n("fort-greene", [-73.975, 40.687], [["Fort Greene", 1850]]),
  n("clinton-hill", [-73.96, 40.69], [["Clinton Hill", 1840]]),
  n("south-brooklyn", [-73.998, 40.681], [["South Brooklyn", 1846]]),
  n("prospect-heights", [-73.9694, 40.6778], [["Prospect Heights", 1895]]),
  n("windsor-terrace", [-73.979, 40.655], [["Windsor Terrace", 1851]]),
  n("kensington-bk", [-73.9732, 40.6385], [["Kensington", 1885]]),
  n("borough-park", [-73.993, 40.634], [["Borough Park", 1902]]),
  n("bensonhurst", [-74.002, 40.603], [["Bensonhurst", 1887]]),
  n("dyker-heights", [-74.007, 40.62], [["Dyker Heights", 1895]]),
  n("brighton-beach", [-73.96, 40.58], [["Brighton Beach", 1878]]),
  n("manhattan-beach", [-73.944, 40.578], [["Manhattan Beach", 1877]]),
  n("ocean-hill", [-73.908, 40.68], [["Ocean Hill", 1890]]),
  n("cypress-hills", [-73.875, 40.681], [["Cypress Hills", 1880]]),
  n("vinegar-hill", [-73.981, 40.702], [["Vinegar Hill", 1800]]),
  n("wallabout", [-73.9694, 40.6936], [["Wallabout", 1640]]),
  n("gowanus", [-73.9911, 40.6753], [["Gowanus", 1640]]),
  n("weeksville", [-73.9254, 40.674], [["Weeksville", 1838]], { to: 1900 }),
  n("bergen-beach", [-73.907, 40.62], [["Bergen Beach", 1895]]),
  n("sea-gate", [-74.008, 40.5772], [["Sea Gate", 1899]]),
  n("fort-hamilton", [-74.0308, 40.6061], [["Fort Hamilton", 1826]]),
  n("bath-beach", [-74.003, 40.602], [["Bath Beach", 1880]]),

  // ----- Queens -----
  n("astoria", [-73.924, 40.7644], [["Hallett's Cove", 1652], ["Astoria", 1839]], { major: true }),
  n("lic", [-73.9405, 40.7447], [["Hunters Point", 1830], ["Long Island City", 1870]], { major: true }),
  n("maspeth", [-73.9125, 40.7234], [["Mespat", 1642], ["Maspeth", 1700]]),
  n("sunnyside", [-73.9205, 40.7432], [["Sunnyside", 1910]]),
  n("elmhurst", [-73.8795, 40.7365], [["Middelburgh", 1652], ["Newtown", 1665], ["Elmhurst", 1896]], { major: true }),
  n("jackson-heights", [-73.8831, 40.7557], [["Jackson Heights", 1916]]),
  n("corona", [-73.8625, 40.7449], [["Corona", 1872]]),
  n("flushing", [-73.8305, 40.7641], [["Vlissingen", 1645], ["Flushing", 1664]], { major: true }),
  n("college-point", [-73.8455, 40.7865], [["College Point", 1850]]),
  n("forest-hills", [-73.8445, 40.7185], [["Forest Hills", 1909]]),
  n("richmond-hill", [-73.8315, 40.6958], [["Richmond Hill", 1868]]),
  n("jamaica", [-73.7996, 40.7027], [["Rustdorp", 1656], ["Jamaica", 1664]], { major: true }),
  n("far-rockaway", [-73.755, 40.6045], [["Far Rockaway", 1835]]),

  n("woodside", [-73.905, 40.745], [["Woodside", 1867]]),
  n("ridgewood", [-73.9019, 40.7047], [["Ridgewood", 1870]]),
  n("glendale", [-73.88, 40.7], [["Glendale", 1860]]),
  n("middle-village", [-73.88, 40.72], [["Middle Village", 1816]]),
  n("ozone-park", [-73.85, 40.68], [["Ozone Park", 1882]]),
  n("woodhaven", [-73.8525, 40.691], [["Woodville", 1835], ["Woodhaven", 1853]]),
  n("howard-beach", [-73.84, 40.658], [["Ramblersville", 1905], ["Howard Beach", 1916]]),
  n("arverne", [-73.795, 40.59], [["Arverne", 1888]]),
  n("rockaway-beach", [-73.812, 40.586], [["Rockaway Beach", 1880]]),
  n("bayside", [-73.77, 40.76], [["Bay Side", 1798], ["Bayside", 1860]]),
  n("whitestone", [-73.81, 40.79], [["Whitestone", 1700]]),
  n("little-neck", [-73.736, 40.763], [["Little Neck", 1660]]),
  n("douglaston", [-73.748, 40.769], [["Douglaston", 1876]]),
  n("hollis", [-73.76, 40.71], [["Hollis", 1885]]),
  n("queens-village", [-73.74, 40.715], [["Brushville", 1837], ["Queens", 1856], ["Queens Village", 1923]]),
  n("st-albans", [-73.765, 40.69], [["St. Albans", 1892]]),
  n("kew-gardens", [-73.825, 40.705], [["Kew Gardens", 1910]]),
  n("rego-park", [-73.86, 40.725], [["Rego Park", 1925]]),

  // ----- The Bronx -----
  n("mott-haven", [-73.9225, 40.8095], [["Mott Haven", 1849]]),
  n("morrisania", [-73.906, 40.829], [["Morrisania", 1670]], { major: true }),
  n("hunts-point", [-73.882, 40.8126], [["Hunts Point", 1670]]),
  n("westchester", [-73.8445, 40.8406], [["Oostdorp", 1654], ["Westchester", 1664]]),
  n("throggs-neck", [-73.8195, 40.8205], [["Throggs Neck", 1650]]),
  n("fordham", [-73.8985, 40.8615], [["Fordham", 1671]], { major: true }),
  n("belmont", [-73.8875, 40.855], [["Belmont", 1900]]),
  n("kingsbridge", [-73.905, 40.8785], [["Kingsbridge", 1693]]),
  n("riverdale", [-73.912, 40.8993], [["Riverdale", 1853]]),
  n("city-island", [-73.7865, 40.847], [["City Island", 1761]]),

  n("melrose", [-73.91, 40.825], [["Melrose", 1850]]),
  n("tremont", [-73.906, 40.85], [["Tremont", 1850]]),
  n("highbridge-bx", [-73.929, 40.837], [["Highbridge", 1848]]),
  n("bedford-park", [-73.886, 40.87], [["Bedford Park", 1880]]),
  n("norwood", [-73.878, 40.878], [["Norwood", 1910]]),
  n("williamsbridge", [-73.866, 40.877], [["Williamsbridge", 1700]]),
  n("wakefield", [-73.852, 40.897], [["Wakefield", 1890]]),
  n("eastchester", [-73.83, 40.882], [["Eastchester", 1666]]),
  n("clason-point", [-73.85, 40.806], [["Cornell's Neck", 1643], ["Clason Point", 1800]]),
  n("port-morris", [-73.9097, 40.8017], [["Port Morris", 1842]]),
  n("longwood", [-73.899, 40.816], [["Longwood", 1900]]),
  n("university-heights", [-73.909, 40.86], [["University Heights", 1894]]),
  n("spuyten-duyvil", [-73.917, 40.881], [["Spuyten Duyvil", 1650]]),
  n("fieldston", [-73.903, 40.894], [["Fieldston", 1909]]),
  n("west-farms", [-73.878, 40.84], [["West Farms", 1690]]),
  n("unionport", [-73.853, 40.829], [["Unionport", 1852]]),

  // ----- Staten Island -----
  n("oude-dorp", [-74.0715, 40.5985], [["Oude Dorp", 1661]], { to: 1700 }),
  n("richmond", [-74.1455, 40.5708], [["Cocclestown", 1690], ["Richmond", 1730]], { major: true }),
  n("new-brighton", [-74.093, 40.6433], [["New Brighton", 1834]]),
  n("st-george", [-74.0776, 40.6437], [["St. George", 1886]]),
  n("stapleton", [-74.0775, 40.6269], [["Stapleton", 1833]]),
  n("port-richmond", [-74.1325, 40.6355], [["Port Richmond", 1836]]),
  n("tottenville", [-74.2465, 40.5095], [["Tottenville", 1869]]),
  n("tompkinsville", [-74.0858, 40.6339], [["Tompkinsville", 1815]]),
  n("new-dorp", [-74.1156, 40.5736], [["New Dorp", 1671]]),
  n("great-kills", [-74.151, 40.55], [["Great Kills", 1865]]),
  n("rossville", [-74.217, 40.541], [["Rossville", 1837]]),
  n("west-brighton", [-74.112, 40.635], [["West New Brighton", 1872]]),
  n("mariners-harbor", [-74.157, 40.636], [["Mariners Harbor", 1850]]),
  n("westerleigh", [-74.1369, 40.6181], [["Prohibition Park", 1887], ["Westerleigh", 1905]]),
  n("midland-beach", [-74.094, 40.573], [["Midland Beach", 1897]]),
  n("south-beach", [-74.067, 40.59], [["South Beach", 1886]]),
  n("travis", [-74.1872, 40.5936], [["Linoleumville", 1873], ["Travis", 1931]]),
];

/** The name a place goes by in `year`, or null if it has none yet (or any longer). */
export function neighborhoodName(nb: Neighborhood, year: number): string | null {
  if (year < nb.names[0].from) return null;
  if (nb.to !== undefined && year > nb.to) return null;
  let name = nb.names[0].name;
  for (const entry of nb.names) if (year >= entry.from) name = entry.name;
  return name;
}

/** Fade in over five years after a place is first named, out before it ends. */
export function neighborhoodOpacity(nb: Neighborhood, year: number): number {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const inFade = clamp((year - nb.names[0].from + 1) / 5);
  const outFade = nb.to === undefined ? 1 : clamp((nb.to - year + 1) / 5);
  return inFade * outFade;
}
