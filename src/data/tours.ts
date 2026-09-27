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

export type TourLayer =
  | "lostLandscape"
  | "neighborhoods"
  | "streetLabels"
  | "calamities"
  | "waterfront"
  | "streetcars";

export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  stops: TourStop[];
  /** Map layers the tour turns on when it starts. */
  layers?: TourLayer[];
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
        text: "The Commissioners' Plan ruled Manhattan into rectangles from Houston Street to 155th. Surveyor John Randel Jr. drove marble markers through farms and hills whose owners sometimes set their dogs on him. Zoom in: the faint dashed lines are the survey, and solid streets follow only as they are actually opened.",
        focus: { coords: [-73.987, 40.742], k: 3.2 },
        entryId: "grid-plan",
      },
      {
        year: 1835,
        title: "Filling in below Fourteenth Street",
        text: "Erie Canal money and a land boom pushed the built city past Union Square. Hills were leveled and the leveled earth dumped into marshes, so the survey lines could become streets. The panic of 1837 stalled it all for a few years.",
        focus: { coords: [-73.99, 40.733], k: 3.6 },
        entryId: "erie-canal",
      },
      {
        year: 1858,
        title: "A hole punched in the grid",
        text: "The plan had made almost no room for parks, so in 1853 the state took more than 700 acres between 59th and 106th Streets. Seneca Village and other settlements were cleared, and Olmsted and Vaux's Greensward plan won the design competition in 1858. The park draws itself in construction hatching until it is finished in 1873.",
        focus: { coords: [-73.9665, 40.782], k: 3.4 },
        entryId: "central-park-begun",
      },
      {
        year: 1880,
        title: "The els open the upper island",
        text: "Elevated railroads up Ninth, Sixth, Third, and Second Avenues let a clerk live at 100th Street and work on Wall Street. The built frontier, which had crept a few blocks a decade, jumps north through the 1880s.",
        focus: { coords: [-73.972, 40.78], k: 3.2 },
        entryId: "el-railroads",
      },
      {
        year: 1905,
        title: "Subway to Harlem",
        text: "The IRT ran from City Hall to 145th Street on its opening day in 1904. Harlem's brownstones, overbuilt in the 1890s boom, went unrented until Philip Payton's Afro-American Realty Company began leasing them to Black families.",
        focus: { coords: [-73.945, 40.812], k: 3.2 },
        entryId: "subway-opens",
      },
      {
        year: 1919,
        title: "The plan fulfilled",
        text: "By 1919 the grid was built solid from the Battery to the Harlem River, and Greater New York held five and a half million people across five boroughs. Randel's marble markers were long buried under asphalt.",
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
        text: "Cornelis Dircksen rowed passengers from a landing near Peck Slip to the Long Island shore, blowing a horn to summon him from his farm. Breuckelen was chartered four years later. The dashed line on the map is that crossing.",
        focus: { coords: [-73.997, 40.706], k: 4 },
        entryId: "breuckelen",
      },
      {
        year: 1814,
        title: "Fulton's steam ferry",
        text: "Robert Fulton's Nassau began steam service in 1814, crossing in about twelve minutes regardless of wind and tide. Brooklyn Heights became something new in America: a suburb of commuters.",
        focus: { coords: [-73.995, 40.703], k: 4 },
        entryId: "fulton",
      },
      {
        year: 1856,
        title: "Crossing Brooklyn Ferry",
        text: 'Walt Whitman, a Brooklyn printer and editor, published his ferry poem in 1856: "Flood-tide below me! I see you face to face!" He wrote for the passengers of a hundred years hence, who he was sure would cross the same water.',
        focus: { coords: [-73.99, 40.7], k: 3.8 },
        entryId: "whitman",
      },
      {
        year: 1870,
        title: "Roebling's towers rise",
        text: "John Roebling died of tetanus in 1869 after a ferry crushed his foot while he surveyed the site. His son Washington took over and sank the caissons in 1870; working in compressed air on the riverbed gave the men the bends, and eventually crippled Washington himself.",
        focus: { coords: [-73.9965, 40.7061], k: 4.2 },
        entryId: "brooklyn-bridge-opens",
      },
      {
        year: 1883,
        title: "The bridge opens",
        text: "On May 24, 1883, the longest suspension bridge in the world opened with fireworks and a presidential visit. A week later a stampede on the promenade killed twelve people. Watch the Fulton Ferry's dashed line fade as the bridge takes its traffic.",
        focus: { coords: [-73.9965, 40.7061], k: 3.5 },
        entryId: "brooklyn-bridge-opens",
      },
      {
        year: 1898,
        title: "One city",
        text: "Brooklyn, the nation's fourth-largest city, approved consolidation in 1894 by a few hundred votes. On January 1, 1898, Greater New York was born, and the East River became a boundary between boroughs rather than cities.",
        entryId: "low",
      },
    ],
  },
  {
    id: "fire-water",
    title: "Fire and Water",
    subtitle: "How cholera and a great fire brought the Croton to Manhattan",
    layers: ["calamities"],
    stops: [
      {
        year: 1832,
        title: "Cholera at Five Points",
        text: "Cholera arrived in June 1832 and killed some 3,500 New Yorkers, hitting Five Points hardest. The neighborhood sat on the filled Collect Pond, and its wells drew from the same wet ground as its privies. Anyone who could afford to fled the city.",
        focus: { coords: [-74.0005, 40.7145], k: 4.5 },
        entryId: "five-points",
      },
      {
        year: 1835,
        title: "The Great Fire",
        text: "On a December night so cold the hydrants and wells froze, fire took nearly 700 buildings in the merchant district from Maiden Lane to Coenties Slip. Firemen watched the East River freeze around their engines. The city needed water it could count on.",
        focus: { coords: [-74.008, 40.705], k: 4.5 },
        entryId: "great-fire-1835",
      },
      {
        year: 1842,
        title: "Croton water arrives",
        text: "Water from the Croton River, forty miles up the Hudson valley, reached the Distributing Reservoir on Murray Hill on July 4, 1842. The October celebration ran a parade five miles long. The aqueduct's line crosses the map from the north.",
        focus: { coords: [-73.9836, 40.7536], k: 3.6 },
        entryId: "croton",
      },
      {
        year: 1848,
        title: "High Bridge",
        text: "The aqueduct crossed the Harlem River on stone arches modeled on Roman work, finished in 1848. It was the city's first bridge to the mainland still standing, and a favorite Sunday walk for a century.",
        focus: { coords: [-73.93, 40.842], k: 4 },
        entryId: "highbridge",
      },
      {
        year: 1900,
        title: "From reservoir to library",
        text: "The reservoir's Egyptian-style walls, a promenade with views to both rivers, came down in 1899 once larger reservoirs in Central Park took over. The Public Library opened on the site in 1911. The map keeps a faint ghost where it stood.",
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
        text: "The Port Authority opened Othmar Ammann's George Washington Bridge in 1931, early in the Depression. Its 3,500-foot span was nearly double the old record. It was the new scale of building that Robert Moses would make his own.",
        focus: { coords: [-73.953, 40.852], k: 3.4 },
        entryId: "gw-bridge",
      },
      {
        year: 1934,
        title: "One man, a dozen jobs",
        text: "When La Guardia took office in 1934 he made Moses parks commissioner of all five boroughs. Moses already ran the Long Island State Park Commission, and soon he ran the Triborough Bridge Authority too. With federal relief money he put tens of thousands of men to work rebuilding nearly every park in the city within a year.",
        entryId: "robert-moses",
      },
      {
        year: 1936,
        title: "Three boroughs and a toll booth",
        text: "The Triborough Bridge joined Manhattan, Queens, and the Bronx at Randalls Island in July 1936, the same summer eleven huge new swimming pools opened. Its tolls paid Moses's authority year after year, money that no mayor or governor could touch.",
        focus: { coords: [-73.926, 40.791], k: 4.2 },
        entryId: "triborough",
      },
      {
        year: 1939,
        title: "The World of Tomorrow on an ash dump",
        text: "Moses backed the World's Fair so the Corona ash dumps would be filled, graded, and handed back as a park. The map hatches Flushing Meadows as a construction site until the fair opens in April 1939.",
        focus: { coords: [-73.845, 40.745], k: 3.6 },
        entryId: "worlds-fair-1939",
      },
      {
        year: 1940,
        title: "Roads to the suburbs",
        text: "The Bronx–Whitestone Bridge opened in time for fairgoers, and the new municipal airport at North Beach opened in December 1939. Parkways ran out toward Long Island's beaches, built for private cars at a time when most New Yorkers rode the subway.",
        focus: { coords: [-73.85, 40.795], k: 3 },
        entryId: "laguardia-airport",
      },
      {
        year: 1945,
        title: "The expressway years ahead",
        text: "By V-J Day Moses had built more public works than anyone else in the city's history, and the largest were still ahead: the expressways, the housing projects, and the neighborhoods cleared to make room for them. This timeline stops here, in 1945.",
        entryId: "vj-day",
      },
    ],
  },
  {
    id: "horsecar-to-bus",
    title: "Horsecar to Bus",
    subtitle: "A century of streetcars, 1832–1945",
    layers: ["streetcars"],
    stops: [
      {
        year: 1832,
        title: "Rails on the Bowery",
        text: "In November 1832 the New York and Harlem Railroad began running horse-drawn cars on iron rails up the Bowery, the first street railway anywhere. Rails made a smoother and bigger ride than the omnibus, and the line pushed on up Fourth Avenue toward Harlem. Dotted lines are horsecars.",
        focus: { coords: [-73.9925, 40.7235], k: 4.2 },
        entryId: "harlem-railroad",
      },
      {
        year: 1856,
        title: "Brooklyn rides out",
        text: "From 1854 the Brooklyn City Railroad ran forty-passenger horsecars out Fulton and Myrtle Avenues from the ferries. Farmland in Bedford began selling to speculators, and Manhattan's avenues filled with lines of their own: Second, Third, Sixth, Eighth.",
        focus: { coords: [-73.97, 40.7], k: 2.4 },
      },
      {
        year: 1880,
        title: "Four fares to cross town",
        text: "Each line held a franchise cozened from the aldermen, paid the city little, and refused transfers to its rivals. Crossing Manhattan at 14th Street took three changes of car and four fares. Drivers worked sixteen-hour days for poor pay.",
        focus: { coords: [-73.99, 40.74], k: 3 },
      },
      {
        year: 1885,
        title: "Jacob Sharp buys Broadway",
        text: "For thirty years the Stewarts, Astors, and Goelets kept rails off lower Broadway. In 1884 Jacob Sharp spent some $200,000 on state legislators and half a million on the aldermen, and his cars ran down Broadway to the Battery the next year.",
        focus: { coords: [-74.008, 40.714], k: 4 },
      },
      {
        year: 1895,
        title: "Trolleys, and a strike",
        text: "Brooklyn went electric in the early 1890s, and its lines turned solid on the map. In January 1895 the trolley men struck every line; the mayor called out the militia, 7,500 soldiers in all, to keep the cars running.",
        focus: { coords: [-73.95, 40.68], k: 2.2 },
      },
      {
        year: 1916,
        title: "The last horsecar",
        text: "Manhattan's lines went electric around 1900 on current drawn from slots between the rails, but the Bleecker Street line kept its horses. When it closed in July 1917 it was the last horsecar line in New York.",
        focus: { coords: [-74.0005, 40.7285], k: 5 },
      },
      {
        year: 1945,
        title: "The buses win",
        text: "Most Manhattan lines gave way to buses in the 1930s. In 1945 La Guardia forced the Third Avenue line to buy 200 buses and its old cars were sold abroad; within two years Manhattan's trolleys were gone, and Brooklyn was their last stronghold.",
        focus: { coords: [-73.96, 40.73], k: 1.6 },
      },
    ],
  },
  {
    id: "island-remade",
    title: "The Island Remade",
    subtitle:
      "Ponds filled, streams buried, a shoreline pushed into the rivers",
    layers: ["lostLandscape"],
    stops: [
      {
        year: 1640,
        title: "Mannahatta's edge",
        text: "The dashed line is the island's own shore. Pearl Street was the waterfront (its name came from the oyster shells on the beach), and the Hudson lapped at what is now Greenwich Street. Everything drawn as river inside today's outline would be made by hand.",
        focus: { coords: [-74.009, 40.7075], k: 5 },
      },
      {
        year: 1730,
        title: "Water lots",
        text: "The city sold 'water lots' of river bottom to merchants, who sank timber cribs and old ships, filled them with earth and refuse, and built on top. Water Street was made this way by about 1700, Front Street by the 1790s. Watch the East River shore step outward as you move through the century.",
        focus: { coords: [-74.0055, 40.7065], k: 5.5 },
      },
      {
        year: 1795,
        title: "The Fresh Water, fouled",
        text: "The Collect Pond was the city's drinking water for a century, then its sewer: tanneries, breweries, and slaughterhouses lined the shore. It drained west through Lispenard Meadows along a ditch that became Canal Street.",
        focus: { coords: [-74.003, 40.717], k: 6 },
        entryId: "collect-pond-colonial",
      },
      {
        year: 1813,
        title: "Filling the Collect",
        text: "The city leveled Bayard's Mount and dumped it into the pond between 1803 and 1811. The ground settled and seeped, respectable families left, and Five Points grew on the damp fill. The pond's outline stays on the map as a ghost.",
        focus: { coords: [-74.0004, 40.7156], k: 7 },
        entryId: "five-points-emerges",
      },
      {
        year: 1815,
        title: "A fort offshore",
        text: "Castle Clinton was built from 1808 to 1811 on a rock about 200 feet out in the harbor, joined to the Battery by a wooden bridge. Filling pushed the Battery out to meet it by the 1850s; it became Castle Garden, the immigrant station before Ellis Island.",
        focus: { coords: [-74.0168, 40.7036], k: 7 },
        entryId: "castle-clinton",
      },
      {
        year: 1826,
        title: "Minetta Brook goes underground",
        text: "The Village's trout stream ran from near Madison Square past Washington Square to the Hudson. As the grid came through in the 1820s it was put in a culvert. It still runs under the streets; basements along its old course flood to this day.",
        focus: { coords: [-73.9985, 40.7305], k: 6 },
      },
      {
        year: 1850,
        title: "West Street and the waterfront",
        text: "By mid-century filling on the Hudson had reached West Street, with piers reaching past it. South Street on the East River was the busiest waterfront in the country. Lower Manhattan was now a third wider than the island the Lenape knew.",
        focus: { coords: [-74.011, 40.7135], k: 4.5 },
      },
      {
        year: 1940,
        title: "Still growing",
        text: "Riverside Park was extended into the Hudson over the West Side rail line, and the East River Drive went in on new fill; at East 25th Street, ships brought rubble from bombed Bristol as ballast, and it was dumped into the river there. The strip still drawn as river along the Hudson below Chambers Street is Battery Park City, built in the 1970s on the earth dug for the World Trade Center.",
        focus: { coords: [-74.005, 40.735], k: 2.6 },
      },
    ],
  },
  {
    id: "slavery-freedom",
    title: "Slavery and Freedom",
    subtitle:
      "Two centuries of bondage in a northern city, and what came after",
    stops: [
      {
        year: 1626,
        title: "The Company's slaves",
        text: "In 1625 or 1626 the West India Company brought eleven enslaved African men to build its fort, among them Paulo d'Angola, Simon Congo, and Anthony Portuguese. Slavery in New York is as old as the town itself.",
        focus: { coords: [-74.0137, 40.7043], k: 6 },
        entryId: "first-enslaved",
      },
      {
        year: 1644,
        title: "Half-freedom",
        text: 'After 18 or 19 years of labor, nine of the Company\'s men petitioned for freedom and got "half-freedom": small farms north of the town, in return for a yearly tribute of grain and a hog, work whenever the Company called, and children who stayed enslaved.',
        focus: { coords: [-73.998, 40.725], k: 4 },
      },
      {
        year: 1712,
        title: "A market and a revolt",
        text: "In 1711 the city made the Meal Market at the foot of Wall Street its official place to buy and hire slaves. The next April about two dozen enslaved men, most of them recently brought from the Gold Coast, set a fire and ambushed the whites who came to fight it, killing nine. Twenty were hanged and three burned alive.",
        focus: { coords: [-74.0075, 40.7057], k: 6 },
        entryId: "slave-revolt-1712",
      },
      {
        year: 1741,
        title: "The conspiracy trials",
        text: "By 1741 nearly one New Yorker in five was Black. After a string of fires, the courts believed a tavern plot of slaves and Catholics: seventeen Black men were hanged and thirteen burned at the stake, and seventy-two were banished from the colony.",
        focus: { coords: [-74.0055, 40.7138], k: 5.5 },
        entryId: "conspiracy-1741",
      },
      {
        year: 1779,
        title: "Behind British lines",
        text: "British proclamations promised freedom to slaves of rebels who reached their lines, and thousands ran to occupied New York. When the British left in 1783 their commander refused Washington's demand to return them, and perhaps four thousand sailed away free.",
        focus: { coords: [-74.009, 40.711], k: 4.5 },
        entryId: "evacuation-day",
      },
      {
        year: 1799,
        title: "Gradual emancipation",
        text: "The state's 1799 law freed no one then enslaved. Children born after July 4 were free in name, but bound to their mother's owner until 25 or 28. Slaveowners were spared almost every cost.",
        entryId: "gradual-emancipation",
      },
      {
        year: 1827,
        title: "Emancipation Day",
        text: "Slavery ended in New York on July 4, 1827. Black churches gave thanks that day; on July 5, four thousand people marched from St. John's Park past Zion Church to City Hall.",
        focus: { coords: [-74.0053, 40.7174], k: 6 },
        entryId: "emancipation-day-1827",
      },
      {
        year: 1835,
        title: "Vigilance",
        text: "Kidnappers seized free Black New Yorkers and sold them south. In 1835 David Ruggles set up the Committee of Vigilance to fight them in court and on the street, and sheltered fugitives on their way north, among them the young Frederick Douglass in 1838.",
        focus: { coords: [-74.004, 40.718], k: 5 },
        entryId: "ruggles-david",
      },
      {
        year: 1855,
        title: "Owning land",
        text: "Owning $250 of property gave a Black man the vote, and land was cheapest at the city's edge. Seneca Village, in the West 80s, held churches, a school, and Irish neighbors when the state took it for Central Park. In Brooklyn, Weeksville grew on old farmland.",
        focus: { coords: [-73.968, 40.7841], k: 4.5 },
        entryId: "seneca-village",
      },
      {
        year: 1863,
        title: "The Draft Riots",
        text: "In July 1863 mobs protesting the Civil War draft turned on Black New Yorkers. They burned the Colored Orphan Asylum on Fifth Avenue at 43rd Street, whose 237 children escaped, and lynched men in the streets. Many Black families left Manhattan for good.",
        focus: { coords: [-73.9805, 40.7545], k: 5 },
        entryId: "draft-riots",
      },
      {
        year: 1915,
        title: "Harlem",
        text: "Pushed from the Tenderloin and San Juan Hill, Black New Yorkers found room in Harlem's overbuilt brownstones. By the 1910s it was becoming the capital of Black America.",
        focus: { coords: [-73.9442, 40.8116], k: 3.4 },
        entryId: "harlem-rising",
      },
    ],
  },
  {
    id: "new-york-at-war",
    title: "New York at War",
    subtitle: "Nazis in the Garden, a U-boat at the harbor mouth, and V-J Day",
    stops: [
      {
        year: 1939,
        title: "Fission on 120th Street",
        text: "In January 1939 John Dunning and Enrico Fermi, a refugee from Mussolini's Italy, split uranium atoms with the cyclotron in the basement of Columbia's Pupin Hall. Three years later the Army's bomb project took an office at 270 Broadway and the borough's name: the Manhattan Engineer District.",
        focus: { coords: [-73.9615, 40.8101], k: 5 },
        entryId: "columbia-fission",
      },
      {
        year: 1939,
        title: "Nazis in the Garden",
        text: "On February 20, 1939, the German American Bund packed Madison Square Garden, then on Eighth Avenue at 50th Street, with swastikas flanking George Washington. Outside, about a hundred thousand protesters filled the avenue. It was the Bund's last big show.",
        focus: { coords: [-73.9872, 40.7622], k: 5.5 },
        entryId: "bund-rally-1939",
      },
      {
        year: 1940,
        title: "Battleships in Brooklyn",
        text: "The Navy Yard launched the battleship North Carolina in June 1940 before 50,000 people, and laid the keel of the even bigger Iowa two weeks later. It had 9,000 workers in 1939, over 20,000 by mid-1941, and 75,000 at its wartime peak.",
        focus: { coords: [-73.9712, 40.7022], k: 5 },
        entryId: "navy-yard-war",
      },
      {
        year: 1942,
        title: "A U-boat at the door",
        text: "Five weeks after Pearl Harbor, U-123 sank a tanker off Long Island on January 14, 1942, then crept toward the harbor and lay on the bottom all day, its crew listening to New York radio. Dozens of ships went down along the coast that winter.",
        focus: { coords: [-73.98, 40.55], k: 2.2 },
      },
      {
        year: 1942,
        title: "The Normandie rolls over",
        text: "On February 9, 1942, a worker's torch lit a pile of kapok life jackets aboard the Normandie, being turned into a troopship at Pier 88. Fireboats poured in water until she capsized in the Hudson. Investigators found carelessness, but the city suspected sabotage.",
        focus: { coords: [-73.9985, 40.7652], k: 5.5 },
        entryId: "normandie-fire",
      },
      {
        year: 1942,
        title: "The lights go down",
        text: "From April 29, 1942, Times Square went dark for the duration: 265,000 bulbs and 65 miles of neon switched off so ships offshore wouldn't be silhouetted for U-boats. The Statue of Liberty's torch was dimmed too, and Coney Island went black.",
        focus: { coords: [-73.9855, 40.758], k: 5 },
      },
      {
        year: 1943,
        title: "A war at home",
        text: "In April 1943 Met Life announced that Stuyvesant Town would be for whites only. On August 1 a policeman at a Harlem hotel shot a Black soldier, and a rumor that he had died set off a night of rioting along 125th Street.",
        focus: { coords: [-73.9493, 40.8105], k: 4.5 },
        entryId: "harlem-riot-1943",
      },
      {
        year: 1945,
        title: "V-J Day",
        text: "At 7:03 p.m. on August 14, 1945, the moving sign on the Times tower confirmed Japan's surrender. By ten o'clock two million people filled Times Square.",
        focus: { coords: [-73.9855, 40.758], k: 4 },
        entryId: "vj-day",
      },
    ],
  },
  {
    id: "riots",
    title: "A City of Riots",
    subtitle: "Who fought whom in New York's streets, and what it cost",
    stops: [
      {
        year: 1788,
        title: "The Doctors' Riot",
        text: "Rumors that medical students were digging up bodies from graveyards, including the Black burial ground, brought a crowd to the hospital on Broadway and then to the jail where the doctors hid. Militia fired and killed three. Gotham marks a first: no colonial official had ever ordered soldiers to fire on a crowd.",
        focus: { coords: [-74.0058, 40.7155], k: 5.5 },
        entryId: "doctors-riot",
      },
      {
        year: 1834,
        title: "Against the abolitionists",
        text: "In July 1834 crowds of butcher boys and laborers, egged on by well-dressed merchants, gutted Lewis Tappan's house on Rose Street and burned his furniture in the street. Then they stoned Black churches and homes. About five hundred Black New Yorkers fled their homes.",
        focus: { coords: [-74.0025, 40.7105], k: 5.5 },
      },
      {
        year: 1849,
        title: "Astor Place",
        text: 'Fans of the American actor Edwin Forrest hounded the English star Macready off the stage of the Astor Opera House, crying down the "codfish aristocracy." When he tried again on May 10, a crowd of thousands besieged the theater and the militia fired into it. Twenty-two were killed.',
        focus: { coords: [-73.991, 40.7295], k: 5.5 },
        entryId: "astor-place-riot",
      },
      {
        year: 1857,
        title: "Police against police",
        text: "When Albany replaced Mayor Wood's police with a state-run Metropolitan force, the city had two police departments. In June 1857 the Metropolitans marched on City Hall to arrest the mayor, and Wood's Municipals clubbed them down the steps.",
        focus: { coords: [-74.006, 40.7127], k: 5.5 },
        entryId: "city-hall-1812",
      },
      {
        year: 1863,
        title: "The Draft Riots",
        text: "Four days in July 1863 began as a protest at a draft office on Third Avenue and became a hunt for Black New Yorkers and the rich. People believed a thousand had died; 119 deaths were verified. Even the smaller number made it the largest civil disorder in American history.",
        focus: { coords: [-73.9755, 40.7515], k: 3.5 },
        entryId: "draft-riots",
      },
      {
        year: 1871,
        title: "The Orange Riots",
        text: "On July 12, 1871, Protestant Irish Orangemen marched down Eighth Avenue under militia guard. When stones flew, the guardsmen fired into the Catholic Irish crowd around 24th Street. More than sixty civilians were killed.",
        focus: { coords: [-73.9985, 40.747], k: 5 },
        entryId: "orange-riots",
      },
      {
        year: 1874,
        title: "Tompkins Square",
        text: "In the depression after 1873, unemployed workers rallied in Tompkins Square on January 13, 1874, to march on City Hall for relief. Mounted police charged and clubbed them for hours. Few were badly hurt, but Gotham calls it a turning point that hardened both sides of the class divide.",
        focus: { coords: [-73.9818, 40.7265], k: 5.5 },
      },
      {
        year: 1900,
        title: "The Tenderloin, 1900",
        text: "After a Black man killed a plainclothes policeman who had attacked him, white mobs on August 15, 1900, pulled Black passengers off Eighth Avenue trolleys and beat them. Police joined in. Seventy Black New Yorkers were badly hurt, and no one was indicted. Many moved uptown, to Harlem.",
        focus: { coords: [-73.9905, 40.7575], k: 5 },
      },
      {
        year: 1943,
        title: "Harlem, 1935 and 1943",
        text: "Twice in eight years a rumor that police had killed someone set off rioting along 125th Street: a boy caught shoplifting in 1935, a Black soldier in 1943. Both times, the damage fell on stores, and the causes lay in jobs, housing, and policing.",
        focus: { coords: [-73.9493, 40.8105], k: 4.5 },
        entryId: "harlem-riot-1943",
      },
    ],
  },
  {
    id: "rich-uptown",
    title: "The Rich Move Uptown",
    subtitle:
      "Two centuries of the wealthy running from commerce, up the island",
    stops: [
      {
        year: 1750,
        title: "The court end of town",
        text: "In the colonial city the grandest houses stood around Bowling Green and lower Broadway: Van Cortlandts, Livingstons, De Lanceys. Gotham notes the Green was never big or exclusive enough to be a truly genteel square.",
        focus: { coords: [-74.0134, 40.7048], k: 6 },
        entryId: "bowling-green",
      },
      {
        year: 1828,
        title: "A fenced park",
        text: "As shops, boardinghouses, and clerks crowded lower Broadway, the wealthy began their long, reluctant march uptown. In 1827 Trinity started selling lots around Hudson Square (St. John's Park), and buyers fenced the square and planted it. Hamiltons, Schuylers, and Tappans moved in.",
        focus: { coords: [-74.0078, 40.7213], k: 6 },
      },
      {
        year: 1833,
        title: "Marble on Bond Street",
        text: "Jonas Minturn's white marble house of 1820 set the style for Bond Street, lined with fine houses from Broadway to the Bowery by the mid-1830s. On Washington Square North, the row of Greek Revival houses went up from 1829 to 1833.",
        focus: { coords: [-73.9955, 40.729], k: 5.5 },
      },
      {
        year: 1859,
        title: "Fifth Avenue",
        text: "In 1834 Fifth Avenue above Washington Square was a nearly empty lane. By the late 1850s, when Caroline Astor's mansion went up at 34th Street beside her brother-in-law's, it was the richest street in America.",
        focus: { coords: [-73.9865, 40.7465], k: 4.5 },
        entryId: "mrs-astor",
      },
      {
        year: 1883,
        title: "Châteaux",
        text: "New railroad money built bigger. Alva Vanderbilt's copy of the Château de Blois, at Fifth Avenue and 52nd Street, opened with a costume ball in 1883 meant to outshine Mrs. Astor's circle. To get her daughter invited, Mrs. Astor had to send her calling card up Fifth Avenue.",
        focus: { coords: [-73.9763, 40.7597], k: 5 },
      },
      {
        year: 1902,
        title: "The Highlands of Fifth Avenue",
        text: "As hotels and stores pushed up Fifth Avenue, most of the rich moved on. Andrew Carnegie built a 64-room mansion at 91st Street, among farms and shanties, and sold the lots around it only to neighbors he approved of. Otto Kahn built a Roman palazzo at 91st Street too.",
        focus: { coords: [-73.9578, 40.7843], k: 4.5 },
      },
      {
        year: 1906,
        title: "Holding out",
        text: "Some refused to move. J. P. Morgan stayed in his brownstone at Madison Avenue and 36th Street and built his library next door in 1906. The Rockefellers dug in on West 54th Street.",
        focus: { coords: [-73.9814, 40.7493], k: 5 },
        entryId: "morgan",
      },
      {
        year: 1915,
        title: "Millionaires' Row",
        text: "By the 1910s Fifth Avenue was lined with mansions from the Rockefellers at 54th Street to Carnegie at 91st, and the side streets east of the park were full. In two centuries the fashionable city had moved about five miles north.",
        focus: { coords: [-73.968, 40.773], k: 2.6 },
      },
    ],
  },
];

export function tourById(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
