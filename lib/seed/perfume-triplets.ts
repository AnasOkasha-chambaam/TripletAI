// /lib/seed/perfume-triplets.ts
//
// Turns the PERFUMES catalogue into instruction/input/output triplets, and adds
// hand-written general-perfumery and recommendation examples.
//
// Statuses are spread across pending / accepted / rejected on purpose so that
// all three dashboard tabs have something in them after seeding. The rejected
// entries are deliberately weak outputs -- vague, hedging or factually thin --
// which is what a reviewer curating a fine-tuning set actually throws out.

import { PERFUMES, type TPerfume } from "./perfumes";

export type TSeedTriplet = {
  instruction: string;
  input: string;
  output: string;
  status: "pending" | "accepted" | "rejected";
};

/** "a, b and c" */
const list = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const fullName = (p: TPerfume) => `${p.house} ${p.name}`;

/* ---------------- generated from the catalogue ---------------- */

function tripletsFor(p: TPerfume, index: number): TSeedTriplet[] {
  const name = fullName(p);

  return [
    {
      instruction:
        "List the fragrance note pyramid for the perfume named in the input.",
      input: name,
      output: `Top notes: ${list(p.top)}.\nHeart notes: ${list(
        p.heart
      )}.\nBase notes: ${list(p.base)}.`,
      status: "pending",
    },
    {
      instruction:
        "Name the perfumer or perfumers behind this fragrance and the year it was released.",
      input: name,
      output: `${name} was released in ${p.year}. ${
        p.perfumers.length > 1 ? "The noses behind it are" : "The nose behind it is"
      } ${list(p.perfumers)}.`,
      // Short, checkable facts: the kind of pair a reviewer approves quickly.
      status: "accepted",
    },
    {
      instruction: "Describe how this fragrance smells in two or three sentences.",
      input: name,
      output: `${p.character} ${p.claimToFame}`,
      status: "pending",
    },
    {
      instruction:
        "Which fragrance family does this perfume belong to, and what in its composition puts it there?",
      input: name,
      output: `${name} sits in the ${p.family} family. The classification comes from its ${list(
        p.heart.slice(0, 2)
      )} heart resting on a base of ${list(p.base.slice(0, 3))}.`,
      status: index % 3 === 0 ? "accepted" : "pending",
    },
  ];
}

/* ---------------- hand-written: general perfumery ---------------- */

const KNOWLEDGE_TRIPLETS: TSeedTriplet[] = [
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What is the difference between eau de toilette and eau de parfum?",
    output:
      "The difference is the concentration of perfume oil. Eau de toilette generally carries around 5-15% aromatic compounds, while eau de parfum carries roughly 15-20%. In practice an eau de parfum projects a little less sharply at first but lasts noticeably longer on skin, and often smells richer in its base notes. The same fragrance can smell meaningfully different across the two concentrations, because houses frequently rebalance the formula rather than simply diluting it.",
    status: "accepted",
  },
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What do people mean by a fragrance's sillage?",
    output:
      "Sillage is the trail a fragrance leaves behind you as you move through a room — the French word for a ship's wake. It is distinct from longevity, which is how long the scent lasts on your skin, and from projection, which is how far it radiates while you are standing still. A fragrance can have excellent longevity and almost no sillage: it stays on the skin for hours but nobody notices it unless they lean in.",
    status: "accepted",
  },
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What is a note pyramid?",
    output:
      "A note pyramid describes how a fragrance unfolds over time, in three stages. Top notes are what you smell in the first few minutes — usually light, volatile materials like citrus and herbs. Heart notes emerge as those burn off, typically florals and spices, and form the fragrance's main character. Base notes are the heaviest materials, such as woods, resins, musks and vanilla; they appear last and account for most of the longevity. The pyramid is a marketing convention rather than a precise chemical description, but it maps reasonably well onto how a scent is actually experienced.",
    status: "pending",
  },
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What are aldehydes and why do people mention them with Chanel N°5?",
    output:
      "Aldehydes are a class of organic compounds that, in perfumery, smell bright, waxy and soapy, with a distinctive fizzy or 'sparkling' lift. They make the materials around them feel more radiant and less literal. Chanel N°5 is associated with them because Ernest Beaux used them in an unprecedented quantity in 1921, creating the floral-aldehyde family and giving the fragrance its characteristic abstract, soap-clean shimmer over jasmine and rose.",
    status: "pending",
  },
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What makes a fragrance a chypre?",
    output:
      "A chypre is built on a structure rather than a single note: a citrus opening — classically bergamot — over a base of oakmoss, labdanum and patchouli. The contrast between the bright top and the dry, earthy, slightly bitter base is what defines it. The name comes from François Coty's Chypre of 1917, itself named after Cyprus. Modern chypres are frequently reformulated because oakmoss is restricted by IFRA regulations, so many contemporary examples use substitutes to approximate the mossy accord.",
    status: "pending",
  },
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What is a gourmand fragrance?",
    output:
      "A gourmand is a fragrance built around edible-smelling notes — vanilla, caramel, chocolate, coffee, praline, almond — so that it reads as something you could eat rather than something floral or woody. The genre is usually dated to Mugler's Angel in 1992, which used ethyl maltol to create a burnt-sugar praline accord at a scale fine perfumery had not attempted before.",
    status: "accepted",
  },
  {
    instruction: "Answer the customer's practical question about wearing fragrance.",
    input: "Why does my perfume disappear on me after an hour but last all day on my friend?",
    output:
      "Skin chemistry is the main factor. Drier skin holds fragrance oils poorly, so the scent evaporates faster; well-moisturised or oilier skin gives the molecules something to cling to. Body heat, pH and even diet can shift how quickly the top notes burn off. There is also olfactory fatigue: you stop registering a scent you have been wearing for an hour, so it may still be there while you can no longer detect it. Applying to moisturised skin at pulse points, and not rubbing the wrists together, both help.",
    status: "pending",
  },
  {
    instruction: "Answer the customer's practical question about wearing fragrance.",
    input: "Should I spray perfume on my clothes or my skin?",
    output:
      "Skin is generally better. Fragrance is designed to develop with body heat, and the note pyramid only unfolds properly when it warms on skin. Sprayed on fabric a scent tends to stay flat and stall in its top notes, though it will often last far longer there. Fabric also carries two risks: oils and alcohol can stain delicate materials such as silk, and darker fragrances can leave marks. If you want the longevity of fabric, spray a scarf or a coat lining rather than a garment you care about.",
    status: "pending",
  },
];

/* ---------------- hand-written: recommendation scenarios ---------------- */

const RECOMMENDATION_TRIPLETS: TSeedTriplet[] = [
  {
    instruction:
      "Recommend a fragrance for the occasion described, and explain the choice in one or two sentences.",
    input: "Something fresh for a hot summer day at the office.",
    output:
      "Dolce & Gabbana Light Blue. Its Sicilian lemon and green apple opening over cool cedar reads as clean rather than heavy in warmth, and it sits close enough to the skin not to overwhelm a shared workspace.",
    status: "accepted",
  },
  {
    instruction:
      "Recommend a fragrance for the occasion described, and explain the choice in one or two sentences.",
    input: "A formal winter evening event where I want to be noticed.",
    output:
      "Tom Ford Tobacco Vanille. The tobacco leaf, cacao and vanilla accord is rich enough to hold its own against cold air and heavy fabrics, and it projects generously — one or two sprays is genuinely enough in an enclosed room.",
    status: "accepted",
  },
  {
    instruction:
      "Recommend a fragrance for the occasion described, and explain the choice in one or two sentences.",
    input: "A first date, and I don't want to smell like everyone else.",
    output:
      "Le Labo Santal 33. Its dry sandalwood-and-leather haze is distinctive without being loud, and the powdery iris keeps it warm rather than sharp — though be aware it became popular enough in the 2010s that some people will recognise it immediately.",
    status: "pending",
  },
  {
    instruction:
      "Recommend a fragrance for the occasion described, and explain the choice in one or two sentences.",
    input: "A gift for someone who says they only like vanilla scents.",
    output:
      "Guerlain Shalimar, if they are open to something less literal. It is built on vanilla and tonka bean but pulls them somewhere smoky and leathery, so it reads as far more complex than a straightforward vanilla. If they want the comfort of a plain vanilla, Tom Ford Tobacco Vanille is the safer gift.",
    status: "pending",
  },
  {
    instruction:
      "Suggest an alternative fragrance with a similar character to the one in the input.",
    input: "I love Creed Aventus but it's out of my budget.",
    output:
      "The character you are after is smoky birch against bright fruit. Nothing matches it exactly, but look for fragrances built on a pineapple-and-birch accord in the designer range — and note that Aventus itself varies noticeably between batches, so even the original is not a single fixed target. Set your expectations on capturing the fruity-smoky impression rather than a like-for-like copy.",
    status: "pending",
  },
  {
    instruction:
      "Suggest an alternative fragrance with a similar character to the one in the input.",
    input: "I want something like Baccarat Rouge 540 but less sweet.",
    output:
      "The mineral, airy amber of Baccarat Rouge 540 comes largely from ambroxan, which also drives the base of Dior Sauvage — that gives you a comparable radiance with far less burnt-sugar sweetness, though in a much fresher, more citrus-forward direction. If you want to keep the warmth and only lose the sugar, look toward amberwood compositions without a gourmand accord.",
    status: "pending",
  },
  {
    instruction:
      "Compare the two fragrances in the input and say who each one suits.",
    input: "Dior Sauvage vs Bleu de Chanel",
    output:
      "Both are woody aromatics built for broad appeal, but they resolve differently. Sauvage is louder and more mineral: bright bergamot over a large ambroxan base that projects hard and reads young and casual. Bleu de Chanel is drier and more formal, moving from grapefruit and mint into incense, vetiver and sandalwood. Choose Sauvage for everyday wear and visibility; choose Bleu de Chanel for office and evening settings where restraint matters.",
    status: "accepted",
  },
  {
    instruction:
      "Compare the two fragrances in the input and say who each one suits.",
    input: "Mugler Angel vs YSL Black Opium",
    output:
      "Both are gourmands, but a generation apart in style. Angel is the more extreme: praline and caramel welded to a damp patchouli, polarising and enormous, with a bitterness that stops it reading as dessert. Black Opium is the smoother, more wearable descendant — coffee and vanilla over white flowers, sweet and dark but far easier to wear in an office. Pick Angel if you want a signature people will argue about; Black Opium if you want a gourmand that offends nobody.",
    status: "pending",
  },
];

/* ---------------- hand-written: realistic rejects ---------------- */
// Weak outputs a reviewer would cut: vague, hedging, or padded with no content.

const REJECTED_TRIPLETS: TSeedTriplet[] = [
  {
    instruction: "Describe how this fragrance smells in two or three sentences.",
    input: "Guerlain Shalimar",
    output: "It smells very nice and is a classic perfume that many people love.",
    status: "rejected",
  },
  {
    instruction:
      "List the fragrance note pyramid for the perfume named in the input.",
    input: "Mugler Angel",
    output: "Top: sweet notes. Heart: more sweet notes. Base: sweet notes.",
    status: "rejected",
  },
  {
    instruction:
      "Name the perfumer or perfumers behind this fragrance and the year it was released.",
    input: "Le Labo Santal 33",
    output:
      "It was made by a perfumer at Le Labo some time in the 2010s. I'm not certain of the exact details.",
    status: "rejected",
  },
  {
    instruction:
      "Recommend a fragrance for the occasion described, and explain the choice in one or two sentences.",
    input: "Something for a job interview.",
    output:
      "Any fragrance will work as long as you like it. Fragrance is subjective and personal, so just wear whatever makes you feel confident on the day.",
    status: "rejected",
  },
  {
    instruction: "Answer the customer's question about fragrance terminology.",
    input: "What is sillage?",
    output: "Sillage is a French word used in perfumery.",
    status: "rejected",
  },
  {
    instruction:
      "Which fragrance family does this perfume belong to, and what in its composition puts it there?",
    input: "Chanel N°5",
    output:
      "It's a floral. Most perfumes for women are florals, so that's the family it belongs to.",
    status: "rejected",
  },
];

/** Every triplet the seed route writes. Deterministic: same input every run. */
export function buildPerfumeTriplets(): TSeedTriplet[] {
  return [
    ...PERFUMES.flatMap(tripletsFor),
    ...KNOWLEDGE_TRIPLETS,
    ...RECOMMENDATION_TRIPLETS,
    ...REJECTED_TRIPLETS,
  ];
}
