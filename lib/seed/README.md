# Perfume seed data — sources

The catalogue in [`perfumes.ts`](./perfumes.ts) uses real houses, release years,
perfumers and note pyramids. Where a fragrance exists in several concentrations
or has been reformulated, the entry describes the **original release** named by
its `year` field.

Notes and attributions were taken from Fragrantica, Basenotes, Parfumo,
Wikipedia and the brands' own product pages:

| Fragrance | Year | Perfumer(s) | Source |
| --- | --- | --- | --- |
| Chanel N°5 | 1921 | Ernest Beaux | https://www.fragrantica.com/perfume/Chanel/Chanel-N05-Vintage-608.html |
| Guerlain Shalimar | 1925 | Jacques Guerlain | https://en.wikipedia.org/wiki/Shalimar_(perfume) |
| Mugler Angel | 1992 | Olivier Cresp, Yves de Chirin | https://en.wikipedia.org/wiki/Angel_(perfume) |
| Giorgio Armani Acqua di Giò | 1996 | Alberto Morillas, Annick Menardo, Christian Dussoulier | https://www.fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-410.html |
| Dolce & Gabbana Light Blue | 2001 | Olivier Cresp | https://www.fragrantica.com/perfume/Dolce-Gabbana/Light-Blue-485.html |
| Chanel Coco Mademoiselle | 2001 | Jacques Polge | https://en.wikipedia.org/wiki/Coco_Mademoiselle |
| Viktor&Rolf Flowerbomb | 2005 | Olivier Polge, Carlos Benaïm, Domitille Michalon Bertier, Dominique Ropion | https://www.fragrantica.com/perfume/Viktor-Rolf/Flowerbomb-1460.html |
| Tom Ford Tobacco Vanille | 2007 | Olivier Gillotin | https://www.fragrantica.com/perfume/Tom-Ford/Tobacco-Vanille-1825.html |
| Creed Aventus | 2010 | Jean-Christophe Hérault, Erwin Creed | https://www.fragrantica.com/perfume/Creed/Aventus-9828.html |
| Bleu de Chanel | 2010 | Jacques Polge | https://en.wikipedia.org/wiki/Bleu_de_Chanel |
| Le Labo Santal 33 | 2011 | Frank Voelkl | https://en.wikipedia.org/wiki/Santal_33 |
| YSL Black Opium | 2014 | Nathalie Lorson, Marie Salamagne, Olivier Cresp, Honorine Blanc | https://en.wikipedia.org/wiki/Black_Opium_(perfume) |
| Dior Sauvage | 2015 | François Demachy | https://www.fragrantica.com/perfume/Dior/Sauvage-31861.html |
| Maison Francis Kurkdjian Baccarat Rouge 540 | 2015 | Francis Kurkdjian | https://en.wikipedia.org/wiki/Baccarat_Rouge_540 |

## Known ambiguity

**Creed Aventus** — attribution is inconsistent across sources. Fragrantica and
Parfumo credit Jean-Christophe Hérault; some listings name Erwin Creed and
others Olivier Creed. The catalogue records Hérault and Erwin Creed, which is
the most commonly cited pairing. Aventus also varies audibly between batches,
so its "note pyramid" is less fixed than most.

## Regenerating

The triplets themselves are built in [`perfume-triplets.ts`](./perfume-triplets.ts):
four generated triplets per fragrance (note pyramid, perfumer and year, scent
description, fragrance family) plus hand-written general-perfumery, comparison
and recommendation examples, and a small set of deliberately weak outputs marked
`rejected` so the dashboard's reject tab is not empty.

Apply with `POST /api/seed` (see [`app/api/seed/route.ts`](../../app/api/seed/route.ts)).
