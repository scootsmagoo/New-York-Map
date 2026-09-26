# Book reference: *Gotham* and *Greater Gotham*

A working guide for adding or checking content against the two books the
map is built around:

| Book | Covers | App eras | Citable by |
| --- | --- | --- | --- |
| Edwin G. Burrows & Mike Wallace, *Gotham: A History of New York City to 1898* (Oxford, 1999) | Ice Age → consolidation, 69 chapters, 1,236 pp. of text | `lenape` → `civilWarGilded` | chapter + print page |
| Mike Wallace, *Greater Gotham: A History of New York City from 1898 to 1919* (Oxford, 2017) | 1898 → 1919, 24 chapters | `greaterNY` | chapter + section (the EPUB has no page numbers) |
| Mike Wallace, *Gotham at War: A History of New York City from 1933 to 1945* (Oxford, 2025) | 1933 → 1945 | `capitalWorld` (from 1933) | **not extracted yet**: EPUB still to come |

The series skips **1919–1932**. *Gotham at War* opens in 1933 with La
Guardia and the New Deal, so the 1920s part of `capitalWorld`
(Prohibition, the Harlem Renaissance, the skyscraper race, the Crash,
Jimmy Walker) has no volume behind it. Those entries stay sourced from
Wikipedia and general histories, with no margin notes. Entries from
1933 on can get *Gotham at War* notes once the book is extracted:

```sh
python3 scripts/books/extract-epub.py ~/Downloads/<Gotham at War>.epub gotham-at-war
```

Then add its chapter guide below, and check whether that EPUB has page
numbers (`grep -c "\[p\. " data-raw/books/gotham-at-war/all.txt`).

## Rules for using the books

- **Never commit book text.** The extracted chapters live in
  `data-raw/books/`, which is gitignored. The EPUBs stay outside the repo.
- **Write blurbs and notes in your own words.** Facts, dates, and numbers
  are fair game; phrasing is not. A few quoted words are fine when the
  quote *is* the point (a period nickname, a slogan).
- **Cite when you use it.** Put the chapter and page in the commit message
  (e.g. "Gotham ch. 16, p. 253–54"). That makes a later fact-check fast.
- **The `gotham` field** is the "Gotham:" margin note on the entry card:
  one sentence on how the book treats the subject, not a second blurb. It
  should be something the book actually argues or emphasizes; check it
  with `find.py` before writing it. For `greaterNY` entries, the note is
  about *Greater Gotham* (the card label still says "Gotham:").
- When the book and Wikipedia disagree on a number, say which you used in
  the commit message. The books are sometimes the more careful source
  (see the audit below).

## Setup

Extract each EPUB once (needs only Python 3):

```sh
python3 scripts/books/extract-epub.py ~/Downloads/Gotham*.epub gotham
python3 scripts/books/extract-epub.py ~/Downloads/"The History of New York City #2"*.epub greater-gotham
```

This writes one text file per chapter (or per section, for *Greater
Gotham*) plus an `all.txt` for each book. *Gotham*'s print page numbers
become inline `[p. 253]` markers.

Search with citations:

```sh
python3 scripts/books/find.py "Seneca Village"
python3 scripts/books/find.py -b gotham -n 3 "prison ?ships?"
python3 scripts/books/find.py -b greater-gotham -w 600 "Silent (Parade|Protest)"
```

Each hit prints `book · chapter · p. N`, followed by a passage. Patterns are
case-insensitive regex. Back matter (notes, bibliography, index) is
skipped. The indexes are still in `all.txt` if you want them.

Tips:
- The books' spellings are period-accurate and sometimes differ from
  Wikipedia's: *Jan Rodrigues* (not Juan Rodriguez), *Petrus Stuyvesant*
  in the index, *Lenapes* as the plural. Try both.
- The indexes weight coverage. A name with 40+ page refs is a major
  figure in the book; 2–3 is a walk-on.

## Chapter guide: *Gotham* (1999)

Page = first page of the chapter.

**Part One: Lenape Country and New Amsterdam, to 1664**

| Ch. | p. | Title | Era | What's in it |
| --: | --: | --- | --- | --- |
| 1 | 3 | First Impressions | lenape | glaciers and moraine, Lenape life and trails, 16th-c. explorers |
| 2 | 14 | The Men Who Bought Manhattan | newAmsterdam | Dutch revolt, West India Company, fur trade, Block and Rodrigues, 1626 founding |
| 3 | 27 | Company Town | newAmsterdam | first twenty years, company slavery and half-freedom (1644), Kieft's War |
| 4 | 41 | Stuyvesant | newAmsterdam | order and law, slave trade, farms spreading over Manhattan and Long Island |
| 5 | 57 | A City Lost, a City Gained | newAmsterdam | burgher government, Jews/Lutherans/Quakers vs. Stuyvesant, 1664 surrender |

**Part Two: British New York, 1664–1783**

| Ch. | p. | Title | Era | What's in it |
| --: | --: | --- | --- | --- |
| 6 | 77 | Empire and Oligarchy | britishColony | Dutch ways under the duke of York, slow growth, the 1673 Dutch return |
| 7 | 91 | Jacob Leisler's Rebellion | britishColony | 1689 uprising: Dutch vs. English, commoners vs. grandees |
| 8 | 103 | Heats and Animosityes | britishColony | anglicizing the town, docks and lots, piracy and Kidd, Queen Anne's War |
| 9 | 118 | In the Kingdom of Sugar | britishColony | West Indies trade, slavery, shipyards, sugar refineries, new immigrants |
| 10 | 138 | One Body Corporate and Politic? | britishColony | 1731 Montgomerie Charter, slave and servant codes, poor relief |
| 11 | 150 | Recession, Revival, and Rebellion | britishColony | Zenger, the Great Awakening, the 1741 conspiracy trials |
| 12 | 167 | War and Wealth | britishColony | privateering fortunes, sugar houses, pleasure gardens, ward life |
| 13 | 191 | Crises | revolution | post-1763 slump, Stamp Act riots, Sons of Liberty |
| 14 | 205 | The Demon of Discord | revolution | 1766–75: Townshend duties, Golden Hill, Whigs vs. Tories |
| 15 | 223 | Revolution | revolution | patriots take the city, Battle of Long Island, the fall of New York |
| 16 | 245 | The Gibraltar of North America | revolution | occupation 1776–83, the fire, the prison ships, Evacuation Day |

**Part Three: Mercantile Town, 1783–1843**

| Ch. | p. | Title | Era | What's in it |
| --: | --: | --- | --- | --- |
| 17 | 265 | Phoenix | earlyRepublic | rebuilding, radical Whigs, the *Empress of China* |
| 18 | 277 | The Revolution Settlement | earlyRepublic | Hamilton's settlement, Manumission Society, African Free School |
| 19 | 288 | The Grand Federal Procession | earlyRepublic | Constitution, the 1788 parade, Washington's inauguration |
| 20 | 299 | Capital City | earlyRepublic | federal capital, Hamilton and Duer, first banks, 1792 crash, Buttonwood |
| 21 | 313 | Revolutions Foreign and Domestic | earlyRepublic | French Revolution politics, 1800 election, Burr–Hamilton |
| 22 | 333 | Queen of Commerce, Jack of All Trades | earlyRepublic | 1790s boom, cotton, the crafts, gradual emancipation |
| 23 | 353 | The Road to City Hall | earlyRepublic | yellow fever, water, fire, crime; the new City Hall; Park Theatre |
| 24 | 371 | Philosophes and Philanthropists | earlyRepublic | elite culture, charities, schools |
| 25 | 386 | From Crowd to Class | earlyRepublic | artisans, Tom Paine, Black churches (Zion), Irishtown, brothels |
| 26 | 409 | War and Peace | earlyRepublic | embargo, War of 1812, Irving's Knickerbocker, **the 1811 grid (p. 419–22)** |
| 27 | 429 | The Canal Era | earlyRepublic → antebellum | 1820s boom, Erie Canal, steamboats, packets, real estate |
| 28 | 452 | The Medici of the Republic | antebellum | elite religion and fashion, Christmas invented, Greek Revival, Cole and Cooper |
| 29 | 473 | Working Quarters | antebellum | plebeian neighborhoods, saloons, theaters, minstrelsy |
| 30 | 493 | Reforms and Revivals | antebellum | missions, schools, reformatories, poorhouses, hospitals, jails |
| 31 | 509 | The Press of Democracy | antebellum | Fanny Wright, Workingmen, penny press (Day, Bennett) |
| 32 | 529 | The Destroying Demon of Debauchery | antebellum | Finney, temperance, Graham, Magdalen reform |
| 33 | 542 | White, Green, and Black | antebellum | nativism, the color line, abolitionists, 1834 riots, underground railroad |
| 34 | 563 | Rail Boom | antebellum | railroads, housing, Brooklyn as second city, pleasure gardens |
| 35 | 587 | Filth, Fever, Water, Fire | antebellum | cholera 1832, Croton, Great Fire of 1835 |
| 36 | 603 | The Panic of 1837 | antebellum | labor wars, Flour Riot, the crash |
| 37 | 619 | Hard Times | antebellum | relief fights, gangs, police, the Tombs, Barnum, Weeksville |

**Part Four: Emporium and Manufacturing City, 1844–1879**

| Ch. | p. | Title | Era | What's in it |
| --: | --: | --- | --- | --- |
| 38 | 649 | Full Steam Ahead | antebellum | 1840s–50s boom, retail, Crystal Palace, Stewart's Marble Palace |
| 39 | 674 | Manhattan, Ink | antebellum | telegraph, publishing, art market, photography |
| 40 | 691 | Seeing New York | antebellum | flâneurs, Poe, Melville, Whitman, "lights and shadows" |
| 41 | 712 | Life Above Bleecker | antebellum | new squares, Fifth Avenue, baseball, Green-Wood |
| 42 | 735 | City of Immigrants | antebellum | Irish and Germans, Kleindeutschland, Five Points, b'hoys |
| 43 | 761 | Co-op City | antebellum | Astor Place Riot, land reform, nativism, unions |
| 44 | 774 | Into the Crazy-Loved Dens of Death | antebellum | reformers, tenements, **Central Park and Seneca Village** |
| 45 | 796 | Feme Decovert | antebellum | women's city, prostitution, Restell, Jenny Lind |
| 46 | 821 | Louis Napoleon and Fernando Wood | antebellum | Haussmann envy, Mayor Wood, police riot 1857, Dead Rabbits |
| 47 | 842 | The Panic of 1857 | antebellum | the crash and the relief fight |
| 48 | 852 | The House Divides | antebellum | Republicans, Black civil rights, Sandy Ground, Colored Orphan Asylum |
| 49 | 864 | Civil Wars | civilWarGilded | merchants' southern ties, war finance, shoddy aristocracy |
| 50 | 883 | The Battle for New York | civilWarGilded | Emancipation politics, the Draft Riots, the 1864 arson plot |
| 51 | 906 | Westward, Ho! | civilWarGilded | railroads, Wall Street and the West |
| 52 | 917 | Reconstructing New York | civilWarGilded | 1866 health board, 1867 tenement law, fire department, Black suffrage |
| 53 | 929 | City Building | civilWarGilded | Tweed's works, upper Manhattan, the els, Brooklyn Bridge, Ladies' Mile |
| 54 | 951 | Haut Monde and Demimonde | civilWarGilded | Gilded Age society and its underworld |
| 55 | 966 | The Professional-Managerial Class | civilWarGilded | the new middle class at home and at leisure |
| 56 | 986 | Eight Hours for What We Will | civilWarGilded | workers, unions, radicals |
| 57 | 1002 | The New York Commune? | civilWarGilded | Tweed's fall, the Orange Riots |
| 58 | 1020 | Work or Bread! | civilWarGilded | 1873 depression, Tompkins Square 1874 |

**Part Five: Industrial Center and Corporate Command Post, 1880–1898**

| Ch. | p. | Title | Era | What's in it |
| --: | --: | --- | --- | --- |
| 59 | 1041 | Manhattan, Inc. | civilWarGilded | corporations, exchanges, advertising, early skyscrapers |
| 60 | 1059 | Bright Lights, Big City | civilWarGilded | Edison, Pearl Street, Morgan, electrification |
| 61 | 1071 | Châteaux Society | civilWarGilded | new money vs. old, the Met, the Opera |
| 62 | 1089 | "The Leeches Must Go!" | civilWarGilded | Henry George's 1886 campaign |
| 63 | 1111 | The New Immigrants | civilWarGilded | Jews, Italians, Chinese |
| 64 | 1132 | That's Entertainment! | civilWarGilded | Broadway, Pulitzer, vaudeville, Tin Pan Alley, Coney Island |
| 65 | 1155 | Purity Crusade | civilWarGilded | Parkhurst, vice and saloon crusades |
| 66 | 1170 | Social Gospel | civilWarGilded | settlements, charity organization, Riis |
| 67 | 1185 | Good Government | civilWarGilded | 1893 depression, the Lexow hearings, reform mayor Strong, 1896 election |
| 68 | 1209 | Splendid Little War | civilWarGilded | TR, Martí, Hearst, the Maine |
| 69 | 1219 | Imperial City | civilWarGilded | Andrew Haswell Green and consolidation |

## Chapter guide: *Greater Gotham* (2017)

The EPUB splits each chapter into titled sections. `find.py` prints them
as `8. Arteries › Trains and Tunnels`. Cite them the same way.

| Ch. | Title | Sections worth knowing for the map |
| --: | --- | --- |
| — | Vantage Points (intro) | the 1898 city from above |
| 1–4 | Mergers · Acquisitions · Consolidation · Wall Street | the merger wave, Morgan, the 1901 U.S. Steel era, the Exchange |
| 5 | Critics and Crisis | Muckrakers · Teddy · Panic of 1907 · Other People's Money |
| 6 | Who Rules New York? | Bosses and Businessmen · Radicals and Regulators · Experts |
| 7 | Sky Boom | Skyline · Builders, Engineers, Financiers · City Beauticians · Too Tall! · **Zoning (1916)** |
| 8 | Arteries | Trains and Tunnels · Boats and Docks · Immigration Island · Moving Freight · Water · Power · Food In · Garbage Out |
| 9 | Ligaments | **Bridges · Els, Cables, Trolleys · Planning/Building/Expanding the Subway** · The Automobiling Class |
| 10 | Housing | Old Law, New Law (1901) · Model Homes · working-class neighborhoods by borough · **The Bronx: Instant City** · middle-class Brooklyn and Queens · apartments · mansions · summer homes |
| 11 | Industrial and Commercial City | touring the industrial city · department stores |
| 12 | Acropoli | Art by the Cartload · Fossil Philanthropy · **The Bronx Zoo** · universities · libraries · opera |
| 13 | Show Biz | **Times Square** · Broadway · vaudeville · Tin Pan Alley · movies · nightlife · Coney Island |
| 14 | Popular Cultures | staging ethnicity, ragtime, the dance craze |
| 15 | Seeing New York | the city as subject |
| 16 | Progressives | settlements (Henry Street), child labor, health, schools, the 1912 Bull Moose |
| 17 | Repressives | gangs, police, vice, gambling, drink, drugs |
| 18 | Union Town | builders, printers, Italians and Jews in the unions |
| 19 | Radicals | Jewish radicals, Italian anarchists, **the 1909 Uprising**, Triangle and Tammany, IWW and Socialists, 1914 unemployed |
| 20 | Bending Gender | New Women, the Village, feminists, fairies, birth control, suffrage |
| 21 | Black Metropolis | the 1900 riot, the migration, Caribbean New York, Jim Crow housing/jobs, **Harlem**, New Negroes |
| 22 | Insurgent Art | Ash Can realists, modernists, the Armory Show, Dreiser, Wharton |
| 23 | Over There? | neutrality, Lusitania, sabotage (Black Tom, 1916), preparedness |
| 24 | Over Here | mobilization, Liberty Loans, the influenza, the 1919 homecoming |

## Audit of the current `gotham` notes (2026-09-26)

Checked all twelve existing notes and their blurbs against the book.

| Entry | Finding | Suggested fix |
| --- | --- | --- |
| Juan Rodriguez | The note calls him "one of Gotham's signature recoveries," but the book gives him one parenthetical sentence (ch. 2, p. 19), as "Jan Rodrigues," "a mulatto from San Domingo" left behind to trade while Block went home in 1614. | Tone the note down, e.g. "Gotham mentions him in a single aside, which later historians built into a landmark." |
| The ice retreats | Blurb says "a mile of ice"; *Gotham* says a sheet "a thousand feet thick" over the city about 50,000 years ago (ch. 1, p. 4). | Use the book's figure, or say "hundreds of metres." |
| Commissioners' Plan of 1811 | Note says Gotham calls the grid "the decisive act of the city's speculative imagination." The book frames it as technique triumphing over topography, and notes the commissioners stopped at 155th St. partly to avoid feeding speculation (ch. 26, p. 420–22). | Rewrite, e.g. "Gotham reads the grid as republican order imposed on Manhattan's hills: technique over topography, with almost no room left for parks." |
| The prison ships | Blurb says "some 11,000"; the book says 11,500 dead, on at least twenty ships (ch. 16, p. 253–54). "Greatest atrocity" is the note's own framing. | Fine as is; optionally "11,500." |
| Captain William Kidd | Book: he provided "the block and tackle" for Trinity's stones (ch. 8, p. 113). The blurb's "runner's tackle" is a slip. | "lent the block and tackle" |
| 'Great Negro Plot' trials | Book: 17 Black men hanged, 13 burned, 4 whites hanged (ch. 11, p. 163). The blurb matches. | — |
| First enslaved Africans arrive | Book: "in 1625 or 1626," eleven men, names given (ch. 3, p. 31); half-freedom came in 1644 (p. 33). The blurb matches. | — |
| Washington Irving | Matches: *Salmagundi* (1807) named the city Gotham (Introduction, p. xii). | — |
| Madame Restell | Matches: in 1857 she bought Fifth Ave. at 52nd St., outbidding Archbishop Hughes (ch. 45, p. 810). | — |
| Consolidation | "1,236 pages" is right: the text ends on p. 1236. | — |
| Henry George, The Lenape | Consistent with ch. 62 and ch. 1. | — |

## Candidate additions, with where to read

These are topics the books cover at length that the map doesn't have yet
as entries. They are limited to things that can go on the map or the
timeline. Some already exist as a structure or label; adding an entry
would give them a card.

**Evening out the thin eras** (README "More history")

- *Lenape* (13 entries): ch. 1 has the trail network by borough, Rockaway
  and Canarsee planting fields, shell middens, and the terminal moraine
  ridge (p. 3–13).
- *New Amsterdam*: half-freedom and the free Black farms along the road
  to Harlem (ch. 3, p. 32–33; ch. 4); the Stadt Herberg, which became
  the Stadthuis (ch. 3, p. 35; ch. 5); the Pavonia massacre, 1643 (ch. 3).
- *British colony*: sugar houses and the refinery trade (ch. 9, 12); the
  Vauxhall and Ranelagh pleasure gardens (ch. 12, p. 175); the 1731
  Montgomerie Charter's waterfront grant (ch. 10, p. 138).
- *Revolution*: the Hickey plot of 1776 (ch. 15, p. 231); the occupation's
  "Negro Barracks" and Black Loyalists (ch. 16, p. 249).
- *Early Republic*: the Manumission Society and African Free School
  (ch. 18, p. 285–86); Mother Zion church (ch. 25); the Park Theatre
  (ch. 23).

**Heavily indexed people with no entry yet** (index page count in parentheses)

- *Gotham*: George Templeton Strong (28; the diarist, a natural "witness"
  voice), Arthur and Lewis Tappan (27/22; abolitionist merchants, 1834
  riots), William Livingston (28), James Duane (22), Henry Ward Beecher
  (21; Plymouth Church, Brooklyn Heights), Frances Wright (19), Abram
  Hewitt (17), John Lamb (20; Sons of Liberty), Josephine Shaw Lowell
  (12), Samuel Gompers (13).
- *Greater Gotham*: Jacob Schiff (52), Morris Hillquit (45), John Purroy
  Mitchel (44; the 1914–17 reform mayor), William Randolph Hearst (44),
  Big Tim Sullivan (30), Abraham Cahan (28; the *Forward*), Lillian Wald
  (37; Henry Street), Florence Kelley (22), Rose Schneiderman (14),
  Elizabeth Gurley Flynn (14), Margaret Sanger (12), John Sloan (14),
  Irving Berlin (16).

**Places and events for `greaterNY`**, which has 22 entries and no margin
notes yet:

- 1916 Zoning Resolution and the Equitable Building (ch. 7 › Zoning)
- Williamsburg, Manhattan, and Queensboro bridges (ch. 9 › Bridges). They
  are already drawn as line geometry, but have no entry cards.
- Hudson & Manhattan tubes, Penn and Grand Central tunnels (ch. 8 › Trains
  and Tunnels)
- The Tenement House Act of 1901 (ch. 10 › Old Law, New Law)
- The Bronx as an "instant city" along the subway (ch. 10 › The Bronx)
- Bronx Zoo, 1899 (ch. 12)
- Henry Street Settlement (ch. 16)
- Uprising of the 20,000, 1909 (ch. 19)
- The 1900 Tenderloin riot and San Juan Hill (ch. 21 › Riot)
- 1917 Silent Protest Parade (ch. 21)
- Black Tom explosion, 1916 (ch. 23)
- The 1918 influenza (ch. 24)

Each `greaterNY` entry can now take a `gotham` note sourced from *Greater
Gotham*.
