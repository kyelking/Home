/*
 * CATALOG + SHIPPING CONFIG — the one file you edit.
 *
 * Each product has:
 *   cost       what ONE unit costs on AliExpress/CJ when you dropship (shipping to
 *              the US usually included). Used in "dropship" mode.
 *   bulkCost   per-unit price when you buy 200+ from an Alibaba factory, including
 *              sea freight to a US warehouse. Used in "bulk" mode.
 *   ship       extra shipping per unit for each method (0 = included in cost).
 *   supplier   the listing you buy from + its rating / reviews / sold count, so the
 *              planner can flag weak suppliers. Fill these in from the listing.
 *   images     photos, in gallery order (with the supplier's permission). Either plain URLs
 *              or { src, label }. Aim for 5–7 per product, e.g.:
 *                { src: "photos/monolith-front.jpg", label: "Front" }, Back, Side,
 *                Inside, Handle & lock, Wheels, Lifestyle (in use)
 *              Empty = built-in drawings (front, side, inside, detail, dimensions).
 *   dims       outside size in cm [height incl. wheels, width, depth]. Confirm with your sample.
 *   candidates listings found so far that are worth checking. Pick one, then copy it into supplier.
 *   reviews    REAL customer reviews only, e.g. { name: "Dana R.", stars: 5, text: "...", date: "2026-12-01" }.
 *              The reviews section stays hidden until you add some.
 *   box        shipping box in cm [L, W, H] + real weight in kg.
 */

window.STORE = {
  name: "ARDEN & VALE",
  tagline: "Quiet luxury for loud itineraries.",
  currency: "USD",
  freeShippingOver: 200,
  flatShipping: 19,
  bundleDiscount: 0.15,       // off the whole order with 2+ cases
  supportEmail: "concierge@ardenvale.com",

  pixels: { meta: "", tiktok: "", ga4: "", pinterest: "" },
  checkout: { mode: "demo", shopifyDomain: "" },

  sourcingMode: "dropship",   // "dropship" (buy per order) or "bulk" (stock a US warehouse)

  costs: {
    paymentPct: 0.029, paymentFixed: 0.30,
    dutyPct: 0.25,       // US duty + tariffs on China luggage. CHECK: rates change often.
    returnsPct: 0.04,
    appsPerOrder: 1.0,
  },

  // Supplier quality bar used by the planner.
  supplierRules: { minRating: 4.7, minSold: 500, minReviews: 50 },

  // Fallback estimate when a product has no quote. Carriers bill the larger of
  // real weight and volume weight (L*W*H/5000).
  shippingMethods: {
    us_warehouse: { label: "US warehouse (3–6 days)", perKg: 1.9, base: 6, days: [3, 6] },
    standard:     { label: "AliExpress Standard (8–15 days)", perKg: 4.2, base: 4, days: [8, 15] },
    express:      { label: "Express DHL/FedEx (4–8 days)", perKg: 7.5, base: 10, days: [4, 8] },
  },
  defaultMethod: "us_warehouse",
};

const none = { url: "", rating: null, reviews: null, sold: null, note: "" };

window.PRODUCTS = [
  // ───────────── SIGNATURE (luxury tier) ─────────────
  {
    id: "monolith-20", candidates: ["https://www.aliexpress.us/item/3256806140666440.html", "https://www.aliexpress.us/item/3256806558015541.html", "https://www.aliexpress.us/item/3256806532623482.html"], dims: [55, 38, 23], name: "The Monolith", size: '20"', category: "Carry-On", tier: "Signature",
    price: 445, cost: 124, bulkCost: 72, style: "all-aluminum", material: "Aluminum-magnesium alloy",
    colors: [["Silver", "#c9ccd1"], ["Obsidian", "#1d1e21"], ["Champagne", "#cdb79a"], ["Rose Gold", "#c9a092"]],
    blurb: "Solid aluminum-magnesium alloy that picks up character with every trip.",
    specs: ["100% aluminum-magnesium alloy body", "Leather-wrapped top handle", "Dual TSA locks", "Silent 360° spinners", "36 L · 4.4 kg"],
    box: [58, 41, 27], weight: 5.1,
    ship: { us_warehouse: 0, standard: 0, express: 45 },
    supplier: { url: "https://www.aliexpress.us/item/3256806140666440.html", rating: 4.8, reviews: 95, sold: 600,
      note: "Also check the Bunnyfly 18/20\" alloy case: 4.8★, 4,000+ sold, about $124–143." },
    images: [], reviews: [], badge: "Signature",
    search: "100% aluminum magnesium alloy carry on suitcase 20 inch",
  },
  {
    id: "monolith-26", candidates: ["https://www.aliexpress.us/item/3256807273933961.html", "https://www.aliexpress.us/item/3256805496892741.html"], dims: [70, 47, 28], name: "The Monolith Check-In", size: '26"', category: "Check-In", tier: "Signature",
    price: 595, cost: 178, bulkCost: 105, style: "all-aluminum", material: "Aluminum-magnesium alloy",
    colors: [["Silver", "#c9ccd1"], ["Obsidian", "#1d1e21"], ["Champagne", "#cdb79a"]],
    blurb: "The Monolith, sized for two weeks and built to last for decades.",
    specs: ["100% aluminum-magnesium alloy body", "Dual TSA locks", "Compression panels both sides", "82 L · 6.4 kg"],
    box: [72, 50, 31], weight: 7.4,
    ship: { us_warehouse: 0, standard: 0, express: 70 },
    supplier: { url: "https://www.aliexpress.us/item/3256807273933961.html", rating: null, reviews: null, sold: null,
      note: "Same alloy style in 20/24/26/29\". Check its rating before using it." },
    images: [], reviews: [], badge: "",
    search: "aluminum magnesium alloy suitcase 26 inch check in",
  },
  {
    id: "atelier-leather", candidates: ["https://www.aliexpress.us/item/3256805564748441.html", "https://www.aliexpress.us/w/wholesale-leather-suitcase.html"], dims: [55, 37, 23], name: "The Atelier", size: '20"', category: "Carry-On", tier: "Signature",
    price: 795, cost: 215, bulkCost: 128, style: "leather", material: "Full-grain cowhide over aluminum frame",
    colors: [["Cognac", "#8a5a3b"], ["Espresso", "#4a3326"], ["Black", "#1c1c1c"]],
    blurb: "Full-grain cowhide stretched over a rigid frame, hand-stitched at the corners.",
    specs: ["Full-grain cowhide leather", "Brass-tone hardware", "Canvas-lined interior", "Silent spinners", "35 L · 5.2 kg"],
    box: [60, 42, 28], weight: 6.0,
    ship: { us_warehouse: 0, standard: 0, express: 55 },
    supplier: { ...none, note: "Ask for proof the leather is full-grain cowhide, not PU or bonded leather. Leather is where cheap suppliers cut corners most." },
    images: [], reviews: [], badge: "Limited",
    search: "genuine cowhide leather trolley suitcase 20 inch spinner",
  },
  {
    id: "heritage-trunk", candidates: ["https://www.aliexpress.us/item/3256811624182464.html", "https://www.aliexpress.us/w/wholesale-vintage-suitcase-luggage.html"], dims: [63, 43, 33], name: "The Heritage Trunk", size: '24"', category: "Check-In", tier: "Signature",
    price: 395, cost: 110, bulkCost: 65, style: "trunk", material: "Polycarbonate, aluminum frame, vegan leather trim",
    colors: [["Cognac", "#8a5a3b"], ["Forest", "#2f4436"], ["Black", "#1c1c1c"]],
    blurb: "A deep trunk silhouette with vegan-leather corner guards and straps.",
    specs: ["Deep trunk profile", "Vegan leather straps + corners", "Aluminum frame", "80 L · 5.9 kg"],
    box: [66, 46, 36], weight: 6.6,
    ship: { us_warehouse: 0, standard: 0, express: 70 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "trunk suitcase aluminum frame leather strap retro 24 inch",
  },
  {
    id: "carbon-20", candidates: ["https://www.aliexpress.us/item/3256809642696167.html", "https://www.aliexpress.us/item/3256809626438842.html"], dims: [55, 37, 23], name: "The Carbon Edition", size: '20"', category: "Carry-On", tier: "Signature",
    price: 285, cost: 72, bulkCost: 34, style: "carbon", material: "Polycarbonate with carbon-fiber texture",
    colors: [["Carbon Black", "#1a1b1e"], ["Gunmetal", "#4a4e55"]],
    blurb: "A woven carbon-texture finish that hides scuffs and looks like nothing else on the carousel.",
    specs: ["Carbon-fiber texture polycarbonate shell", "Aluminum frame", "TSA lock", "Silent 360° spinners", "38 L · 3.8 kg"],
    box: [58, 40, 26], weight: 4.4,
    ship: { us_warehouse: 0, standard: 0, express: 45 },
    supplier: { ...none, note: "Describe it as carbon-fiber TEXTURE. It isn't real carbon fiber, so don't call it that." },
    images: [], reviews: [], badge: "New",
    search: "carbon fiber texture suitcase aluminum frame 20 inch",
  },
  {
    id: "vanity-case", dims: [30, 22, 22], name: "The Vanity Case", size: "Train case", category: "Bags", tier: "Signature",
    price: 185, cost: 48, bulkCost: 24, style: "vanity", material: "Aluminum frame, vegan leather",
    colors: [["Blush", "#d8b4a6"], ["Black", "#1c1c1c"], ["Ivory", "#ece6da"]],
    blurb: "A mirrored train case with brush slots and removable dividers. Clips onto any trolley handle.",
    specs: ["Full-width mirror in lid", "Removable dividers + brush holder", "Trolley sleeve", "Lockable clasps"],
    box: [34, 26, 26], weight: 1.9,
    ship: { us_warehouse: 0, standard: 0, express: 25 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "vanity train case cosmetic case mirror PU leather travel",
  },

  // ───────────── ESSENTIALS ─────────────
  {
    id: "aviator-20", candidates: ["https://www.aliexpress.us/item/3256804918922397.html", "https://www.aliexpress.us/item/3256810161817835.html"], dims: [55, 37, 23], name: "The Aviator Carry-On", size: '20"', category: "Carry-On", tier: "Essentials",
    price: 265, cost: 95, bulkCost: 42, style: "aluminum-frame", material: "Polycarbonate, aluminum frame",
    colors: [["Graphite", "#2b2d31"], ["Champagne", "#cdb79a"], ["Sage", "#8c9a86"], ["Ivory", "#ece6da"]],
    blurb: "Aircraft-grade aluminum frame, zipperless closure, whisper-quiet spinners.",
    specs: ["Polycarbonate shell with aluminum frame", "TSA-approved locks", "360° double spinner wheels", "Fits most airline overhead bins", "39 L · 4.1 kg"],
    box: [58, 40, 26], weight: 4.6,
    ship: { us_warehouse: 0, standard: 0, express: 40 },
    supplier: { ...none, note: "The Mixi aluminum-frame line is a well-reviewed version of this case (about $95–99 with free shipping, praised on Amazon, Reddit and YouTube)." },
    images: [], reviews: [], badge: "Bestseller",
    search: "aluminum frame carry on 20 inch PC suitcase zipperless TSA",
  },
  {
    id: "aviator-26", candidates: ["https://www.aliexpress.us/item/3256808104828324.html"], dims: [69, 47, 28], name: "The Aviator Check-In", size: '26"', category: "Check-In", tier: "Essentials",
    price: 345, cost: 125, bulkCost: 58, style: "aluminum-frame", material: "Polycarbonate, aluminum frame",
    colors: [["Graphite", "#2b2d31"], ["Champagne", "#cdb79a"], ["Ivory", "#ece6da"]],
    blurb: "The same armored frame, sized for two weeks away.",
    specs: ["Polycarbonate shell with aluminum frame", "TSA-approved locks", "Compression straps + divider", "75 L · 5.6 kg"],
    box: [72, 50, 31], weight: 6.3,
    ship: { us_warehouse: 0, standard: 0, express: 65 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "aluminum frame 26 inch check in suitcase PC hardshell",
  },
  {
    id: "riviera-20", candidates: ["https://www.aliexpress.us/item/3256805365297778.html", "https://www.aliexpress.us/item/3256808104828324.html"], dims: [55, 37, 24], name: "The Riviera Front-Access", size: '20"', category: "Carry-On", tier: "Essentials",
    price: 255, cost: 99, bulkCost: 38, style: "front-pocket", material: "Polycarbonate, aluminum frame",
    colors: [["Navy", "#26324a"], ["Taupe", "#a39686"], ["Black", "#1c1c1c"]],
    blurb: "A front laptop pocket that opens in one motion at security.",
    specs: ['Padded front pocket fits 16" laptop', "USB charging port", "Cup holder", "38 L · 3.9 kg"],
    box: [58, 40, 27], weight: 4.4,
    ship: { us_warehouse: 0, standard: 0, express: 40 },
    supplier: { ...none, note: "Mixi front-pocket version: about $95 with free shipping on AliExpress." },
    images: [], reviews: [], badge: "",
    search: "front open laptop pocket carry on suitcase aluminum frame USB",
  },
  {
    id: "lumen-20", dims: [55, 36, 23], name: "The Lumen", size: '20"', category: "Carry-On", tier: "Essentials",
    price: 175, cost: 45, bulkCost: 22, style: "hardshell", material: "Polycarbonate, zip closure",
    colors: [["Sand", "#c8b49a"], ["Mist", "#b8c2c9"], ["Black", "#1c1c1c"], ["Olive", "#6b6f4e"]],
    blurb: "Our lightest case. Expandable zip shell, 2.9 kg, in soft matte colors.",
    specs: ["Matte polycarbonate shell", "Expands +20%", "TSA lock", "Silent spinners", "40–48 L · 2.9 kg"],
    box: [58, 40, 26], weight: 3.4,
    ship: { us_warehouse: 0, standard: 0, express: 40 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "matte PC carry on suitcase expandable lightweight 20 inch",
  },
  {
    id: "commuter-22", dims: [56, 36, 23], name: "The Commuter Softside", size: '22"', category: "Carry-On", tier: "Essentials",
    price: 215, cost: 55, bulkCost: 28, style: "softside", material: "1680D ballistic nylon",
    colors: [["Black", "#1c1c1c"], ["Navy", "#26324a"], ["Charcoal", "#44464b"]],
    blurb: "Ballistic nylon with two front pockets. The case frequent flyers actually pick.",
    specs: ["1680D ballistic nylon", "Two quick-access front pockets", "Expands +2\"", "YKK-style zippers", "42 L · 3.4 kg"],
    box: [60, 40, 26], weight: 3.9,
    ship: { us_warehouse: 0, standard: 0, express: 40 },
    supplier: { ...none, note: "Ask for the nylon denier (1680D or higher) and the zipper brand. Cheap softsides fail at the zippers." },
    images: [], reviews: [], badge: "",
    search: "1680D ballistic nylon softside carry on expandable spinner",
  },
  {
    id: "cabin-16", dims: [40, 30, 20], name: "The Underseater", size: '16"', category: "Carry-On", tier: "Essentials",
    price: 135, cost: 32, bulkCost: 15, style: "underseat", material: "Polycarbonate",
    colors: [["Sand", "#c8b49a"], ["Black", "#1c1c1c"], ["Sage", "#8c9a86"]],
    blurb: "Fits under the seat on budget airlines, so you never pay for overhead bin space.",
    specs: ["Fits 40 × 30 × 20 cm personal-item limits", "Laptop sleeve", "Trolley sleeve", "22 L · 2.1 kg"],
    box: [44, 34, 23], weight: 2.5,
    ship: { us_warehouse: 0, standard: 0, express: 30 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "16 inch underseat carry on suitcase personal item spinner",
  },
  {
    id: "voyage-set", name: "The Voyage Set", size: '20" + 24" + 28"', category: "Sets", tier: "Essentials",
    price: 645, cost: 230, bulkCost: 112, style: "set", material: "Polycarbonate, aluminum frame",
    colors: [["Graphite", "#2b2d31"], ["Champagne", "#cdb79a"], ["Ivory", "#ece6da"]],
    blurb: "Three nesting cases. One quiet, cohesive look at baggage claim.",
    specs: ["Carry-on, medium and large", "Nest inside each other to store", "TSA-approved locks", "Aluminum-frame construction"],
    box: [80, 55, 36], weight: 15.5,
    ship: { us_warehouse: 0, standard: 0, express: 140 },
    supplier: none, images: [], reviews: [], badge: "Best value",
    search: "3 piece luggage set aluminum frame PC 20 24 28",
  },
  {
    id: "weekender", dims: [50, 28, 28], name: "The Weekender", size: "45 L", category: "Bags", tier: "Essentials",
    price: 165, cost: 32, bulkCost: 16, style: "duffel", material: "Water-resistant vegan leather",
    colors: [["Cognac", "#8a5a3b"], ["Black", "#1c1c1c"], ["Sand", "#c8b49a"]],
    blurb: "Vegan leather duffel with a separate shoe compartment.",
    specs: ["Water-resistant vegan leather", "Trolley sleeve", "Shoe compartment", "45 L"],
    box: [50, 30, 12], weight: 1.4,
    ship: { us_warehouse: 0, standard: 0, express: 22 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "PU leather weekender duffel bag shoe compartment trolley sleeve",
  },
  {
    id: "garment-duffel", candidates: ["https://www.aliexpress.us/w/wholesale-convertible-garment-duffel-bag.html"], dims: [52, 30, 26], name: "The Garment Weekender", size: "45 L", category: "Bags", tier: "Essentials",
    price: 225, cost: 45, bulkCost: 24, style: "garment", material: "Vegan leather",
    colors: [["Black", "#1c1c1c"], ["Cognac", "#8a5a3b"]],
    blurb: "Unzips into a hanging suit bag, then folds back into a duffel. Arrive wrinkle-free.",
    specs: ["2-in-1 duffel + hanging garment bag", "Holds 2 suits", "Shoe compartment", "Trolley sleeve"],
    box: [55, 35, 12], weight: 1.8,
    ship: { us_warehouse: 0, standard: 0, express: 25 },
    supplier: { ...none, note: "Modoker sells a well-reviewed version of this bag (buyers report 2+ years of use)." },
    images: [], reviews: [], badge: "",
    search: "convertible garment duffel bag suit carrier leather 2 in 1",
  },
  {
    id: "cubes", name: "Compression Cube Set", size: "6 pc", category: "Accessories", tier: "Essentials",
    price: 45, cost: 8, bulkCost: 3, style: "cubes", material: "Ripstop nylon",
    colors: [["Graphite", "#2b2d31"], ["Sand", "#c8b49a"]],
    blurb: "Pack 30% more. The easiest add-on in the store.",
    specs: ["6 compression cubes", "Ripstop nylon", "Double zippers"],
    box: [30, 22, 8], weight: 0.6,
    ship: { us_warehouse: 0, standard: 0, express: 12 },
    supplier: none, images: [], reviews: [], badge: "",
    search: "compression packing cubes set 6 pieces",
  },
];
