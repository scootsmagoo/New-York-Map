/**
 * Guided tours: scripted camera + timeline paths through the city's story.
 * Each stop sets the playhead year and (optionally) flies the map to a point
 * at a zoom level; stops may link to an entry for the full Wikipedia card.
 */

export interface MapFocus {
  coords: [number, number];
  /** d3-zoom scale factor, 1 (whole city) to 16. */
  k: number;
}

export interface TourStop {
  year: number;
  title: string;
  text: string;
  /** Map target; omit to pull back to the whole city. */
  focus?: MapFocus;
  /** Timeline span in unit space (default ≈ 18 years). */
  span?: number;
  /** Entry id for a "Read more" link. */
  entryId?: string;
}

export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  stops: TourStop[];
}

export const tours: Tour[] = [
  {
    id: "grid",
    title: "The Grid Marches North",
    subtitle: "From the 1811 plan to a built-out island",
    stops: [
      {
        year: 1811,
        title: "Twelve avenues, 155 streets, almost no parks",
        text:
          "The Commissioners' Plan ruled Manhattan into rectangles from Houston Street to 155th. Surveyor John Randel Jr. drove marble markers through farms and hills whose owners sometimes set their dogs on him. Zoom in: the faint dashed lines are the survey, and solid streets follow only as they are actually opened.",
        focus: { coords: [-73.987, 40.742], k: 3.2 },
        entryId: "grid-plan",
      },
      {
        year: 1835,
        title: "Filling in below Fourteenth Street",
        text:
          "Erie Canal money and a land boom pushed the built city past Union Square. Hills were leveled and the leveled earth dumped into marshes, so the survey lines could become streets. The panic of 1837 stalled it all for a few years.",
        focus: { coords: [-73.99, 40.733], k: 3.6 },
        entryId: "erie-canal",
      },
      {
        year: 1858,
        title: "A hole punched in the grid",
        text:
          "The plan had made almost no room for parks, so in 1853 the state took more than 700 acres between 59th and 106th Streets. Seneca Village and other settlements were cleared, and Olmsted and Vaux's Greensward plan won the design competition in 1858. The park draws itself in construction hatching until it is finished in 1873.",
        focus: { coords: [-73.9665, 40.782], k: 3.4 },
        entryId: "central-park-begun",
      },
      {
        year: 1880,
        title: "The els open the upper island",
        text:
          "Elevated railroads up Ninth, Sixth, Third, and Second Avenues let a clerk live at 100th Street and work on Wall Street. The built frontier, which had crept a few blocks a decade, jumps north through the 1880s.",
        focus: { coords: [-73.972, 40.78], k: 3.2 },
        entryId: "el-railroads",
      },
      {
        year: 1905,
        title: "Subway to Harlem",
        text:
          "The IRT ran from City Hall to 145th Street on its opening day in 1904. Harlem's brownstones, overbuilt in the 1890s boom, went unrented until Philip Payton's Afro-American Realty Company began leasing them to Black families.",
        focus: { coords: [-73.945, 40.812], k: 3.2 },
        entryId: "subway-opens",
      },
      {
        year: 1919,
        title: "The plan fulfilled",
        text:
          "By 1919 the grid was built solid from the Battery to the Harlem River, and Greater New York held five and a half million people across five boroughs. Randel's marble markers were long buried under asphalt.",
        entryId: "harlem-rising",
      },
    ],
  },
  {
    id: "east-river",
    title: "Crossing the East River",
    subtitle: "A rowboat, a steam ferry, a poem, and a bridge",
    stops: [
      {
        year: 1642,
        title: "Dircksen's ferry",
        text:
          "Cornelis Dircksen rowed passengers from a landing near Peck Slip to the Long Island shore, blowing a horn to summon him from his farm. Breuckelen was chartered four years later. The dashed line on the map is that crossing.",
        focus: { coords: [-73.997, 40.706], k: 4 },
        entryId: "breuckelen",
      },
      {
        year: 1814,
        title: "Fulton's steam ferry",
        text:
          "Robert Fulton's Nassau began steam service in 1814, crossing in about twelve minutes regardless of wind and tide. Brooklyn Heights became something new in America: a suburb of commuters.",
        focus: { coords: [-73.995, 40.703], k: 4 },
        entryId: "fulton",
      },
      {
        year: 1856,
        title: "Crossing Brooklyn Ferry",
        text:
          "Walt Whitman, a Brooklyn printer and editor, published his ferry poem in 1856: \"Flood-tide below me! I see you face to face!\" He wrote for the passengers of a hundred years hence, who he was sure would cross the same water.",
        focus: { coords: [-73.99, 40.7], k: 3.8 },
        entryId: "whitman",
      },
      {
        year: 1870,
        title: "Roebling's towers rise",
        text:
          "John Roebling died of tetanus in 1869 after a ferry crushed his foot while he surveyed the site. His son Washington took over and sank the caissons in 1870; working in compressed air on the riverbed gave the men the bends, and eventually crippled Washington himself.",
        focus: { coords: [-73.9965, 40.7061], k: 4.2 },
        entryId: "brooklyn-bridge-opens",
      },
      {
        year: 1883,
        title: "The bridge opens",
        text:
          "On May 24, 1883, the longest suspension bridge in the world opened with fireworks and a presidential visit. A week later a stampede on the promenade killed twelve people. Watch the Fulton Ferry's dashed line fade as the bridge takes its traffic.",
        focus: { coords: [-73.9965, 40.7061], k: 3.5 },
        entryId: "brooklyn-bridge-opens",
      },
      {
        year: 1898,
        title: "One city",
        text:
          "Brooklyn, the nation's fourth-largest city, approved consolidation in 1894 by a few hundred votes. On January 1, 1898, Greater New York was born, and the East River became a boundary between boroughs rather than cities.",
        entryId: "low",
      },
    ],
  },
  {
    id: "fire-water",
    title: "Fire and Water",
    subtitle: "How cholera and a great fire brought the Croton to Manhattan",
    stops: [
      {
        year: 1832,
        title: "Cholera at Five Points",
        text:
          "Cholera arrived in June 1832 and killed some 3,500 New Yorkers, hitting Five Points hardest. The neighborhood sat on the filled Collect Pond, and its wells drew from the same wet ground as its privies. Anyone who could afford to fled the city.",
        focus: { coords: [-74.0005, 40.7145], k: 4.5 },
        entryId: "five-points",
      },
      {
        year: 1835,
        title: "The Great Fire",
        text:
          "On a December night so cold the hydrants and wells froze, fire took nearly 700 buildings in the merchant district below Wall Street. Firemen watched the East River freeze around their engines. The city needed water it could count on.",
        focus: { coords: [-74.008, 40.705], k: 4.5 },
        entryId: "great-fire-1835",
      },
      {
        year: 1842,
        title: "Croton water arrives",
        text:
          "Water from the Croton River, forty miles up the Hudson valley, reached the Distributing Reservoir on Murray Hill on July 4, 1842. The October celebration ran a parade five miles long. The aqueduct's line crosses the map from the north.",
        focus: { coords: [-73.9836, 40.7536], k: 3.6 },
        entryId: "croton",
      },
      {
        year: 1848,
        title: "High Bridge",
        text:
          "The aqueduct crossed the Harlem River on stone arches modeled on Roman work, finished in 1848. It was the city's first bridge to the mainland still standing, and a favorite Sunday walk for a century.",
        focus: { coords: [-73.93, 40.842], k: 4 },
        entryId: "highbridge",
      },
      {
        year: 1900,
        title: "From reservoir to library",
        text:
          "The reservoir's Egyptian-style walls, a promenade with views to both rivers, came down in 1899 once larger reservoirs in Central Park took over. The Public Library opened on the site in 1911. The map keeps a faint ghost where it stood.",
        focus: { coords: [-73.9836, 40.7536], k: 4.5 },
        entryId: "croton-reservoir",
      },
    ],
  },
  {
    id: "moses",
    title: "The Power Broker's City",
    subtitle: "Bridges, parks, and a World's Fair, 1931–1945",
    stops: [
      {
        year: 1931,
        title: "A bridge twice as long as any before",
        text:
          "The Port Authority opened Othmar Ammann's George Washington Bridge in 1931, early in the Depression. Its 3,500-foot span was nearly double the old record. It was the new scale of building that Robert Moses would make his own.",
        focus: { coords: [-73.953, 40.852], k: 3.4 },
        entryId: "gw-bridge",
      },
      {
        year: 1934,
        title: "One man, a dozen jobs",
        text:
          "When La Guardia took office in 1934 he made Moses parks commissioner of all five boroughs. Moses already ran the Long Island State Park Commission, and soon he ran the Triborough Bridge Authority too. With federal relief money he put tens of thousands of men to work rebuilding nearly every park in the city within a year.",
        entryId: "robert-moses",
      },
      {
        year: 1936,
        title: "Three boroughs and a toll booth",
        text:
          "The Triborough Bridge joined Manhattan, Queens, and the Bronx at Randalls Island in July 1936, the same summer eleven huge new swimming pools opened. Its tolls paid Moses's authority year after year, money that no mayor or governor could touch.",
        focus: { coords: [-73.926, 40.791], k: 4.2 },
        entryId: "triborough",
      },
      {
        year: 1939,
        title: "The World of Tomorrow on an ash dump",
        text:
          "Moses backed the World's Fair so the Corona ash dumps would be filled, graded, and handed back as a park. The map hatches Flushing Meadows as a construction site until the fair opens in April 1939.",
        focus: { coords: [-73.845, 40.745], k: 3.6 },
        entryId: "worlds-fair-1939",
      },
      {
        year: 1940,
        title: "Roads to the suburbs",
        text:
          "The Bronx–Whitestone Bridge opened in time for fairgoers, and the new municipal airport at North Beach opened in December 1939. Parkways ran out toward Long Island's beaches, built for private cars at a time when most New Yorkers rode the subway.",
        focus: { coords: [-73.85, 40.795], k: 3 },
        entryId: "laguardia-airport",
      },
      {
        year: 1945,
        title: "The expressway years ahead",
        text:
          "By V-J Day Moses had built more public works than anyone else in the city's history, and the largest were still ahead: the expressways, the housing projects, and the neighborhoods cleared to make room for them. This timeline stops here, in 1945.",
        entryId: "vj-day",
      },
    ],
  },
];

export function tourById(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
