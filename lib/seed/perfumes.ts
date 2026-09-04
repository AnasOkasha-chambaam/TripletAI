// /lib/seed/perfumes.ts
//
// A small catalogue of real, well-documented fragrances used to seed the app
// with instruction-tuning triplets. Houses, release years, perfumers and note
// pyramids are taken from Fragrantica / Basenotes / Wikipedia and the brands'
// own product pages; see lib/seed/README.md for the per-entry sources.
//
// Where a fragrance has been reformulated or exists in several concentrations,
// the entry describes the original release named by `year`.

export type TPerfume = {
  name: string;
  house: string;
  year: number;
  /** Every nose credited on the original release. */
  perfumers: string[];
  family: string;
  gender: "feminine" | "masculine" | "unisex";
  top: string[];
  heart: string[];
  base: string[];
  /** One sentence a human reviewer would accept as the scent's character. */
  character: string;
  /** What makes it historically or commercially notable. */
  claimToFame: string;
};

export const PERFUMES: TPerfume[] = [
  {
    name: "N°5",
    house: "Chanel",
    year: 1921,
    perfumers: ["Ernest Beaux"],
    family: "Floral Aldehyde",
    gender: "feminine",
    top: ["aldehydes", "ylang-ylang", "neroli", "bergamot", "lemon"],
    heart: ["iris", "jasmine", "rose", "orris root", "lily-of-the-valley"],
    base: [
      "sandalwood",
      "vetiver",
      "vanilla",
      "amber",
      "patchouli",
      "moss",
      "musk",
      "civet",
    ],
    character:
      "A soapy, luminous bouquet in which a large overdose of aldehydes lifts jasmine and rose off the skin and holds them above a warm, powdery woody-musk base.",
    claimToFame:
      "The first floral-aldehyde fragrance, and the first to use aldehydes in such quantity. It was launched on the fifth day of the fifth month of 1921 at Chanel's rue Cambon boutique.",
  },
  {
    name: "Shalimar",
    house: "Guerlain",
    year: 1925,
    perfumers: ["Jacques Guerlain"],
    family: "Amber (Oriental)",
    gender: "feminine",
    top: ["bergamot", "lemon"],
    heart: ["iris", "jasmine", "rose"],
    base: [
      "vanilla",
      "tonka bean",
      "opoponax",
      "patchouli",
      "vetiver",
      "musk",
      "civet",
    ],
    character:
      "A sharp citrus opening that collapses almost immediately into a smoky, leathery vanilla — powdery and animalic at once, and far darker than the word 'vanilla' suggests.",
    claimToFame:
      "Widely regarded as the first oriental (amber) perfume. Jacques Guerlain named it after the Shalimar Gardens, inspired by the story of the Mughal emperor Shah Jahan.",
  },
  {
    name: "Angel",
    house: "Mugler",
    year: 1992,
    perfumers: ["Olivier Cresp", "Yves de Chirin"],
    family: "Gourmand",
    gender: "feminine",
    top: ["bergamot", "red berries"],
    heart: ["praline", "honey", "red fruits"],
    base: ["patchouli", "vanilla", "caramel", "chocolate"],
    character:
      "Enormous and divisive: burnt-sugar praline and caramel welded to a damp, earthy patchouli, sweet enough to read as edible and bitter enough to stop it being a dessert.",
    claimToFame:
      "The first modern gourmand fragrance. Its unprecedented use of ethyl maltol in fine perfumery created the praline-caramel accord that an entire genre was then built on.",
  },
  {
    name: "Acqua di Giò",
    house: "Giorgio Armani",
    year: 1996,
    perfumers: ["Alberto Morillas", "Annick Menardo", "Christian Dussoulier"],
    family: "Aromatic Aquatic",
    gender: "masculine",
    top: ["lime", "lemon", "bergamot", "neroli", "mandarin orange"],
    heart: ["sea notes", "calone", "jasmine", "rosemary", "peach", "coriander"],
    base: ["white musk", "cedar", "oakmoss", "patchouli", "amber"],
    character:
      "Bright citrus over a clean, salty marine accord — transparent and sunlit, with a soft woody-musk drydown that stays close and inoffensive.",
    claimToFame:
      "The fragrance that defined the 1990s aquatic genre and made calone the decade's signature material. It remains one of the best-selling men's fragrances ever released.",
  },
  {
    name: "Light Blue",
    house: "Dolce & Gabbana",
    year: 2001,
    perfumers: ["Olivier Cresp"],
    family: "Fruity Floral",
    gender: "feminine",
    top: ["Sicilian lemon", "green apple", "cedar", "bellflower"],
    heart: ["bamboo", "jasmine", "white rose"],
    base: ["cedar", "musk", "amber"],
    character:
      "A crisp snap of green apple and Sicilian lemon over cool woods — casual, sparkling and deliberately uncomplicated.",
    claimToFame:
      "Built to evoke a Sicilian summer, it became one of the most commercially durable fruity-florals of the 2000s and has won numerous industry awards.",
  },
  {
    name: "Coco Mademoiselle",
    house: "Chanel",
    year: 2001,
    perfumers: ["Jacques Polge"],
    family: "Amber Floral / Chypre",
    gender: "feminine",
    top: ["bergamot", "orange"],
    heart: ["jasmine", "rose"],
    base: ["patchouli", "vetiver", "vanilla", "white musk"],
    character:
      "A bright citrus opening over rose and jasmine, anchored by a clean, polished patchouli that gives it more grip than its fresh opening promises.",
    claimToFame:
      "Jacques Polge's modern counterpoint to Coco, and the fragrance that made clean, laundered patchouli a mainstream feminine signature.",
  },
  {
    name: "Flowerbomb",
    house: "Viktor&Rolf",
    year: 2005,
    perfumers: [
      "Olivier Polge",
      "Carlos Benaïm",
      "Domitille Michalon Bertier",
      "Dominique Ropion",
    ],
    family: "Amber Floral",
    gender: "feminine",
    top: ["tea", "bergamot", "osmanthus"],
    heart: ["orchid", "jasmine", "rose", "freesia", "African orange flower"],
    base: ["patchouli", "musk", "vanilla"],
    character:
      "A dense, sugared floral explosion — jasmine and orange flower packed tight against vanilla and patchouli, with almost no quiet moment.",
    claimToFame:
      "A four-perfumer collaboration whose grenade-shaped bottle became as recognisable as the scent, and which anchored the sweet-floral boom of the mid-2000s.",
  },
  {
    name: "Tobacco Vanille",
    house: "Tom Ford",
    year: 2007,
    perfumers: ["Olivier Gillotin"],
    family: "Amber Spicy",
    gender: "unisex",
    top: ["tobacco leaf", "spicy notes"],
    heart: ["vanilla", "cacao", "tonka bean", "tobacco blossom"],
    base: ["dried fruits", "woody notes"],
    character:
      "Warm pipe tobacco steeped in vanilla and cacao, with dried fruit sweetness — thick, sweet and room-filling rather than sharp.",
    claimToFame:
      "The Private Blend release that defined the modern tobacco-gourmand category and spawned an enormous number of imitations.",
  },
  {
    name: "Aventus",
    house: "Creed",
    year: 2010,
    perfumers: ["Jean-Christophe Hérault", "Erwin Creed"],
    family: "Fruity Chypre",
    gender: "masculine",
    top: ["bergamot", "blackcurrant", "apple", "lemon", "pink pepper"],
    heart: ["pineapple", "patchouli", "birch", "jasmine"],
    base: ["oakmoss", "musk", "ambergris", "vanilla"],
    character:
      "Smoky birch tar cutting through bright pineapple and blackcurrant, drying down to a mossy, ambered woodiness — fruity and charred in the same breath.",
    claimToFame:
      "The fruity-smoky accord that reset the luxury men's category in the 2010s. Batch-to-batch variation is itself part of the fragrance's folklore.",
  },
  {
    name: "Bleu de Chanel",
    house: "Chanel",
    year: 2010,
    perfumers: ["Jacques Polge"],
    family: "Woody Aromatic",
    gender: "masculine",
    top: ["grapefruit", "lemon", "mint", "pink pepper"],
    heart: ["ginger", "nutmeg", "jasmine"],
    base: ["incense", "vetiver", "sandalwood"],
    character:
      "A crisp grapefruit-and-mint opening that turns dry and smoky, with incense and vetiver giving it a formal, slightly austere finish.",
    claimToFame:
      "Chanel's answer to the modern designer masculine, and the house's most commercially successful men's launch.",
  },
  {
    name: "Santal 33",
    house: "Le Labo",
    year: 2011,
    perfumers: ["Frank Voelkl"],
    family: "Woody Aromatic",
    gender: "unisex",
    top: ["violet accord", "cardamom"],
    heart: ["iris", "ambrox"],
    base: ["sandalwood", "cedarwood", "leather"],
    character:
      "A dry, creamy cedar-and-sandalwood haze with a leathery edge, softened by powdery iris and a green cardamom lift.",
    claimToFame:
      "Began life as the Santal 26 candle before Le Labo asked Voelkl to rework it as a wearable perfume. It became the defining niche scent of the 2010s.",
  },
  {
    name: "Black Opium",
    house: "Yves Saint Laurent",
    year: 2014,
    perfumers: [
      "Nathalie Lorson",
      "Marie Salamagne",
      "Olivier Cresp",
      "Honorine Blanc",
    ],
    family: "Gourmand",
    gender: "feminine",
    top: ["pink pepper", "orange blossom", "pear"],
    heart: ["coffee", "jasmine"],
    base: ["vanilla", "patchouli", "cedarwood"],
    character:
      "Black coffee poured over vanilla and white flowers — sweet, dark and slightly bitter, with a sparkling pear-and-pepper opening.",
    claimToFame:
      "Made the coffee accord a mainstream feminine note. Each of its four perfumers built a different facet: Lorson the coffee, Salamagne the pear and pepper, Blanc the white flowers.",
  },
  {
    name: "Sauvage",
    house: "Dior",
    year: 2015,
    perfumers: ["François Demachy"],
    family: "Woody Aromatic",
    gender: "masculine",
    top: ["Calabrian bergamot", "pepper"],
    heart: [
      "Sichuan pepper",
      "lavender",
      "pink pepper",
      "vetiver",
      "patchouli",
      "geranium",
      "elemi",
    ],
    base: ["ambroxan", "cedar", "labdanum"],
    character:
      "A loud, mineral freshness — bright bergamot and pepper over a huge ambroxan base that projects hard and lasts for hours.",
    claimToFame:
      "Demachy commissioned a bespoke bergamot from producers in Reggio di Calabria. It became the best-selling men's fragrance in the world.",
  },
  {
    name: "Baccarat Rouge 540",
    house: "Maison Francis Kurkdjian",
    year: 2015,
    perfumers: ["Francis Kurkdjian"],
    family: "Amber Floral",
    gender: "unisex",
    top: ["saffron", "jasmine"],
    heart: ["amberwood", "ambergris", "hedione"],
    base: ["fir resin", "cedar", "sugar", "ambroxan"],
    character:
      "Airy and oddly metallic: burnt-sugar sweetness stretched over saffron and mineral amber, more like a lit space than a bouquet.",
    claimToFame:
      "Created to mark the crystal maker Baccarat's 250th anniversary, it became the most imitated luxury fragrance of its decade.",
  },
];
