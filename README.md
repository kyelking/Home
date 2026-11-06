# Arden & Vale — luxury-look luggage store

A dropshipping storefront for unbranded, premium-looking luggage sourced from AliExpress, Alibaba or CJ Dropshipping. It's set up for paid ads.

| File | What it is |
|---|---|
| `index.html` | The store. Ads can link straight to a product: `/#aviator-20` or `/?p=aviator-20` |
| `admin.html` | Your private profit, shipping and $100k-a-month planner, supplier search links, and a Shopify CSV export |
| `assets/products.js` | **The only file you need to edit**: products, costs, shipping quotes, supplier links, photos, pixel IDs |

Preview locally: `python3 -m http.server` then open http://localhost:8000.

## Catalog

16 products in two tiers:

- **Signature (luxury):** Monolith alloy 20" and 26", Atelier full-grain leather, Heritage Trunk, Carbon Edition, Vanity Case. $185–$795.
- **Essentials:** Aviator aluminum-frame 20"/26", Riviera front-pocket, Lumen lightweight, Commuter softside, Underseater, Voyage 3-piece set, Weekender, Garment Weekender, packing cubes. $45–$645.

## Unit economics (starting estimates)

| | Dropship (1 per order) | Bulk (200+ into a US warehouse) |
|---|---|---|
| Margin before ads | ~44–68% | ~60–69% |
| Breakeven ROAS | ~1.5–2.3 | ~1.5–1.7 |
| Profit at $100k/mo, 2.5 ROAS | ~$17k | ~$24.5k |

Start with dropshipping to find your winners, then buy those in bulk. Switch between the two in `admin.html`.

## Product photos

Each product page has a swipeable gallery. Until you add photos it shows drawings: front, side, inside, handle and lock, and a dimensions chart (built from `dims`). Add 5–7 real photos per product in `images`, in this order: Front, Back, Side, Inside, Handle & lock, Wheels, Lifestyle. The dimensions chart always stays last. Use supplier photos only with written permission, or better, photos of your own samples.

## Supplier quality

`admin.html` → *Sourcing links* flags any supplier below **4.7★, 500+ sold, 50+ reviews**. Copy each listing's numbers into `supplier` in `products.js`. Order a sample of everything and run it through the **Sample quality checklist** on the same page.

**Reviews:** the store shows a reviews section only when a product has entries in `reviews`. Use real customer reviews only (Judge.me or Loox can collect them automatically after delivery). Copying supplier reviews onto your store as your own breaks FTC rules.

## Launch checklist

1. **Find suppliers.** `admin.html` → *Sourcing links* has pre-filled searches. Look for 4.7★+, 500+ orders, a **US warehouse** option (5-day delivery instead of 2–3 weeks matters a lot for ads and refunds), and real buyer photos.
2. **Order a sample of each product.** Check the wheels, zippers or clasps, smell, and box damage. Cut any product that fails.
3. **Put real numbers in `products.js`:** `cost`, `bulkCost`, `ship`, `supplier` (url, rating, reviews, sold), and `images`.
4. **Photos.** Ask the supplier for their original photos and written permission to use them (most will agree, since you're their reseller). Some listings show another brand's photos, which can get your ads and payments shut down. Shoot a few phone videos of your samples too: unboxing and rolling clips make the best ads.
5. **Payments (recommended: Shopify).** Import the CSV from `admin.html` into Shopify (products come in as drafts), install **DSers** (AliExpress) or **CJ Dropshipping** to send orders to the supplier automatically, then either use a Shopify theme or keep this frontend: set `checkout.mode: "shopify"`, add `shopifyDomain`, and add each product's `shopifyVariant` ID. For a quick single-product test, use `mode: "stripe"` with a Stripe Payment Link per product.
6. **Pixels.** Paste your Meta, TikTok, GA4 and Pinterest IDs into `STORE.pixels`. The store already fires ViewContent, AddToCart and InitiateCheckout. Purchase fires from Shopify or Stripe once those are connected.
7. **Pages.** Add real Shipping, Returns, Privacy and Terms pages, plus a real support email. Ad platforms and Stripe check for these.
8. **Host.** Drag the folder onto Netlify, Vercel or Cloudflare Pages (free), then connect your domain.

## Rules that keep the store alive

- **No branded copies.** Don't sell anything with a Rimowa, Louis Vuitton or Away logo, pattern or name, and don't use "Rimowa-style" style wording in ads. Counterfeits get Stripe, Shopify and ad accounts banned for good, and can lead to lawsuits. The "luxury look" here comes from materials (aluminum frames, vegan leather, muted colors) and from your own brand.
- **No fake reviews or fake "was $599" prices.** The FTC fines both. Add real reviews (Judge.me, Loox) once orders come in.
- **Check duties.** Since 2025 the US charges duty on all imports from China, including small parcels. `dutyPct` defaults to 25%. Confirm the current rate with your supplier or a customs broker, and prefer suppliers who ship from US warehouses with duty already paid.
- **Shipping costs come from box size.** A 20" carry-on box (58×40×26 cm) is billed as about 12 kg even though it weighs 4.6 kg. That's why a US warehouse ($20–30 per case) beats international air shipping ($45–90).
