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
    coords: [-73.98556, 40.74278],
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
    gotham:
      "Gotham at War singles her out as one of the first Catholic voices in New York to break with the Church's support for Franco, in the Catholic Worker in 1936.",
    coords: [-73.99056, 40.73556],
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
    gotham:
      "Gotham at War follows him from New Deal builder to war mayor, courting defense contracts for the city and running civil defense.",
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
    gotham:
      "Gotham at War catches him stalled by the war, with rationing emptying his bridges and Roosevelt blocking his Brooklyn–Battery bridge, and planning the postwar city instead.",
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
    gotham:
      "Gotham at War reads it as the Depression's strain on the city's Black–Jewish frontiers, made plain.",
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
      "Once the new subway ran beneath them, the Sixth Avenue (1938), Ninth Avenue (1940), and Second Avenue (1942) elevated lines were torn down. Legend says the scrap went to Japan and came back as bombs, but the Sixth Avenue contract barred exporting its 18,742 tons, a clause aimed at Japan and Germany.",
    gotham:
      "Gotham at War sets the demolition beside Chinese New Yorkers' pickets against scrap shipments to Japan. The city's contract kept the el's steel at home.",
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
    gotham:
      "Gotham at War looks at the Fair's pluralism: in 1940 it held twenty-four folk festivals, one immigrant group a week, as the country redefined itself as a nation of immigrants.",
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
      "At its peak 75,000 people worked the Brooklyn Navy Yard in three shifts around the clock, among them women, hired in 1942 for the first time in the Yard's 141 years, and Black New Yorkers. It launched the battleships Iowa and Missouri, and the port shipped out millions of troops and tons of supplies.",
    gotham:
      "Gotham at War tracks the buildup from 1937: the North Carolina launched before 50,000 people in 1940, the Iowa next, and 20,000 workers by mid-1941.",
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
    gotham:
      "Gotham at War's epilog opens here: the Motogram on the Times tower confirmed Japan's surrender at 7:03 p.m., and two million people filled the square.",
  },

  // ----- Places -----
  {
    id: "bund-rally-1939",
    era: "capitalWorld",
    kind: "event",
    title: "The Bund at Madison Square Garden",
    wikiTitle: "1939 Nazi rally at Madison Square Garden",
    year: 1939,
    blurb:
      "On February 20, 1939, the German American Bund filled the Garden, billed as a George Washington's Birthday rally: storm troopers in gray shirts, Washington's portrait between swastikas, and Fritz Kuhn denouncing the \"Jew Deal.\" Outside, some hundred thousand protesters packed Eighth Avenue.",
    gotham:
      "Gotham at War calls the rally the Bund's swan song: the crowd inside was dwarfed by the one outside, and the Nazi leadership had already lost patience with it.",
    coords: [-73.9872, 40.7622],
  },
  {
    id: "columbia-fission",
    era: "capitalWorld",
    kind: "event",
    title: "Splitting the atom at Columbia",
    wikiTitle: "Pupin Hall",
    year: 1939,
    yearLabel: "1939–1942",
    blurb:
      "On January 25, 1939, in Pupin Hall's basement, John Dunning and the refugee Enrico Fermi split uranium atoms with Columbia's cyclotron. Fermi and Leo Szilárd then stacked a uranium-graphite \"pile\" on its floors. The Army's bomb project, set up in 1942 with offices at 270 Broadway, took its name from the borough: the Manhattan Engineer District.",
    gotham:
      "Gotham at War argues the bomb had New York roots: exiles the city took in, a Columbia lab, and a Corps of Engineers office downtown.",
    coords: [-73.9615, 40.8101],
  },
  {
    id: "normandie-fire",
    era: "capitalWorld",
    kind: "event",
    title: "The Normandie burns",
    wikiTitle: "SS Normandie",
    year: 1942,
    blurb:
      "The world's most glamorous liner, laid up at Pier 88 since 1939 and seized for conversion to a troopship, caught fire on February 9, 1942, when a worker's torch lit a pile of life vests. Flooded by fireboats, she rolled over in the Hudson ice before dawn.",
    gotham:
      "Gotham at War shows how quickly New Yorkers saw sabotage in the fire, though investigators found carelessness, and how it pushed the Navy toward a deal with the waterfront mob.",
    coords: [-73.9985, 40.7652],
  },
  {
    id: "stuyvesant-town",
    era: "capitalWorld",
    kind: "place",
    title: "Stuyvesant Town, whites only",
    wikiTitle: "Stuyvesant Town–Peter Cooper Village",
    year: 1943,
    blurb:
      "In 1943 the city let Metropolitan Life clear a 72-acre tract of the Gas House District, on Peter Stuyvesant's old bouwerie, for 8,755 apartments. Then Met Life's president announced they would be for whites only. The fight over it launched the city's campaign for fair-housing laws.",
    gotham:
      "Gotham at War makes Stuyvesant Town its test case: Moses's promise of private capital for housing arrived with a color line attached.",
    coords: [-73.9776, 40.7318],
  },
  {
    id: "harlem-riot-1943",
    era: "capitalWorld",
    kind: "event",
    title: "Harlem riot of 1943",
    wikiTitle: "Harlem riot of 1943",
    year: 1943,
    blurb:
      "On August 1, 1943, a white policeman at the Braddock Hotel on 126th Street shot and wounded Robert Bandy, a Black soldier on leave. A rumor that he had been killed brought crowds into the streets, and stores were smashed and looted from 110th to 145th Streets.",
    gotham:
      "Gotham at War sets the riot at the end of a war of Jim Crow jobs, housing, and military service, when a Black soldier shot by a white policeman seemed all too believable.",
    coords: [-73.9493, 40.8105],
  },
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
    gotham:
      "Gotham at War points out who else worked there: Britain's secret intelligence office for the Americas, behind a door marked 'Rough Diamonds, Ltd.'",
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
    gotham:
      "Gotham at War notes that wartime rationing cut traffic on the Triborough Authority's bridges by 56 percent in 1942, nearly pushing Moses's agency into default.",
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
    gotham:
      "Gotham at War notes it was the country's busiest airport almost from the start, and by 1945 too small and sinking into Flushing Bay, which is why the city planned Idlewild.",
  },
  {
    id: "floyd-bennett",
    era: "capitalWorld",
    kind: "place",
    title: "Floyd Bennett Field",
    wikiTitle: "Floyd Bennett Field",
    year: 1931,
    blurb:
      "The city's first municipal airport, built by joining Barren Island to the mainland with sand pumped from Jamaica Bay. Record-setting fliers like Wiley Post and Howard Hughes took off from it.",
    coords: [-73.8906, 40.591],
  },
  {
    id: "astoria-studios",
    era: "capitalWorld",
    kind: "place",
    title: "Astoria studios",
    wikiTitle: "Kaufman Astoria Studios",
    year: 1920,
    blurb:
      "Famous Players–Lasky (soon Paramount) built its East Coast film studio in Astoria in 1920, near Broadway's stage talent; the Marx Brothers made their first films here.",
    coords: [-73.9247, 40.7567],
  },
  {
    id: "armstrong-house",
    era: "capitalWorld",
    kind: "place",
    title: "Louis Armstrong House",
    wikiTitle: "Louis Armstrong House",
    year: 1943,
    blurb:
      "Louis Armstrong and his wife Lucille settled in a modest house in Corona in 1943 and lived there the rest of his life.",
    coords: [-73.8619, 40.7556],
    lifespan: [1943, null],
  },
  {
    id: "paradise-theater",
    era: "capitalWorld",
    kind: "place",
    title: "Loew's Paradise",
    wikiTitle: "Paradise Theater (Bronx)",
    year: 1929,
    blurb:
      "John Eberson's 4,000-seat movie palace on the Grand Concourse opened in 1929, its ceiling a night sky with moving clouds and twinkling stars.",
    coords: [-73.8989, 40.8606],
  },
  {
    id: "bronx-courthouse",
    era: "capitalWorld",
    kind: "place",
    title: "Bronx County Courthouse",
    wikiTitle: "Bronx County Courthouse",
    year: 1934,
    blurb:
      "The Art Deco courthouse and borough hall facing Yankee Stadium, finished in 1934; the Bronx had been its own county only since 1914.",
    coords: [-73.9242, 40.8261],
  },
  {
    id: "orchard-beach",
    era: "capitalWorld",
    kind: "place",
    title: "Orchard Beach",
    wikiTitle: "Orchard Beach (Bronx)",
    year: 1936,
    blurb:
      "Robert Moses joined Hunter and Twin Islands to Rodman's Neck with fill and built a crescent beach and pavilion in Pelham Bay Park, opened in 1936.",
    coords: [-73.7925, 40.8673],
  },
  {
    id: "parkchester",
    era: "capitalWorld",
    kind: "place",
    title: "Parkchester",
    wikiTitle: "Parkchester, Bronx",
    year: 1940,
    blurb:
      "Metropolitan Life's city of 12,000 apartments for 40,000 people, built 1938–42 on the old Catholic Protectory grounds. Like Stuyvesant Town, it refused Black tenants.",
    coords: [-73.86, 40.839],
  },
  {
    id: "outerbridge",
    era: "capitalWorld",
    kind: "place",
    title: "Goethals Bridge and Outerbridge Crossing",
    wikiTitle: "Outerbridge Crossing",
    year: 1928,
    blurb:
      "The Port Authority's first projects: two cantilever bridges to New Jersey opened together in June 1928, ending Staten Island's dependence on ferries.",
    coords: [-74.247, 40.525],
  },
  {
    id: "bayonne-bridge",
    era: "capitalWorld",
    kind: "place",
    title: "Bayonne Bridge",
    wikiTitle: "Bayonne Bridge",
    year: 1931,
    blurb:
      "The longest steel arch in the world when it opened across the Kill Van Kull in 1931.",
    coords: [-74.1422, 40.6419],
  },
  {
    id: "si-zoo",
    era: "capitalWorld",
    kind: "place",
    title: "Staten Island Zoo",
    wikiTitle: "Staten Island Zoo",
    year: 1936,
    blurb:
      "A small zoo in West New Brighton, built by the Civilian Conservation Corps on a former estate and opened in 1936.",
    coords: [-74.115, 40.625],
    lifespan: [1936, null],
  },
  {
    id: "flushing-airport",
    era: "capitalWorld",
    kind: "place",
    title: "Flushing Airport",
    wikiTitle: "Flushing Airport",
    year: 1929,
    blurb:
      "Built on marshland at College Point and opened in 1929, it was among the city's busiest airports until LaGuardia opened nearby in 1939; it closed in 1984.",
    coords: [-73.8333, 40.7792],
    lifespan: [1929, 1984],
  },
  {
    id: "riis-park",
    era: "capitalWorld",
    kind: "place",
    title: "Jacob Riis Park",
    wikiTitle: "Jacob Riis Park",
    year: 1937,
    blurb:
      "A beach the city bought in 1912 at Jacob Riis's urging; Moses rebuilt it with its Art Deco bathhouse and parking fields in 1936–37 as a getaway for the city.",
    coords: [-73.8733, 40.5675],
  },
  {
    id: "queensbridge",
    era: "capitalWorld",
    kind: "place",
    title: "Queensbridge Houses",
    wikiTitle: "Queensbridge Houses",
    year: 1939,
    blurb:
      "The largest public housing project in North America: 96 buildings and more than 3,000 apartments by the Queensboro Bridge, opened in 1939.",
    coords: [-73.945, 40.755],
    lifespan: [1939, null],
  },
  {
    id: "queens-borough-hall",
    era: "capitalWorld",
    kind: "place",
    title: "Queens Borough Hall",
    wikiTitle: "Queens Borough Hall",
    year: 1940,
    blurb:
      "Built in eight months in 1940 on Queens Boulevard at Kew Gardens; MacMonnies's statue Civic Virtue was exiled to its lawn from City Hall the next year.",
    coords: [-73.8303, 40.7147],
    lifespan: [1940, null],
  },
  {
    id: "addisleigh-park",
    era: "capitalWorld",
    kind: "place",
    title: "Addisleigh Park",
    wikiTitle: "St. Albans, Queens",
    year: 1940,
    yearLabel: "1940s",
    blurb:
      "A St. Albans enclave of large single-family houses where, as its restrictive covenants were overturned in the 1940s, Count Basie, Ella Fitzgerald, Lena Horne, Fats Waller, and W. E. B. Du Bois came to live.",
    coords: [-73.7705, 40.6945],
  },
  {
    id: "concourse-plaza-hotel",
    era: "capitalWorld",
    kind: "place",
    title: "Concourse Plaza Hotel",
    wikiTitle: "Concourse Plaza Hotel",
    year: 1923,
    blurb:
      "The Grand Concourse's grand hotel, opened in 1923 a walk from Yankee Stadium; Babe Ruth, Mickey Mantle, and Roger Maris stayed there. As the neighborhood declined it became, by 1968, a welfare hotel for families the city placed there.",
    coords: [-73.9219, 40.8272],
    lifespan: [1923, null],
  },
  {
    id: "andrew-freedman-home",
    era: "capitalWorld",
    kind: "place",
    title: "Andrew Freedman Home",
    wikiTitle: "Andrew Freedman Home",
    year: 1924,
    blurb:
      "Andrew Freedman, onetime owner of the baseball Giants and a director of the IRT subway company, left his fortune to build a retirement home on the Grand Concourse for the once-rich who had lost everything. It opened in 1924; the trust ran out of money in the 1960s.",
    coords: [-73.9201, 40.8327],
    lifespan: [1924, null],
  },
  {
    id: "bronx-terminal-market",
    era: "capitalWorld",
    kind: "place",
    title: "Bronx Terminal Market",
    wikiTitle: "Bronx Terminal Market",
    year: 1935,
    blurb:
      "The city finished this wholesale produce market on the Harlem River in 1935. That December, La Guardia came here to proclaim his ban on selling artichokes, aimed at the mobster Ciro Terranova, who had driven up their price.",
    coords: [-73.9303, 40.8204],
    lifespan: [1935, null],
  },
  {
    id: "astoria-pool",
    era: "capitalWorld",
    kind: "place",
    title: "Astoria Pool",
    wikiTitle: "Astoria Park",
    year: 1936,
    blurb:
      "A WPA pool and bathhouse on the Hell Gate shore of Astoria Park, built in 1935–36 and used for the U.S. Olympic swimming trials in 1936, 1952, and 1964.",
    coords: [-73.9219, 40.7794],
    lifespan: [1936, null],
  },
  {
    id: "queens-college",
    era: "capitalWorld",
    kind: "place",
    title: "Queens College",
    wikiTitle: "Queens College, City University of New York",
    year: 1937,
    blurb:
      "The city opened Queens College in 1937 on the grounds of the New York Parental School, a home for troubled boys. The old Jamaica Academy, where Walt Whitman once worked, had stood on the site.",
    coords: [-73.817, 40.737],
  },
  {
    id: "pepsi-cola-sign",
    era: "capitalWorld",
    kind: "place",
    title: "The Pepsi-Cola sign",
    wikiTitle: "Pepsi-Cola sign",
    year: 1940,
    blurb:
      "The red neon sign went up in 1940 on the roof of Pepsi-Cola's bottling plant in Long Island City, facing Manhattan across the East River.",
    coords: [-73.9578, 40.7475],
    lifespan: [1940, null],
  },
];
