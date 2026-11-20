// Helper that points to your pictures in the public folder: image 1.png ... image 30.png
export const pic = (n) => encodeURI(`/image ${n}.png`);

const A = ['S', 'M', 'L', 'XL', 'XXL'];
const D = ['28', '30', '32', '34', '36'];

// product id → your picture number
const IMG = {
  'signature-red-hat': 7, 'broken-earth-fisherman-beanie': 8, 'waxed-canvas-utility-bucket-hat': 3,
  'stone-washed-olive-field-cap': 25, 'reactive-technical-puffer': 28, 'architectural-charcoal-wool-overcoat': 16,
  'red-crown-heavy-twill-overshirt': 20, 'raw-selvedge-denim-chore-coat': 10, 'broken-earth-heavyweight-boxy-tee': 2,
  'sun-faded-distressed-longsleeve': 26, 'double-layered-raw-cuff-ls-tee': 19, 'nomad-crest-washed-boxy-tee': 22,
  'obsidian-waxed-flared-denim': 30, 'double-waisted-painted-flared-denim': 27, 'studded-washed-charcoal-jorts': 29,
  'chronograph-01-steel-field-watch': 4, 'obsidian-lug-sole-calfskin-boots': 6, 'full-grain-micro-hardware-belt': 21,
  'heavy-duck-canvas-weekender-tote': 9,
};

const P = (id, cat, name, price, sizes, color, desc, tag) =>
  ({ id, cat, name, price, sizes, color, desc, tag, image: pic(IMG[id]) });

export const CATEGORIES = ['All', 'Headwear', 'Outerwear', 'Tees', 'Denim', 'Accessories'];
export const RATE = 1560; // 1 USD in NGN
export const FREE_SHIPPING = 225; // USD
export const SHIPPING = 16; // USD

export const products = [
  P('signature-red-hat', 'Headwear', 'Signature Red Hat — Wool 6-Panel', 75, ['One Size'], 'Signature Crimson', 'Brushed crimson wool-twill · Structured 6-panel crown', 'Emblem Piece'),
  P('broken-earth-fisherman-beanie', 'Headwear', 'Broken Earth Fisherman Beanie', 62, ['One Size'], 'Espresso Brown', '5-gauge espresso merino · Deep turn-up rib cuff'),
  P('waxed-canvas-utility-bucket-hat', 'Headwear', 'Waxed Canvas Utility Bucket Hat', 70, ['S/M', 'L/XL'], 'Waxed Obsidian', 'Water-resistant black waxed cotton · 8-row stitched brim'),
  P('stone-washed-olive-field-cap', 'Headwear', 'Stone-Washed Olive Field Cap', 64, ['One Size'], 'Washed Olive', '360gsm washed olive duck canvas · Tonal crest embroidery'),
  P('reactive-technical-puffer', 'Outerwear', 'Reactive Technical Puffer Jacket', 380, A, 'Matte Obsidian', 'Cropped boxy baffles · High funnel collar · 700-fill loft', 'Flagship'),
  P('architectural-charcoal-wool-overcoat', 'Outerwear', 'Architectural Charcoal Wool Overcoat', 410, A, 'Charcoal', '540gsm double-faced virgin wool · Horn button front', 'Tailored'),
  P('red-crown-heavy-twill-overshirt', 'Outerwear', 'Red Crown Heavy Twill Overshirt', 220, A, 'Deep Crimson', '320gsm garment-dyed crimson twill · Twin bellow pockets'),
  P('raw-selvedge-denim-chore-coat', 'Outerwear', 'Raw Selvedge Denim Chore Coat', 245, A, 'Raw Indigo', '13.5oz raw Japanese indigo selvedge · Brass tack hardware'),
  P('broken-earth-heavyweight-boxy-tee', 'Tees', 'Broken Earth Heavyweight Boxy Tee', 95, A, 'Broken Brown', '320gsm sun-washed earth brown jersey · High rib collar', 'Signature Staple'),
  P('sun-faded-distressed-longsleeve', 'Tees', 'Sun-Faded Distressed Longsleeve', 135, A, 'Faded Charcoal', '340gsm acid-washed jersey · Exposed overlock seams', 'Bestseller'),
  P('double-layered-raw-cuff-ls-tee', 'Tees', 'Double-Layered Raw Cuff LS Tee', 125, A, 'Obsidian / Ash', 'Integrated two-tone sleeve & waist layering · 310gsm'),
  P('nomad-crest-washed-boxy-tee', 'Tees', 'Nomad Crest Washed Boxy Tee', 108, A, 'Washed Jet', '300gsm washed jet-black cotton · High-built bone ink'),
  P('obsidian-waxed-flared-denim', 'Denim', 'Obsidian Waxed Flared Denim', 270, D, 'Waxed Obsidian', '14oz matte wax-coated twill · Stacked flared hem', 'Signature Fit'),
  P('double-waisted-painted-flared-denim', 'Denim', 'Double-Waisted Painted Flared Denim', 250, D, 'Vintage Indigo', 'Stacked double waistband · Hand-painted bone strokes', 'Limited Run'),
  P('studded-washed-charcoal-jorts', 'Denim', 'Studded Washed Charcoal Jorts', 190, D, 'Washed Charcoal', 'Below-knee wide silhouette · Steel pocket stud trim'),
  P('chronograph-01-steel-field-watch', 'Accessories', 'Chronograph 01 Steel Field Watch', 310, ['41mm'], 'Gunmetal / Espresso', 'Brushed gunmetal 41mm case · Espresso leather strap', 'Limited Edition'),
  P('obsidian-lug-sole-calfskin-boots', 'Accessories', 'Obsidian Lug-Sole Calfskin Boots', 345, ['41', '42', '43', '44', '45'], 'Matte Black', 'Full-grain pebbled calfskin · Goodyear-welted lugsole', 'Footwear'),
  P('full-grain-micro-hardware-belt', 'Accessories', 'Full-Grain Micro Hardware Belt', 88, ['One Size'], 'Black / Steel', 'Vegetable-tanned cowhide · Brushed steel buckle'),
  P('heavy-duck-canvas-weekender-tote', 'Accessories', 'Heavy Duck Canvas Weekender Tote', 105, ['One Size'], 'Bone / Obsidian', '24oz unbleached duck canvas · Reinforced webbing straps'),
];