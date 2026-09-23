import type { Entry } from "../../types";

/**
 * 1919–1945. Burrows & Wallace's volumes stop at 1919, so these entries carry
 * no Gotham margin notes.
 */
export const capitalWorldEntries: Entry[] = [
  // ----- People -----
  {
    id: "garvey",
    era: "capitalWorld",
    kind: "person",
    title: "Marcus Garvey",
    wikiTitle: "Marcus Garvey",
    year: 1920,
    blurb:
      "Jamaican-born founder of the Universal Negro Improvement Association, who filled Madison Square Garden for its 1920 convention and ran the Black Star Line from Harlem's Liberty Hall until a mail-fraud conviction and deportation.",
  },
  {
    id: "jimmy-walker",
    era: "capitalWorld",
    kind: "person",
    title: "Jimmy Walker",
    wikiTitle: "Jimmy Walker",
    year: 1926,
    yearLabel: "1926–1932",
    blurb:
      "'Beau James,' Tammany's songwriting nightclub mayor of the Jazz Age, who resigned in 1932 as Judge Samuel Seabury's investigation laid out the graft beneath the charm.",
  },
  {
    id: "dorothy-day",
    era: "capitalWorld",
    kind: "person",
    title: "Dorothy Day",
    wikiTitle: "Dorothy Day",
    year: 1933,
    blurb:
      "Bohemian journalist turned Catholic radical who launched the Catholic Worker at a penny a copy in Union Square on May Day 1933 and ran houses of hospitality for the Depression's destitute.",
  },
  {
    id: "la-guardia",
    era: "capitalWorld",
    kind: "person",
    title: "Fiorello La Guardia",
    wikiTitle: "Fiorello La Guardia",
    year: 1934,
    yearLabel: "1934–1945",
    blurb:
      "The Little Flower: East Harlem's former congressman, Fusion mayor for three terms, who broke Tammany, unified the subways, courted New Deal dollars from Washington, and read the funny papers on the radio during a 1945 newspaper strike.",
  },
  {
    id: "robert-moses",
    era: "capitalWorld",
    kind: "person",
    title: "Robert Moses",
    wikiTitle: "Robert Moses",
    year: 1934,
    blurb:
      "Parks commissioner, Triborough chief, and holder of a dozen posts at once, who used New Deal money to build bridges, parkways, beaches, and swimming pools at a pace no one has matched since.",
  },

  // ----- Events -----
  {
    id: "wall-street-bombing",
    era: "capitalWorld",
    kind: "event",
    title: "Wall Street bombing",
    wikiTitle: "Wall Street bombing",
    year: 1920,
    coords: [-74.0104, 40.7066],
    blurb:
      "At noon on September 16, 1920, a horse-drawn wagon of dynamite exploded outside the J. P. Morgan bank, killing 38. Anarchists were suspected, no one was ever charged, and the pockmarks remain in the stone of 23 Wall Street.",
  },
  {
    id: "speakeasies",
    era: "capitalWorld",
    kind: "event",
    title: "Prohibition & the speakeasy",
    wikiTitle: "Speakeasy",
    year: 1925,
    yearLabel: "1920–1933",
    blurb:
      "Prohibition turned New York into the wettest dry city in America, with anywhere from 20,000 to 100,000 speakeasies by various counts, rum-runners on the harbor, and bootlegging fortunes for Arnold Rothstein, Lucky Luciano, and Dutch Schultz.",
  },
  {
    id: "harlem-renaissance",
    era: "capitalWorld",
    kind: "event",
    title: "The Harlem Renaissance",
    wikiTitle: "Harlem Renaissance",
    year: 1925,
    yearLabel: "1920s–1930s",
    coords: [-73.9407, 40.8144],
    blurb:
      "Langston Hughes, Zora Neale Hurston, Countee Cullen, and Alain Locke's anthology 'The New Negro' (1925) made Harlem the capital of Black America's arts and letters, around the 135th Street library that became the Schomburg Center.",
  },
  {
    id: "crash-1929",
    era: "capitalWorld",
    kind: "event",
    title: "The Crash of 1929",
    wikiTitle: "Wall Street crash of 1929",
    year: 1929,
    coords: [-74.0112, 40.7069],
    blurb:
      "Black Thursday and Black Tuesday, October 24 and 29, broke the great bull market on the floor of the Stock Exchange. By 1932 stocks had lost nearly 90 percent of their value and a quarter of the city's workers had no job.",
  },
  {
    id: "hooverville",
    era: "capitalWorld",
    kind: "event",
    title: "Hooverville in Central Park",
    wikiTitle: "Hooverville",
    year: 1931,
    yearLabel: "1930–1933",
    coords: [-73.967, 40.781],
    blurb:
      "Jobless men built shacks in the drained bed of Central Park's old reservoir and along the Hudson, and named the camps for the president they blamed. The park camp was cleared by 1933, and the Great Lawn was laid over the reservoir bed.",
  },
  {
    id: "ind-subway",
    era: "capitalWorld",
    kind: "event",
    title: "The city builds its own subway",
    wikiTitle: "Independent Subway System",
    year: 1932,
    blurb:
      "The municipally owned IND opened under Eighth Avenue in 1932 and Sixth Avenue in 1940, meant to compete with the private IRT and BMT. In 1940 the city bought them both out and ran all three as one system.",
  },
  {
    id: "harlem-riot-1935",
    era: "capitalWorld",
    kind: "event",
    title: "Harlem riot of 1935",
    wikiTitle: "Harlem riot of 1935",
    year: 1935,
    coords: [-73.9446, 40.8095],
    blurb:
      "A false rumor that a teenage shoplifter had been beaten to death in the Kress store on 125th Street set off a night of rioting. La Guardia's commission blamed the job discrimination, bad housing, and policing that Harlem had lived with for years.",
  },
  {
    id: "els-come-down",
    era: "capitalWorld",
    kind: "event",
    title: "The els come down",
    wikiTitle: "IRT Sixth Avenue Line",
    year: 1939,
    yearLabel: "1938–1942",
    blurb:
      "Once the new subway ran beneath them, the Sixth Avenue (1938), Ninth Avenue (1940), and Second Avenue (1942) elevated lines were torn down. Much of the scrap steel was sold to Japan, and New Yorkers said later that it came back in the war.",
  },
  {
    id: "worlds-fair-1939",
    era: "capitalWorld",
    kind: "event",
    title: "1939 World's Fair",
    wikiTitle: "1939 New York World's Fair",
    year: 1939,
    coords: [-73.8448, 40.7466],
    blurb:
      "'The World of Tomorrow' rose around the Trylon and Perisphere on the Corona ash dumps that F. Scott Fitzgerald had called a 'valley of ashes.' Futurama sold 45 million visitors a motorway America, and the war in Europe began during its first season.",
  },
  {
    id: "navy-yard-war",
    era: "capitalWorld",
    kind: "event",
    title: "The Navy Yard at war",
    wikiTitle: "Brooklyn Navy Yard",
    year: 1942,
    coords: [-73.9712, 40.7022],
    blurb:
      "Seventy thousand workers ran the Brooklyn Navy Yard around the clock, many of them women and Black New Yorkers hired for the first time. It launched the battleships Iowa and Missouri, and the port shipped out millions of troops and tons of supplies.",
  },
  {
    id: "vj-day",
    era: "capitalWorld",
    kind: "event",
    title: "V-J Day in Times Square",
    wikiTitle: "V-J Day in Times Square",
    year: 1945,
    coords: [-73.9855, 40.758],
    blurb:
      "On August 14, 1945, two million people packed Times Square for the news of Japan's surrender, and Alfred Eisenstaedt photographed a sailor kissing a woman in white. New York came out of the war as the richest city on earth.",
  },

  // ----- Places -----
  {
    id: "yankee-stadium",
    era: "capitalWorld",
    kind: "place",
    title: "Yankee Stadium",
    wikiTitle: "Yankee Stadium (1923)",
    year: 1923,
    coords: [-73.928, 40.827],
    lifespan: [1923, 2010],
    blurb:
      "'The House That Ruth Built' opened in the Bronx in 1923, after the Giants evicted the Yankees from the Polo Grounds across the river. Babe Ruth homered on opening day.",
  },
  {
    id: "cotton-club",
    era: "capitalWorld",
    kind: "place",
    title: "Cotton Club",
    wikiTitle: "Cotton Club",
    year: 1927,
    coords: [-73.9368, 40.8189],
    lifespan: [1923, 1936],
    blurb:
      "Owney Madden's gangster-owned club at Lenox and 142nd Street booked Duke Ellington, then Cab Calloway, for whites-only audiences, and broadcast Harlem jazz across the country. It moved downtown after the 1935 riot.",
  },
  {
    id: "holland-tunnel",
    era: "capitalWorld",
    kind: "place",
    title: "Holland Tunnel",
    wikiTitle: "Holland Tunnel",
    year: 1927,
    coords: [-74.0063, 40.7255],
    lifespan: [1927, null],
    blurb:
      "The world's first mechanically ventilated underwater vehicular tunnel ran from Canal Street to Jersey City. Its giant fans changed the air every 90 seconds so drivers did not choke on exhaust.",
  },
  {
    id: "chrysler-building",
    era: "capitalWorld",
    kind: "place",
    title: "Chrysler Building",
    wikiTitle: "Chrysler Building",
    year: 1930,
    coords: [-73.9755, 40.7516],
    lifespan: [1930, null],
    blurb:
      "William Van Alen had the stainless-steel spire assembled in secret inside the crown and raised it in 90 minutes, making the building briefly the tallest in the world. Eleven months later the Empire State passed it.",
  },
  {
    id: "empire-state",
    era: "capitalWorld",
    kind: "place",
    title: "Empire State Building",
    wikiTitle: "Empire State Building",
    year: 1931,
    coords: [-73.9857, 40.7484],
    lifespan: [1931, null],
    blurb:
      "It went up in 410 days on the site of the old Waldorf-Astoria and opened in the teeth of the Depression so short of tenants that New Yorkers called it the 'Empty State Building.' It was the world's tallest building for forty years.",
  },
  {
    id: "gw-bridge",
    era: "capitalWorld",
    kind: "place",
    title: "George Washington Bridge",
    wikiTitle: "George Washington Bridge",
    year: 1931,
    coords: [-73.9529, 40.8517],
    lifespan: [1931, null],
    blurb:
      "Othmar Ammann's Hudson crossing opened in 1931 with a span twice as long as any bridge before it. Its steel towers were meant to be clad in stone, and the Depression left them bare.",
  },
  {
    id: "rockefeller-center",
    era: "capitalWorld",
    kind: "place",
    title: "Rockefeller Center",
    wikiTitle: "Rockefeller Center",
    year: 1933,
    coords: [-73.9787, 40.7587],
    lifespan: [1933, null],
    blurb:
      "John D. Rockefeller Jr. was left holding a Columbia University lease when the Metropolitan Opera pulled out after the crash, and built fourteen Art Deco buildings on it anyway. It was the largest private building project of the Depression, and Diego Rivera's lobby mural was chiseled off the wall.",
  },
  {
    id: "apollo",
    era: "capitalWorld",
    kind: "place",
    title: "Apollo Theater",
    wikiTitle: "Apollo Theater",
    year: 1934,
    coords: [-73.95, 40.81],
    lifespan: [1934, null],
    blurb:
      "A former whites-only burlesque house on 125th Street reopened for Black audiences in 1934. At its Amateur Night that year, seventeen-year-old Ella Fitzgerald entered as a dancer and sang instead.",
  },
  {
    id: "first-houses",
    era: "capitalWorld",
    kind: "place",
    title: "First Houses",
    wikiTitle: "First Houses",
    year: 1935,
    coords: [-73.983, 40.7236],
    lifespan: [1935, null],
    blurb:
      "The first public housing in the United States: a row of Lower East Side tenements rebuilt with WPA labor by the new New York City Housing Authority, where 122 families moved in for about six dollars a room per month.",
  },
  {
    id: "triborough",
    era: "capitalWorld",
    kind: "place",
    title: "Triborough Bridge",
    wikiTitle: "Robert F. Kennedy Bridge",
    year: 1936,
    coords: [-73.9255, 40.7875],
    lifespan: [1936, null],
    blurb:
      "Three bridges and a viaduct meeting on Randalls Island link Manhattan, Queens, and the Bronx. Its tolls funded Robert Moses's Triborough Authority, which turned it into a power base no mayor could touch.",
  },
  {
    id: "laguardia-airport",
    era: "capitalWorld",
    kind: "place",
    title: "LaGuardia Airport",
    wikiTitle: "LaGuardia Airport",
    year: 1939,
    coords: [-73.874, 40.7769],
    lifespan: [1939, null],
    blurb:
      "La Guardia refused to land at Newark on a ticket that said 'New York,' and got the city its own airport on the old North Beach airfield in Queens, built with WPA money. It opened in 1939 and later took his name.",
  },
];
