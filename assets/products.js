/*
 * CATALOG + SHIPPING CONFIG — the one file you edit.
 *
 * For each product:
 *   supplierUrl  paste the AliExpress / Alibaba / CJ listing you buy from
 *   images       paste image URLs (ask the supplier for the original photos, or
 *                upload your own to Shopify/Cloudinary). Empty = the built-in
 *                illustration is shown instead.
 *   cost         what you pay the supplier per unit (USD)
 *   ship         supplier shipping quote per unit for each method (USD).
 *                Get real numbers from the listing's shipping dropdown for your
 *                country. The numbers below are starting estimates.
 *   box          shipping box in cm [L, W, H] and real weight in kg. Used to
 *                estimate shipping when you have no quote (luggage is bulky,
 *                so the box size usually costs more than the weight).
 */

window.STORE = {
  name: "ARDEN & VALE",
  tagline: "Quiet luxury for loud itineraries.",
  currency: "USD",
  freeShippingOver: 200,      // orders above this ship free
  flatShipping: 19,           // otherwise charge this
  bundleDiscount: 0.15,       // 15% off when 2+ cases are in the cart
  supportEmail: "concierge@ardenvale.com",

  // Ad pixels: paste your IDs to turn them on. Leave "" to switch off.
  pixels: { meta: "", tiktok: "", ga4: "", pinterest: "" },

  // Checkout: "shopify" sends shoppers to your Shopify cart (recommended),
  // "stripe" uses each product's stripeLink, "demo" just shows a summary.
  checkout: { mode: "demo", shopifyDomain: "" /* e.g. ardenvale.myshopify.com */ },

  // Cost assumptions for the profit calculator (admin.html).
  costs: {
    paymentPct: 0.029, paymentFixed: 0.30,   // Stripe / Shopify Payments
    dutyPct: 0.25,       // US import duty + tariffs on China luggage. CHECK THIS: rates change often.
    returnsPct: 0.04,    // share of revenue lost to returns / damage
    appsPerOrder: 1.0,   // Shopify apps, DSers, email etc. per order
  },

  // Fallback shipping estimate when a product has no quote.
  // Carriers charge the larger of real weight and volume weight (L*W*H/5000).
  shippingMethods: {
    us_warehouse: { label: "US warehouse (3–6 days)", perKg: 1.9, base: 6, days: [3, 6] },
    standard:     { label: "AliExpress Standard (8–15 days)", perKg: 4.2, base: 4, days: [8, 15] },
    express:      { label: "Express DHL/FedEx (4–8 days)", perKg: 7.5, base: 10, days: [4, 8] },
  },
  defaultMethod: "us_warehouse",
};

window.PRODUCTS = [
  {
    id: "aviator-20", name: "The Aviator Carry-On", size: '20"', category: "Carry-On",
    price: 245, cost: 42, style: "aluminum-frame",
    colors: [["Graphite", "#2b2d31"], ["Champagne", "#cdb79a"], ["Sage", "#8c9a86"], ["Ivory", "#ece6da"]],
    blurb: "Aircraft-grade aluminum frame, zipperless closure, whisper-quiet Hinomoto-style spinners.",
    specs: ["Polycarbonate shell with aluminum frame", "TSA-approved locks", "360° double spinner wheels", "Fits most airline overhead bins", "39 L · 4.1 kg"],
    box: [58, 40, 26], weight: 4.6,
    ship: { us_warehouse: 24, standard: 48, express: 86 },
    supplierUrl: "", images: [], stripeLink: "", badge: "Bestseller",
    search: "aluminum frame carry on 20 inch PC suitcase zipperless TSA",
  },
  {
    id: "aviator-26", name: "The Aviator Check-In", size: '26"', category: "Check-In",
    price: 325, cost: 58, style: "aluminum-frame",
    colors: [["Graphite", "#2b2d31"], ["Champagne", "#cdb79a"], ["Ivory", "#ece6da"]],
    blurb: "The same armored frame, sized for two weeks away.",
    specs: ["Polycarbonate shell with aluminum frame", "TSA-approved locks", "Compression straps + divider", "75 L · 5.6 kg"],
    box: [72, 50, 31], weight: 6.3,
    ship: { us_warehouse: 34, standard: 82, express: 148 },
    supplierUrl: "", images: [], stripeLink: "", badge: "",
    search: "aluminum frame 26 inch check in suitcase PC hardshell",
  },
  {
    id: "monolith-20", name: "The Monolith", size: '20"', category: "Carry-On",
    price: 395, cost: 78, style: "all-aluminum",
    colors: [["Silver", "#c9ccd1"], ["Obsidian", "#1d1e21"], ["Rose Gold", "#c9a092"]],
    blurb: "Solid aluminum-magnesium alloy. Gets better with every scuff.",
    specs: ["Aluminum-magnesium alloy body", "Leather-wrapped top handle", "Dual TSA locks", "36 L · 4.4 kg"],
    box: [58, 41, 27], weight: 5.1,
    ship: { us_warehouse: 26, standard: 52, express: 92 },
    supplierUrl: "", images: [], stripeLink: "", badge: "Signature",
    search: "full aluminum magnesium alloy carry on suitcase 20 inch",
  },
  {
    id: "riviera-20", name: "The Riviera Front-Access", size: '20"', category: "Carry-On",
    price: 225, cost: 38, style: "front-pocket",
    colors: [["Navy", "#26324a"], ["Taupe", "#a39686"], ["Black", "#1c1c1c"]],
    blurb: "A front laptop pocket that opens in a single motion at security.",
    specs: ['Padded front pocket fits 16" laptop', "USB charging port", "Cup holder", "38 L · 3.9 kg"],
    box: [58, 40, 27], weight: 4.4,
    ship: { us_warehouse: 24, standard: 48, express: 86 },
    supplierUrl: "", images: [], stripeLink: "", badge: "New",
    search: "front open laptop pocket carry on suitcase aluminum frame USB",
  },
  {
    id: "heritage-trunk", name: "The Heritage Trunk", size: '24"', category: "Check-In",
    price: 345, cost: 65, style: "trunk",
    colors: [["Cognac", "#8a5a3b"], ["Forest", "#2f4436"], ["Black", "#1c1c1c"]],
    blurb: "A deep trunk silhouette with vegan-leather corner guards and straps.",
    specs: ["Deep trunk profile", "Vegan leather straps + corners", "Aluminum frame", "80 L · 5.9 kg"],
    box: [66, 46, 36], weight: 6.6,
    ship: { us_warehouse: 32, standard: 76, express: 138 },
    supplierUrl: "", images: [], stripeLink: "", badge: "",
    search: "trunk suitcase aluminum frame leather strap retro 24 inch",
  },
  {
    id: "voyage-set", name: "The Voyage Set", size: '20" + 24" + 28"', category: "Sets",
    price: 595, cost: 112, style: "set",
    colors: [["Graphite", "#2b2d31"], ["Champagne", "#cdb79a"], ["Ivory", "#ece6da"]],
    blurb: "Three nesting cases. One quiet, cohesive look at baggage claim.",
    specs: ["Carry-on, medium and large", "Nest inside each other to store", "TSA-approved locks", "Aluminum-frame construction"],
    box: [80, 55, 36], weight: 15.5,
    ship: { us_warehouse: 58, standard: 140, express: 240 },
    supplierUrl: "", images: [], stripeLink: "", badge: "Best value",
    search: "3 piece luggage set aluminum frame PC 20 24 28",
  },
  {
    id: "weekender", name: "The Weekender", size: "45 L", category: "Bags",
    price: 165, cost: 22, style: "duffel",
    colors: [["Cognac", "#8a5a3b"], ["Black", "#1c1c1c"], ["Sand", "#c8b49a"]],
    blurb: "Vegan leather duffel with a separate shoe compartment.",
    specs: ["Water-resistant vegan leather", "Trolley sleeve", "Shoe compartment", "45 L"],
    box: [50, 30, 12], weight: 1.4,
    ship: { us_warehouse: 9, standard: 15, express: 32 },
    supplierUrl: "", images: [], stripeLink: "", badge: "",
    search: "PU leather weekender duffel bag shoe compartment trolley sleeve",
  },
  {
    id: "cubes", name: "Compression Cube Set", size: "6 pc", category: "Accessories",
    price: 45, cost: 6, style: "cubes",
    colors: [["Graphite", "#2b2d31"], ["Sand", "#c8b49a"]],
    blurb: "Pack 30% more. The easiest add-on in the store.",
    specs: ["6 compression cubes", "Ripstop nylon", "Double zippers"],
    box: [30, 22, 8], weight: 0.6,
    ship: { us_warehouse: 5, standard: 6, express: 16 },
    supplierUrl: "", images: [], stripeLink: "", badge: "",
    search: "compression packing cubes set 6 pieces",
  },
];
