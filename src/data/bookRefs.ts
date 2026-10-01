import type { BookRef } from "../types";

/**
 * Where each entry is covered in the Gotham trilogy, for the "Read more" line
 * on entry cards. Chapters and pages were checked against the text; see
 * docs/BOOK_REFERENCE.md for how to look up new ones. Greater Gotham's EPUB
 * has no page numbers, so its refs name the chapter's section instead.
 * Entries from 1919 to 1932 fall between the volumes and have no ref.
 */
export const bookRefs: Record<string, BookRef> = {
  "lenape-people": {
    book: "gotham",
    chapter: "1. First Impressions",
    pages: "5–9",
  },
  munsee: { book: "gotham", chapter: "1. First Impressions", pages: "5" },
  wecquaesgeek: { book: "gotham", chapter: "1. First Impressions", pages: "5" },
  canarsee: { book: "gotham", chapter: "1. First Impressions", pages: "8" },
  hackensack: { book: "gotham", chapter: "1. First Impressions", pages: "5" },
  verrazzano: { book: "gotham", chapter: "1. First Impressions", pages: "11" },
  gomes: { book: "gotham", chapter: "1. First Impressions", pages: "11" },
  "ice-retreat": {
    book: "gotham",
    chapter: "1. First Impressions",
    pages: "4",
  },
  "first-peoples": {
    book: "gotham",
    chapter: "1. First Impressions",
    pages: "4–5",
  },
  "maize-arrives": {
    book: "gotham",
    chapter: "1. First Impressions",
    pages: "5",
  },
  werpoes: { book: "gotham", chapter: "1. First Impressions", pages: "6" },
  "oyster-middens": {
    book: "gotham",
    chapter: "1. First Impressions",
    pages: "4",
  },
  hudson: {
    book: "gotham",
    chapter: "2. The Men Who Bought Manhattan",
    pages: "14–15",
  },
  "juan-rodriguez": {
    book: "gotham",
    chapter: "2. The Men Who Bought Manhattan",
    pages: "19",
  },
  minuit: {
    book: "gotham",
    chapter: "2. The Men Who Bought Manhattan",
    pages: "21–24",
  },
  kieft: { book: "gotham", chapter: "3. Company Town", pages: "30–34" },
  stuyvesant: { book: "gotham", chapter: "4. Stuyvesant", pages: "41–45" },
  "van-der-donck": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "62",
  },
  "asser-levy": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "60",
  },
  "dutch-west-india": {
    book: "gotham",
    chapter: "2. The Men Who Bought Manhattan",
    pages: "19–23",
  },
  "first-enslaved": {
    book: "gotham",
    chapter: "3. Company Town",
    pages: "31–33",
  },
  "kiefts-war": { book: "gotham", chapter: "3. Company Town", pages: "38–39" },
  "peach-war": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "68",
  },
  "flushing-remonstrance": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "61–63",
  },
  "english-takeover": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "72–73",
  },
  "fort-amsterdam": {
    book: "gotham",
    chapter: "3. Company Town",
    pages: "30–31",
  },
  "the-wall": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "64",
  },
  "heere-gracht": { book: "gotham", chapter: "4. Stuyvesant", pages: "46" },
  bouwerij: { book: "gotham", chapter: "4. Stuyvesant", pages: "55" },
  breuckelen: {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "67",
  },
  "nieuw-haarlem": {
    book: "gotham",
    chapter: "5. A City Lost, a City Gained",
    pages: "69–70",
  },
  leisler: {
    book: "gotham",
    chapter: "7. Jacob Leisler's Rebellion",
    pages: "96–100",
  },
  "captain-kidd": {
    book: "gotham",
    chapter: "8. Heats and Animosityes",
    pages: "112–14",
  },
  zenger: {
    book: "gotham",
    chapter: "11. Recession, Revival, and Rebellion",
    pages: "152–56",
  },
  "lewis-morris": {
    book: "gotham",
    chapter: "11. Recession, Revival, and Rebellion",
    pages: "151–55",
  },
  colden: { book: "gotham", chapter: "13. Crises", pages: "196–99" },
  "frederick-philipse": {
    book: "gotham",
    chapter: "6. Empire and Oligarchy",
    pages: "80",
  },
  "elizabeth-jourdain": {
    book: "gotham",
    chapter: "9. In the Kingdom of Sugar",
    pages: "127",
  },
  "dukes-laws": {
    book: "gotham",
    chapter: "7. Jacob Leisler's Rebellion",
    pages: "91–95",
  },
  "leislers-rebellion": {
    book: "gotham",
    chapter: "7. Jacob Leisler's Rebellion",
    pages: "96–100",
  },
  "trinity-built": {
    book: "gotham",
    chapter: "8. Heats and Animosityes",
    pages: "104",
  },
  "slave-revolt-1712": {
    book: "gotham",
    chapter: "10. One Body Corporate and Politic?",
    pages: "148–49",
  },
  "conspiracy-1741": {
    book: "gotham",
    chapter: "11. Recession, Revival, and Rebellion",
    pages: "158–62",
  },
  "zenger-trial": {
    book: "gotham",
    chapter: "11. Recession, Revival, and Rebellion",
    pages: "152–56",
  },
  "kings-college": {
    book: "gotham",
    chapter: "12. War and Wealth",
    pages: "181",
  },
  "fort-george": { book: "gotham", chapter: "13. Crises", pages: "198" },
  "city-hall-wall": {
    book: "gotham",
    chapter: "8. Heats and Animosityes",
    pages: "109–10",
  },
  "fraunces-tavern": {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "261",
  },
  "bowling-green": {
    book: "gotham",
    chapter: "12. War and Wealth",
    pages: "175",
  },
  "collect-pond-colonial": {
    book: "gotham",
    chapter: "12. War and Wealth",
    pages: "183–85",
  },
  "st-pauls-chapel": {
    book: "gotham",
    chapter: "12. War and Wealth",
    pages: "177",
  },
  mcdougall: {
    book: "gotham",
    chapter: "14. The Demon of Discord",
    pages: "209–13",
  },
  "isaac-sears": { book: "gotham", chapter: "13. Crises", pages: "200–02" },
  "john-jay": { book: "gotham", chapter: "15. Revolution", pages: "224–25" },
  "hamilton-rev": { book: "gotham", chapter: "15. Revolution", pages: "224" },
  "nathan-hale": { book: "gotham", chapter: "15. Revolution", pages: "242" },
  "william-howe": {
    book: "gotham",
    chapter: "15. Revolution",
    pages: "233–37",
  },
  rivington: {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "245",
  },
  "stamp-act-congress": { book: "gotham", chapter: "13. Crises", pages: "198" },
  "golden-hill": {
    book: "gotham",
    chapter: "14. The Demon of Discord",
    pages: "211",
  },
  "george-statue": { book: "gotham", chapter: "15. Revolution", pages: "232" },
  "battle-brooklyn": {
    book: "gotham",
    chapter: "15. Revolution",
    pages: "228–32",
  },
  "great-fire-1776": {
    book: "gotham",
    chapter: "15. Revolution",
    pages: "241–42",
  },
  "prison-ships": {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "253–55",
  },
  "evacuation-day": {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "259",
  },
  "liberty-pole": { book: "gotham", chapter: "13. Crises", pages: "203" },
  "brooklyn-heights-works": {
    book: "gotham",
    chapter: "15. Revolution",
    pages: "235–39",
  },
  "wallabout-bay": {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "253",
  },
  "canvas-town": {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "251",
  },
  "hamilton-federalist": {
    book: "gotham",
    chapter: "20. Capital City",
    pages: "303–07",
  },
  burr: {
    book: "gotham",
    chapter: "21. Revolutions Foreign and Domestic",
    pages: "324–28",
  },
  astor: {
    book: "gotham",
    chapter: "22. Queen of Commerce, Jack of All Trades",
    pages: "337–40",
  },
  clinton: { book: "gotham", chapter: "27. The Canal Era", pages: "429–31" },
  fulton: { book: "gotham", chapter: "27. The Canal Era", pages: "442" },
  "washington-irving": {
    book: "gotham",
    chapter: "26. War and Peace",
    pages: "416–19",
  },
  pintard: {
    book: "gotham",
    chapter: "24. Philosophes and Philanthropists",
    pages: "378–82",
  },
  "doctors-riot": {
    book: "gotham",
    chapter: "25. From Crowd to Class",
    pages: "387",
  },
  inauguration: {
    book: "gotham",
    chapter: "19. The Grand Federal Procession",
    pages: "297",
  },
  buttonwood: { book: "gotham", chapter: "20. Capital City", pages: "311" },
  "yellow-fever": {
    book: "gotham",
    chapter: "23. The Road to City Hall",
    pages: "356–59",
  },
  duel: {
    book: "gotham",
    chapter: "21. Revolutions Foreign and Domestic",
    pages: "332",
  },
  "grid-plan": {
    book: "gotham",
    chapter: "26. War and Peace",
    pages: "419–22",
  },
  "erie-canal": {
    book: "gotham",
    chapter: "27. The Canal Era",
    pages: "429–33",
  },
  "gradual-emancipation": {
    book: "gotham",
    chapter: "22. Queen of Commerce, Jack of All Trades",
    pages: "348–49",
  },
  "federal-hall": { book: "gotham", chapter: "20. Capital City", pages: "300" },
  tontine: { book: "gotham", chapter: "20. Capital City", pages: "311–12" },
  "city-hall-1812": {
    book: "gotham",
    chapter: "23. The Road to City Hall",
    pages: "369–70",
  },
  "castle-clinton": {
    book: "gotham",
    chapter: "26. War and Peace",
    pages: "423",
  },
  "navy-yard": {
    book: "gotham",
    chapter: "22. Queen of Commerce, Jack of All Trades",
    pages: "341",
  },
  "five-points-emerges": {
    book: "gotham",
    chapter: "23. The Road to City Hall",
    pages: "359",
  },
  hone: {
    book: "gotham",
    chapter: "28. The Medici of the Republic",
    pages: "455–57",
  },
  greeley: { book: "gotham", chapter: "39. Manhattan, Ink", pages: "677–79" },
  bennett: {
    book: "gotham",
    chapter: "31. The Press of Democracy",
    pages: "525–27",
  },
  barnum: { book: "gotham", chapter: "37. Hard Times", pages: "643–45" },
  whitman: { book: "gotham", chapter: "40. Seeing New York", pages: "705–09" },
  hughes: { book: "gotham", chapter: "37. Hard Times", pages: "629–33" },
  "ruggles-david": {
    book: "gotham",
    chapter: "33. White, Green, and Black",
    pages: "561–62",
  },
  restell: { book: "gotham", chapter: "45. Feme Decovert", pages: "808–10" },
  stewart: { book: "gotham", chapter: "38. Full Steam Ahead", pages: "666–70" },
  "great-fire-1835": {
    book: "gotham",
    chapter: "35. Filth, Fever, Water, Fire",
    pages: "594–98",
  },
  "panic-1837": {
    book: "gotham",
    chapter: "36. The Panic of 1837",
    pages: "612–16",
  },
  croton: {
    book: "gotham",
    chapter: "35. Filth, Fever, Water, Fire",
    pages: "594–95",
  },
  "astor-place-riot": {
    book: "gotham",
    chapter: "43. Co-op City",
    pages: "762–65",
  },
  "crystal-palace": {
    book: "gotham",
    chapter: "38. Full Steam Ahead",
    pages: "669–72",
  },
  "brooklyn-city": {
    book: "gotham",
    chapter: "34. Rail Boom",
    pages: "580–83",
  },
  "central-park-begun": {
    book: "gotham",
    chapter: "44. Into the Crazy-Loved Dens of Death",
    pages: "792–95",
  },
  "emancipation-day-1827": {
    book: "gotham",
    chapter: "33. White, Green, and Black",
    pages: "546–47",
  },
  "astor-opera-house": {
    book: "gotham",
    chapter: "43. Co-op City",
    pages: "761–62",
  },
  "astor-house": {
    book: "gotham",
    chapter: "38. Full Steam Ahead",
    pages: "671",
  },
  "barnums-museum": { book: "gotham", chapter: "37. Hard Times", pages: "644" },
  "croton-reservoir": {
    book: "gotham",
    chapter: "37. Hard Times",
    pages: "625",
  },
  "the-tombs": { book: "gotham", chapter: "37. Hard Times", pages: "636" },
  "niblos-garden": { book: "gotham", chapter: "34. Rail Boom", pages: "585" },
  highbridge: { book: "gotham", chapter: "37. Hard Times", pages: "625" },
  "five-points": {
    book: "gotham",
    chapter: "29. Working Quarters",
    pages: "475–79",
  },
  "bowery-theatres": {
    book: "gotham",
    chapter: "42. City of Immigrants",
    pages: "753",
  },
  "seneca-village": {
    book: "gotham",
    chapter: "44. Into the Crazy-Loved Dens of Death",
    pages: "792",
  },
  greenwood: {
    book: "gotham",
    chapter: "41. Life Above Bleecker",
    pages: "719",
  },
  "atlantic-docks": {
    book: "gotham",
    chapter: "38. Full Steam Ahead",
    pages: "654",
  },
  "marble-palace": {
    book: "gotham",
    chapter: "38. Full Steam Ahead",
    pages: "667",
  },
  tweed: { book: "gotham", chapter: "53. City Building", pages: "929–33" },
  nast: { book: "gotham", chapter: "57. The New York Commune?", pages: "1004" },
  vanderbilt: { book: "gotham", chapter: "51. Westward, Ho!", pages: "912–13" },
  morgan: { book: "gotham", chapter: "59. Manhattan, Inc.", pages: "1044–48" },
  gould: { book: "gotham", chapter: "51. Westward, Ho!", pages: "911–15" },
  riis: { book: "gotham", chapter: "66. Social Gospel", pages: "1180–83" },
  "nellie-bly": {
    book: "gotham",
    chapter: "64. That's Entertainment!",
    pages: "1152",
  },
  "henry-george": {
    book: "gotham",
    chapter: "62. “The Leeches Must Go!”",
    pages: "1092–95",
  },
  "mrs-astor": {
    book: "gotham",
    chapter: "61. Châteaux Society",
    pages: "1071–72",
  },
  "draft-riots": {
    book: "gotham",
    chapter: "50. The Battle for New York",
    pages: "894–98",
  },
  "black-friday": {
    book: "gotham",
    chapter: "51. Westward, Ho!",
    pages: "914–16",
  },
  "orange-riots": {
    book: "gotham",
    chapter: "57. The New York Commune?",
    pages: "1003–07",
  },
  "tweed-falls": {
    book: "gotham",
    chapter: "57. The New York Commune?",
    pages: "1008–12",
  },
  "brooklyn-bridge-opens": {
    book: "gotham",
    chapter: "53. City Building",
    pages: "934–37",
  },
  liberty: { book: "gotham", chapter: "58. Work or Bread!", pages: "1033–34" },
  "blizzard-1888": {
    book: "gotham",
    chapter: "60. Bright Lights, Big City",
    pages: "1067",
  },
  consolidation: {
    book: "gotham",
    chapter: "69. Imperial City",
    pages: "1219–23",
  },
  "grand-central-depot": {
    book: "gotham",
    chapter: "53. City Building",
    pages: "944",
  },
  "msg-1890": {
    book: "gotham",
    chapter: "64. That's Entertainment!",
    pages: "1147–49",
  },
  tenements: {
    book: "gotham",
    chapter: "63. The New Immigrants",
    pages: "1116–19",
  },
  "ladies-mile": {
    book: "gotham",
    chapter: "53. City Building",
    pages: "946–47",
  },
  "el-railroads": {
    book: "gotham",
    chapter: "53. City Building",
    pages: "932",
  },
  "central-park-done": {
    book: "gotham",
    chapter: "44. Into the Crazy-Loved Dens of Death",
    pages: "793–95",
  },
  "ellis-island": {
    book: "gotham",
    chapter: "63. The New Immigrants",
    pages: "1111–12",
  },
  "coney-island": {
    book: "gotham",
    chapter: "64. That's Entertainment!",
    pages: "1132–36",
  },
  "mulberry-bend": {
    book: "gotham",
    chapter: "63. The New Immigrants",
    pages: "1123–24",
  },
  low: {
    book: "greaterGotham",
    chapter: "6. Who Rules New York? › Bosses and Businessmen",
  },
  "mcclellan-gaynor": {
    book: "greaterGotham",
    chapter: "19. Radicals › Triangle and Tammany",
  },
  "al-smith": {
    book: "greaterGotham",
    chapter: "19. Radicals › Triangle and Tammany",
  },
  stieglitz: {
    book: "greaterGotham",
    chapter: "22. Insurgent Art › Modernists’ Metropolis",
  },
  wharton: { book: "greaterGotham", chapter: "22. Insurgent Art › Wharton" },
  "du-bois": {
    book: "greaterGotham",
    chapter: "21. Black Metropolis › Civil Rights",
  },
  goldman: {
    book: "greaterGotham",
    chapter: "20. Bending Gender › Counterculture",
  },
  "subway-opens": {
    book: "greaterGotham",
    chapter: "9. Ligaments › Expanding the System",
  },
  slocum: {
    book: "greaterGotham",
    chapter:
      "10. Housing › Working-Class Neighborhoods: Manhattan, Brooklyn, Queens",
  },
  triangle: {
    book: "greaterGotham",
    chapter: "19. Radicals › Triangle and Tammany",
  },
  "armory-show": {
    book: "greaterGotham",
    chapter: "22. Insurgent Art › Armory Show",
  },
  suffrage: {
    book: "greaterGotham",
    chapter: "20. Bending Gender › Suffragists and Suffragettes",
  },
  "ww1-port": {
    book: "greaterGotham",
    chapter: "23. Over There? › A Prosperous Neutrality",
  },
  hellfighters: {
    book: "greaterGotham",
    chapter: "24. Over Here › Into the Trenches",
  },
  flatiron: { book: "greaterGotham", chapter: "7. Sky Boom › Skyline" },
  "times-square": {
    book: "greaterGotham",
    chapter: "13. Show Biz › Times Square",
  },
  "penn-station": {
    book: "greaterGotham",
    chapter: "8. Arteries › Trains and Tunnels",
  },
  "grand-central": {
    book: "greaterGotham",
    chapter: "8. Arteries › Trains and Tunnels",
  },
  woolworth: { book: "greaterGotham", chapter: "7. Sky Boom › Zoning" },
  "luna-park": {
    book: "greaterGotham",
    chapter: "13. Show Biz › Coney Island",
  },
  "lower-east-side-1905": {
    book: "greaterGotham",
    chapter:
      "10. Housing › Working-Class Neighborhoods: Manhattan, Brooklyn, Queens",
  },
  "harlem-rising": {
    book: "greaterGotham",
    chapter: "21. Black Metropolis › Harlem",
  },
  "dorothy-day": { book: "gothamAtWar", chapter: "The Irish", pages: "75" },
  "la-guardia": {
    book: "gothamAtWar",
    chapter: "Gotham Girds for War",
    pages: "334–38",
  },
  "robert-moses": {
    book: "gothamAtWar",
    chapter: "Planning the Postwar City",
    pages: "703–07",
  },
  "harlem-riot-1935": {
    book: "gothamAtWar",
    chapter: "Jews and Blacks",
    pages: "596–97",
  },
  "els-come-down": {
    book: "gothamAtWar",
    chapter: "Asian New York",
    pages: "109",
  },
  "worlds-fair-1939": {
    book: "gothamAtWar",
    chapter: "In Uno Plures",
    pages: "131, 142",
  },
  "navy-yard-war": {
    book: "gothamAtWar",
    chapter: "Gotham Girds for War",
    pages: "313–15",
  },
  "vj-day": { book: "gothamAtWar", chapter: "Epilogs", pages: "851" },
  "rockefeller-center": {
    book: "gothamAtWar",
    chapter: "Wall Street Warriors",
    pages: "261–62",
  },
  triborough: {
    book: "gothamAtWar",
    chapter: "War Port",
    pages: "399",
  },
  "laguardia-airport": {
    book: "gothamAtWar",
    chapter: "Planning the Postwar City",
    pages: "733",
  },
  "bund-rally-1939": {
    book: "gothamAtWar",
    chapter: "Nazis and New York",
    pages: "33",
  },
  "columbia-fission": {
    book: "gothamAtWar",
    chapter: "Science in the City",
    pages: "428–33",
  },
  "normandie-fire": {
    book: "gothamAtWar",
    chapter: "Under the Gun",
    pages: "360–62",
  },
  "stuyvesant-town": {
    book: "gothamAtWar",
    chapter: "Blacks",
    pages: "531–32",
  },
  "harlem-riot-1943": {
    book: "gothamAtWar",
    chapter: "Blacks",
    pages: "546–47",
  },
  siwanoy: { book: "gotham", chapter: "1. First Impressions", pages: "5" },
  moraine: { book: "gotham", chapter: "1. First Impressions", pages: "4" },
  wampum: { book: "gotham", chapter: "2. The Men Who Bought Manhattan", pages: "22" },
  sapohanikan: { book: "gotham", chapter: "1. First Impressions", pages: "6" },
  "negroes-farms": { book: "gotham", chapter: "3. Company Town", pages: "32–33" },
  "pavonia-massacre": { book: "gotham", chapter: "3. Company Town", pages: "38–39" },
  "african-burial-ground": {
    book: "gotham",
    chapter: "25. From Crowd to Class",
    pages: "386, 400",
  },
  "kings-bridge": {
    book: "gotham",
    chapter: "8. Heats and Animosityes",
    pages: "105",
  },
  "sons-of-liberty": { book: "gotham", chapter: "13. Crises", pages: "200" },
  "hickey-plot": { book: "gotham", chapter: "15. Revolution", pages: "231" },
  "book-of-negroes": {
    book: "gotham",
    chapter: "16. The Gibraltar of North America",
    pages: "259",
  },
  "manumission-society": {
    book: "gotham",
    chapter: "18. The Revolution Settlement",
    pages: "285",
  },
  "african-free-school": {
    book: "gotham",
    chapter: "18. The Revolution Settlement",
    pages: "286",
  },
  "mother-zion": { book: "gotham", chapter: "25. From Crowd to Class", pages: "398" },
  "harlem-railroad": { book: "gotham", chapter: "53. City Building", pages: "929" },
  "tenderloin-riot-1900": { book: "greaterGotham", chapter: "21. Black Metropolis › Riot" },
  "macys-herald-square": { book: "greaterGotham", chapter: "11. Industrial and Commercial City › Department Stores" },
  "bronx-boom": { book: "greaterGotham", chapter: "10. Housing › The Bronx: Instant City" },
  "panic-1907": { book: "greaterGotham", chapter: "5. Critics and Crisis › Panic of 1907" },
  "hudson-tubes": { book: "greaterGotham", chapter: "8. Arteries › Trains and Tunnels" },
  "singer-building": { book: "greaterGotham", chapter: "7. Sky Boom › Skyline" },
  "met-life-tower": { book: "greaterGotham", chapter: "7. Sky Boom › Skyline" },
  "tin-pan-alley": { book: "greaterGotham", chapter: "13. Show Biz › Tin Pan Alley" },
  "mabel-dodge-salon": { book: "greaterGotham", chapter: "20. Bending Gender › Counterculture" },
  "rosenthal-murder": { book: "greaterGotham", chapter: "17. Repressives › Gambling" },
  "paterson-pageant": { book: "greaterGotham", chapter: "20. Bending Gender › Counterculture" },
  "tannenbaum-1914": { book: "greaterGotham", chapter: "19. Radicals › The Army of the Unemployed" },
};
