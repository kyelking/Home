/* Shared math + product art used by the store and the admin page. */
(function () {
  const S = window.STORE;

  // Shipping cost for one unit: supplier quote if present, otherwise estimate
  // from the larger of real weight and volume weight.
  function shipCost(p, method) {
    method = method || S.defaultMethod;
    if (p.ship && p.ship[method] != null) return { cost: p.ship[method], source: "quote" };
    const m = S.shippingMethods[method];
    const [l, w, h] = p.box;
    const kg = Math.max(p.weight, (l * w * h) / 5000);
    return { cost: +(m.base + kg * m.perKg).toFixed(2), source: "estimate", kg };
  }

  function volumeKg(p) { const [l, w, h] = p.box; return (l * w * h) / 5000; }

  // Everything it costs you to fulfil one order of this product at a given price.
  // mode "dropship": pay the AliExpress unit price per order (+ any shipping quote).
  // mode "bulk": pay the Alibaba factory price, then US domestic shipping from your warehouse.
  function unitEconomics(p, method, price, mode) {
    price = price ?? p.price;
    mode = mode || S.sourcingMode;
    const c = S.costs;
    const bulk = mode === "bulk";
    const cost = bulk ? p.bulkCost : p.cost;
    const ship = bulk ? shipCost({ ...p, ship: null }, "us_warehouse").cost : shipCost(p, method).cost;
    const duty = cost * c.dutyPct;
    const pay = price * c.paymentPct + c.paymentFixed;
    const returns = price * c.returnsPct;
    const landed = cost + ship + duty + pay + returns + c.appsPerOrder;
    const profit = price - landed;
    const margin = profit / price;
    // ROAS (ad revenue / ad spend) where you break even after ad costs.
    const breakevenRoas = profit > 0 ? price / profit : Infinity;
    return { price, cost, ship, duty, pay, returns, apps: c.appsPerOrder, landed, profit, margin, breakevenRoas, maxCpa: profit };
  }

  // Does this supplier meet the quality bar? Returns { ok, reasons }.
  function supplierCheck(p) {
    const s = p.supplier || {}, r = S.supplierRules, reasons = [];
    if (!s.url) return { ok: false, unknown: true, reasons: ["No supplier chosen yet"] };
    if (s.rating == null) reasons.push("Rating not recorded");
    else if (s.rating < r.minRating) reasons.push(`Rating ${s.rating} < ${r.minRating}`);
    if (s.sold != null && s.sold < r.minSold) reasons.push(`Only ${s.sold} sold`);
    if (s.reviews != null && s.reviews < r.minReviews) reasons.push(`Only ${s.reviews} reviews`);
    return { ok: reasons.length === 0, reasons };
  }

  // Customer-facing shipping charge for a cart subtotal.
  function customerShipping(subtotal) {
    return subtotal >= S.freeShippingOver || subtotal === 0 ? 0 : S.flatShipping;
  }

  const money = (n, d = 0) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  // Built-in product illustrations (used until you add real photos).
  let uid = 0;
  function art(p, color, viewBox) {
    color = color || p.colors[0][1];
    const gid = p.id + "-" + (++uid);
    const dark = shade(color, -28), light = shade(color, 22), metal = "#b9bcc2";
    const wheels = (x1, x2, y) => `<g fill="#222"><rect x="${x1 - 7}" y="${y}" width="14" height="16" rx="5"/><rect x="${x2 - 7}" y="${y}" width="14" height="16" rx="5"/></g>`;
    const handle = (cx, top) => `<g stroke="${metal}" stroke-width="5" fill="none" stroke-linecap="round"><path d="M${cx - 22} ${top + 6} V${top - 58} H${cx + 22} V${top + 6}"/></g>`;
    const shell = (x, y, w, h, ribs) => {
      let r = "";
      for (let i = 1; i <= ribs; i++) { const rx = x + (w / (ribs + 1)) * i; r += `<line x1="${rx}" y1="${y + 14}" x2="${rx}" y2="${y + h - 14}" stroke="${dark}" stroke-width="2" opacity=".35"/>`; }
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#g${gid})"/>${r}`;
    };
    const defs = `<defs><linearGradient id="g${gid}" x1="0" x2="1"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>`;
    let body = "";
    switch (p.style) {
      case "aluminum-frame":
      case "front-pocket":
        body = handle(150, 70) + shell(95, 70, 110, 170, 3) +
          `<rect x="95" y="148" width="110" height="9" fill="${metal}"/><rect x="134" y="140" width="32" height="24" rx="3" fill="#2a2a2a"/>` +
          (p.style === "front-pocket" ? `<rect x="108" y="90" width="84" height="48" rx="8" fill="none" stroke="${dark}" stroke-width="2.5"/>` : "") +
          wheels(110, 190, 238);
        break;
      case "all-aluminum":
        body = handle(150, 70) + `<rect x="95" y="70" width="110" height="170" rx="12" fill="url(#g${gid})"/>` +
          Array.from({ length: 6 }, (_, i) => `<line x1="${102 + i * 19.5}" y1="80" x2="${102 + i * 19.5}" y2="230" stroke="${dark}" stroke-width="3" opacity=".3"/>`).join("") +
          `<rect x="128" y="52" width="44" height="12" rx="6" fill="#5a3b28"/><rect x="95" y="150" width="110" height="6" fill="${dark}" opacity=".6"/>` + wheels(110, 190, 238);
        break;
      case "trunk":
        body = handle(150, 80) + shell(85, 80, 130, 160, 0) +
          `<g fill="#5a3b28"><rect x="110" y="80" width="12" height="160"/><rect x="178" y="80" width="12" height="160"/>` +
          `<path d="M85 98 a18 18 0 0 1 18 -18 h12 v14 h-16 v16 h-14z"/><path d="M215 98 a18 18 0 0 0 -18 -18 h-12 v14 h16 v16 h14z"/></g>` +
          `<g fill="#c7a96b"><rect x="108" y="150" width="16" height="12" rx="2"/><rect x="176" y="150" width="16" height="12" rx="2"/></g>` + wheels(100, 200, 238);
        break;
      case "set":
        body = [[60, 110, 70, 120], [125, 90, 80, 145], [195, 70, 90, 170]].map(([x, y, w, h]) =>
          `<g stroke="${metal}" stroke-width="4" fill="none"><path d="M${x + w / 2 - 14} ${y + 4} V${y - 34} H${x + w / 2 + 14} V${y + 4}"/></g>` +
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#g${gid})"/><rect x="${x}" y="${y + h / 2 - 4}" width="${w}" height="7" fill="${metal}"/>` +
          `<g fill="#222"><rect x="${x + 8}" y="${y + h - 2}" width="11" height="12" rx="4"/><rect x="${x + w - 19}" y="${y + h - 2}" width="11" height="12" rx="4"/></g>`).join("");
        break;
      case "duffel":
        body = `<path d="M110 140 q40 -70 80 0" stroke="${dark}" stroke-width="9" fill="none"/>` +
          `<rect x="55" y="130" width="190" height="100" rx="46" fill="url(#g${gid})"/>` +
          `<path d="M80 140 h140" stroke="#c7a96b" stroke-width="3" stroke-dasharray="6 5"/><rect x="215" y="160" width="22" height="44" rx="8" fill="${dark}"/>`;
        break;
      case "hardshell":
        body = handle(150, 70) + shell(95, 70, 110, 170, 0) +
          Array.from({ length: 4 }, (_, i) => `<path d="M${103 + i * 2} ${95 + i * 30} q47 -14 94 0" stroke="${dark}" stroke-width="2" fill="none" opacity=".3"/>`).join("") +
          `<line x1="95" y1="155" x2="205" y2="155" stroke="${dark}" stroke-width="2" stroke-dasharray="3 3"/>` + wheels(110, 190, 238);
        break;
      case "softside":
        body = handle(150, 72) + `<rect x="92" y="72" width="116" height="168" rx="22" fill="url(#g${gid})"/>` +
          `<rect x="104" y="92" width="92" height="56" rx="10" fill="none" stroke="${light}" stroke-width="2.5" opacity=".6"/>` +
          `<rect x="104" y="158" width="92" height="66" rx="10" fill="none" stroke="${light}" stroke-width="2.5" opacity=".6"/>` +
          `<g fill="${metal}"><rect x="186" y="96" width="5" height="12" rx="2"/><rect x="186" y="162" width="5" height="12" rx="2"/></g>` + wheels(110, 190, 238);
        break;
      case "underseat":
        body = handle(150, 120) + shell(98, 120, 104, 118, 2) + `<rect x="98" y="175" width="104" height="6" fill="${dark}" opacity=".5"/>` + wheels(112, 188, 236);
        break;
      case "carbon":
        body = handle(150, 70) + shell(95, 70, 110, 170, 0) +
          `<defs><pattern id="w${gid}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="10" fill="#fff" opacity=".07"/></pattern></defs>` +
          `<rect x="95" y="70" width="110" height="170" rx="18" fill="url(#w${gid})"/>` +
          `<rect x="95" y="148" width="110" height="9" fill="${metal}"/><rect x="134" y="140" width="32" height="24" rx="3" fill="#111"/>` + wheels(110, 190, 238);
        break;
      case "leather":
        body = handle(150, 70) + `<rect x="95" y="70" width="110" height="170" rx="10" fill="url(#g${gid})"/>` +
          `<rect x="101" y="76" width="98" height="158" rx="7" fill="none" stroke="#e2c99e" stroke-width="1.5" stroke-dasharray="4 3" opacity=".8"/>` +
          `<g fill="#3a2418"><rect x="118" y="70" width="11" height="170"/><rect x="171" y="70" width="11" height="170"/></g>` +
          `<g fill="#c7a96b"><rect x="116" y="146" width="15" height="11" rx="2"/><rect x="169" y="146" width="15" height="11" rx="2"/></g>` + wheels(110, 190, 238);
        break;
      case "vanity":
        body = `<path d="M125 112 q25 -34 50 0" stroke="${dark}" stroke-width="8" fill="none"/>` +
          `<rect x="85" y="110" width="130" height="120" rx="14" fill="url(#g${gid})"/><rect x="85" y="140" width="130" height="5" fill="#c7a96b"/>` +
          `<g fill="#c7a96b"><rect x="110" y="133" width="14" height="18" rx="2"/><rect x="176" y="133" width="14" height="18" rx="2"/></g>`;
        break;
      case "garment":
        body = `<path d="M150 70 v22" stroke="${metal}" stroke-width="4"/><path d="M138 70 a12 12 0 1 1 12 0" stroke="${metal}" stroke-width="4" fill="none"/>` +
          `<path d="M110 140 q40 -60 80 0" stroke="${dark}" stroke-width="8" fill="none"/>` +
          `<rect x="60" y="120" width="180" height="110" rx="40" fill="url(#g${gid})"/>` +
          `<path d="M150 125 v100" stroke="${dark}" stroke-width="2" opacity=".5"/><path d="M82 135 h136" stroke="#c7a96b" stroke-width="3" stroke-dasharray="6 5"/>`;
        break;
      default:
        body = [[70, 150, 90, 70], [150, 130, 90, 90], [110, 95, 80, 50]].map(([x, y, w, h], i) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${i % 2 ? color : light}" stroke="${dark}" stroke-width="2"/><path d="M${x + 10} ${y + 10} h${w - 20}" stroke="${dark}" stroke-width="2"/>`).join("");
    }
    return `<svg viewBox="${viewBox || "0 0 300 280"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">${defs}<ellipse cx="150" cy="258" rx="110" ry="9" fill="#000" opacity=".08"/>${body}</svg>`;
  }

  const CASES = ["aluminum-frame", "front-pocket", "all-aluminum", "trunk", "hardshell", "softside", "underseat", "carbon", "leather"];

  // Side profile of a case.
  function artSide(p, color) {
    const dark = shade(color, -28), metal = "#b9bcc2";
    const [h, , d] = p.dims || [55, 37, 23];
    const H = 170 * Math.min(1, h / 55), D = Math.max(46, 170 * (d / 55)), x = 150 - D / 2, y = 240 - H;
    return `<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name} side view">
      <ellipse cx="150" cy="258" rx="80" ry="8" fill="#000" opacity=".08"/>
      <path d="M${x + D - 8} ${y} V${y - 58} h-6 V${y}" fill="${metal}"/>
      <rect x="${x}" y="${y}" width="${D}" height="${H}" rx="16" fill="${color}"/>
      <rect x="${x + D / 2 - 3}" y="${y}" width="6" height="${H}" fill="${p.style === "softside" ? dark : metal}"/>
      <rect x="${x + 10}" y="${y + H / 2 - 18}" width="10" height="36" rx="4" fill="${dark}"/>
      <g fill="#222"><rect x="${x + 4}" y="238" width="13" height="16" rx="5"/><rect x="${x + D - 17}" y="238" width="13" height="16" rx="5"/></g></svg>`;
  }

  // Case opened flat: lining, straps, divider.
  function artInterior(p, color) {
    const dark = shade(color, -30), lining = shade(color, 38), metal = "#b9bcc2";
    const half = (x, divider) => `<rect x="${x}" y="70" width="120" height="170" rx="14" fill="${color}"/>
      <rect x="${x + 7}" y="77" width="106" height="156" rx="9" fill="${lining}"/>
      ${divider ? `<rect x="${x + 7}" y="77" width="106" height="156" rx="9" fill="none" stroke="${dark}" stroke-width="1.5" stroke-dasharray="3 3" opacity=".5"/><rect x="${x + 20}" y="92" width="80" height="30" rx="4" fill="${shade(color, 28)}" stroke="${dark}" stroke-width="1" opacity=".9"/>`
        : `<path d="M${x + 7} 130 h106 M${x + 7} 185 h106" stroke="${dark}" stroke-width="5" opacity=".6"/><path d="M${x + 7} 155 l53 -18 l53 18" stroke="${dark}" stroke-width="5" fill="none" opacity=".6"/><rect x="${x + 52}" y="${150}" width="16" height="10" rx="2" fill="${metal}"/>`}`;
    return `<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name} interior">
      <ellipse cx="150" cy="258" rx="130" ry="8" fill="#000" opacity=".08"/>${half(24, false)}${half(156, true)}
      <rect x="144" y="74" width="12" height="162" rx="3" fill="${metal}"/></svg>`;
  }

  // Dimensions diagram from p.dims [height, width, depth] in cm.
  function artDims(p, color) {
    const [h, w, d] = p.dims, s = 175 / Math.max(h, w + d * 0.5), H = h * s, W = w * s, D = d * s * 0.5;
    const x = 150 - (W + D) / 2, y = 30 + (175 - H) / 2;
    const ink = "#77716a", inch = (cm) => (cm / 2.54).toFixed(1);
    return `<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name} dimensions" font-family="Inter, sans-serif" font-size="11" fill="${ink}">
      <path d="M${x} ${y + D} l${D} ${-D} h${W} v${H} l${-D} ${D} z" fill="${shade(color, 30)}" opacity=".35"/>
      <rect x="${x}" y="${y + D}" width="${W}" height="${H}" rx="6" fill="${shade(color, 40)}" stroke="${shade(color, -20)}" stroke-width="2"/>
      <path d="M${x} ${y + D} l${D} ${-D} h${W} l${-D} ${D} M${x + W + D} ${y} v${H} l${-D} ${D}" fill="none" stroke="${shade(color, -20)}" stroke-width="2"/>
      <path d="M${x - 12} ${y + D} v${H}" stroke="${ink}"/><text x="${x - 18}" y="${y + D + H / 2}" text-anchor="end">${h} cm</text><text x="${x - 18}" y="${y + D + H / 2 + 14}" text-anchor="end">${inch(h)}"</text>
      <path d="M${x} ${y + D + H + 14} h${W}" stroke="${ink}"/><text x="${x + W / 2}" y="${y + D + H + 30}" text-anchor="middle">${w} cm · ${inch(w)}"</text>
      <path d="M${x + W + 8} ${y + D + H + 4} l${D} ${-D}" stroke="${ink}"/><text x="${x + W + D + 10}" y="${y + D + H - D / 2 + 6}">${d} cm · ${inch(d)}"</text></svg>`;
  }

  // Every gallery view for a product. Real photos (p.images) come first; drawings fill the rest.
  function views(p, color) {
    color = color || p.colors[0][1];
    const photos = (p.images || []).map((im) => typeof im === "string" ? { src: im, label: "Photo" } : im)
      .map((im) => ({ label: im.label || "Photo", html: `<img src="${im.src}" alt="${p.name} ${im.label || ""}" loading="lazy" />` }));
    const v = [{ label: "Front", html: art(p, color) }];
    if (CASES.includes(p.style)) {
      v.push({ label: "Side", html: artSide(p, color) });
      v.push({ label: "Inside", html: artInterior(p, color) });
      v.push({ label: "Handle & lock", html: art(p, color, "75 0 150 150") });
    } else {
      v.push({ label: "Detail", html: art(p, color, "60 60 180 170") });
    }
    if (p.dims) v.push({ label: "Dimensions", html: artDims(p, color) });
    return photos.length ? photos.concat(v.filter((x) => x.label === "Dimensions")) : v;
  }

  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + (pct / 100) * 255)));
    return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((c) => c.toString(16).padStart(2, "0")).join("");
  }

  window.Core = { views, shipCost, volumeKg, unitEconomics, supplierCheck, customerShipping, money, art };
})();
