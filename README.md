# Arden & Vale — luxury-look luggage store

A dropshipping storefront for unbranded, premium-looking luggage sourced from AliExpress, Alibaba or CJ Dropshipping. It's set up for paid ads.

| File | What it is |
|---|---|
| `index.html` | The store. Ads can link straight to a product: `/#p/aviator-20` or `/?p=aviator-20` |
| `admin.html` | Your private profit, shipping and $100k-a-month planner, supplier search links, and a Shopify CSV export |
| `assets/products.js` | **The only file you need to edit**: products, costs, shipping quotes, supplier links, photos, pixel IDs |

Preview locally: `python3 -m http.server` then open http://localhost:8000.

## Unit economics (starting estimates)

At the default settings (US-warehouse shipping, 25% duty, 4% returns, card fees), every case keeps **57–60% margin before ads**. Break-even ROAS is about **1.7**: if every $1 of ads brings back more than $1.70 in sales, you make money.

At **$100k/month** you need about 305 orders/month (11/day), roughly $40k in ad spend at 2.5 ROAS, and you keep **about $19.7k profit**. Change any number live in `admin.html`.

## Launch checklist

1. **Find suppliers.** `admin.html` → *Sourcing links* has pre-filled searches. Look for 4.7★+, 500+ orders, a **US warehouse** option (5-day delivery instead of 2–3 weeks matters a lot for ads and refunds), and real buyer photos.
2. **Order a sample of each product.** Check the wheels, zippers or clasps, smell, and box damage. Cut any product that fails.
3. **Put real numbers in `products.js`:** `cost`, `ship` (from the listing's shipping dropdown for the US), `supplierUrl`, and `images`.
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
