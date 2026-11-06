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
  function unitEconomics(p, method, price) {
    price = price ?? p.price;
    const c = S.costs;
    const ship = shipCost(p, method).cost;
    const duty = (p.cost + ship) * c.dutyPct;
    const pay = price * c.paymentPct + c.paymentFixed;
    const returns = price * c.returnsPct;
    const landed = p.cost + ship + duty + pay + returns + c.appsPerOrder;
    const profit = price - landed;
    const margin = profit / price;
    // ROAS (ad revenue / ad spend) where you break even after ad costs.
    const breakevenRoas = profit > 0 ? price / profit : Infinity;
    return { price, cost: p.cost, ship, duty, pay, returns, apps: c.appsPerOrder, landed, profit, margin, breakevenRoas, maxCpa: profit };
  }

  // Customer-facing shipping charge for a cart subtotal.
  function customerShipping(subtotal) {
    return subtotal >= S.freeShippingOver || subtotal === 0 ? 0 : S.flatShipping;
  }

  const money = (n, d = 0) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  // Built-in product illustrations (used until you add real photos).
  function art(p, color) {
    color = color || p.colors[0][1];
    const dark = shade(color, -28), light = shade(color, 22), metal = "#b9bcc2";
    const wheels = (x1, x2, y) => `<g fill="#222"><rect x="${x1 - 7}" y="${y}" width="14" height="16" rx="5"/><rect x="${x2 - 7}" y="${y}" width="14" height="16" rx="5"/></g>`;
    const handle = (cx, top) => `<g stroke="${metal}" stroke-width="5" fill="none" stroke-linecap="round"><path d="M${cx - 22} ${top + 6} V${top - 58} H${cx + 22} V${top + 6}"/></g>`;
    const shell = (x, y, w, h, ribs) => {
      let r = "";
      for (let i = 1; i <= ribs; i++) { const rx = x + (w / (ribs + 1)) * i; r += `<line x1="${rx}" y1="${y + 14}" x2="${rx}" y2="${y + h - 14}" stroke="${dark}" stroke-width="2" opacity=".35"/>`; }
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#g${p.id})"/>${r}`;
    };
    const defs = `<defs><linearGradient id="g${p.id}" x1="0" x2="1"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>`;
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
        body = handle(150, 70) + `<rect x="95" y="70" width="110" height="170" rx="12" fill="url(#g${p.id})"/>` +
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
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#g${p.id})"/><rect x="${x}" y="${y + h / 2 - 4}" width="${w}" height="7" fill="${metal}"/>` +
          `<g fill="#222"><rect x="${x + 8}" y="${y + h - 2}" width="11" height="12" rx="4"/><rect x="${x + w - 19}" y="${y + h - 2}" width="11" height="12" rx="4"/></g>`).join("");
        break;
      case "duffel":
        body = `<path d="M110 140 q40 -70 80 0" stroke="${dark}" stroke-width="9" fill="none"/>` +
          `<rect x="55" y="130" width="190" height="100" rx="46" fill="url(#g${p.id})"/>` +
          `<path d="M80 140 h140" stroke="#c7a96b" stroke-width="3" stroke-dasharray="6 5"/><rect x="215" y="160" width="22" height="44" rx="8" fill="${dark}"/>`;
        break;
      default:
        body = [[70, 150, 90, 70], [150, 130, 90, 90], [110, 95, 80, 50]].map(([x, y, w, h], i) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${i % 2 ? color : light}" stroke="${dark}" stroke-width="2"/><path d="M${x + 10} ${y + 10} h${w - 20}" stroke="${dark}" stroke-width="2"/>`).join("");
    }
    return `<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">${defs}<ellipse cx="150" cy="258" rx="110" ry="9" fill="#000" opacity=".08"/>${body}</svg>`;
  }

  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + (pct / 100) * 255)));
    return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((c) => c.toString(16).padStart(2, "0")).join("");
  }

  window.Core = { shipCost, volumeKg, unitEconomics, customerShipping, money, art };
})();
