/* Storefront: grid, product page, cart, shipping estimate, checkout. */
(function () {
  const S = window.STORE, P = window.PRODUCTS, { money, art, customerShipping } = window.Core;
  const $ = (s, el = document) => el.querySelector(s);
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  let filter = "All";

  // ---------- cart state ----------
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("av_cart") || "[]").filter((l) => byId[l.id]); } catch (e) {}
  const save = () => { try { localStorage.setItem("av_cart", JSON.stringify(cart)); } catch (e) {} renderCartCount(); };

  function totals() {
    const subtotal = cart.reduce((s, l) => s + byId[l.id].price * l.qty, 0);
    const cases = cart.filter((l) => !["Accessories"].includes(byId[l.id].category)).reduce((s, l) => s + l.qty, 0);
    const discount = cases >= 2 ? Math.round(subtotal * S.bundleDiscount) : 0;
    const shipping = customerShipping(subtotal - discount);
    return { subtotal, discount, shipping, total: subtotal - discount + shipping, cases };
  }

  // ---------- helpers ----------
  const img = (p, color, cls = "") =>
    p.images && p.images.length
      ? `<img class="${cls}" src="${p.images[0]}" alt="${p.name}" loading="lazy" />`
      : `<div class="art ${cls}">${art(p, color)}</div>`;

  function deliveryWindow() {
    const m = S.shippingMethods[S.defaultMethod];
    const add = (d) => { const x = new Date(); let n = 0; while (n < d) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) n++; } return x; };
    const f = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${f(add(m.days[0] + 1))} – ${f(add(m.days[1] + 1))}`;
  }

  // ---------- page chrome ----------
  $("#logo").textContent = $("#footLogo").textContent = S.name;
  $("#announce").innerHTML = `Free shipping over ${money(S.freeShippingOver)} &nbsp;·&nbsp; ${Math.round(S.bundleDiscount * 100)}% off when you buy 2+ cases`;
  $("#trustShip").textContent = `On orders over ${money(S.freeShippingOver)}`;
  $("#faqShip").textContent = `Orders ship within 1–2 business days. Most US orders arrive ${deliveryWindow()} if ordered today. Orders over ${money(S.freeShippingOver)} ship free; below that shipping is ${money(S.flatShipping)}.`;
  $("#footContact").textContent = S.supportEmail;
  $("#year").textContent = new Date().getFullYear();
  $("#heroArt").innerHTML = art(byId["aviator-20"], "#cdb79a");

  // ---------- grid ----------
  const cats = ["All", ...new Set(P.map((p) => p.category))];
  function renderFilters() {
    $("#filters").innerHTML = cats.map((c) => `<button class="chip ${c === filter ? "on" : ""}" data-cat="${c}">${c}</button>`).join("");
  }
  function renderGrid() {
    const list = P.filter((p) => filter === "All" || p.category === filter);
    $("#grid").innerHTML = list.map((p) => `
      <a class="card" href="#p/${p.id}">
        <div class="card-img">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${img(p)}</div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="muted">${p.size} · ${p.colors.length} colors</p>
          <div class="swatches">${p.colors.map(([n, c]) => `<i style="background:${c}" title="${n}"></i>`).join("")}</div>
          <p class="price">${money(p.price)}</p>
        </div>
      </a>`).join("");
  }
  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cat]");
    if (chip) { filter = chip.dataset.cat; renderFilters(); renderGrid(); }
    const nav = e.target.closest("[data-filter]");
    if (nav) { filter = nav.dataset.filter; renderFilters(); renderGrid(); }
  });

  // ---------- product page ----------
  function openProduct(id) {
    const p = byId[id]; if (!p) return;
    let color = p.colors[0], qty = 1;
    const ov = $("#pdpOverlay");
    const draw = () => {
      $("#pdp").innerHTML = `
        <button class="close" data-close>×</button>
        <div class="pdp-img">${img(p, color[1], "big")}</div>
        <div class="pdp-info">
          <p class="eyebrow">${p.category} · ${p.size}</p>
          <h2>${p.name}</h2>
          <p class="price big">${money(p.price)}</p>
          <p>${p.blurb}</p>
          <p class="label">Color — <b>${color[0]}</b></p>
          <div class="swatches lg">${p.colors.map((c, i) => `<button data-color="${i}" class="${c === color ? "on" : ""}" style="background:${c[1]}" aria-label="${c[0]}"></button>`).join("")}</div>
          <div class="qty-row">
            <div class="qty"><button data-q="-1">−</button><span>${qty}</span><button data-q="1">+</button></div>
            <button class="btn primary wide" data-add>Add to bag — ${money(p.price * qty)}</button>
          </div>
          <div class="ship-box">
            <div><b>Arrives ${deliveryWindow()}</b><span>${p.price >= S.freeShippingOver ? "Free shipping" : `Free over ${money(S.freeShippingOver)}`}</span></div>
            <div><b>30-day returns</b><span>Free on unused items</span></div>
          </div>
          <p class="upsell">Add a second case and save ${Math.round(S.bundleDiscount * 100)}% on your whole order.</p>
          <h4>Details</h4>
          <ul class="specs">${p.specs.map((s) => `<li>${s}</li>`).join("")}</ul>
        </div>`;
      const atc = $("#stickyAtc");
      atc.innerHTML = `<span>${p.name} · ${money(p.price)}</span><button class="btn primary" data-add>Add to bag</button>`;
    };
    draw();
    ov.hidden = false; document.body.classList.add("lock"); $("#stickyAtc").hidden = false;
    Track.event("ViewContent", { value: p.price, ids: [p.id] });

    ov.onclick = (e) => {
      if (e.target === ov || e.target.closest("[data-close]")) return closeProduct();
      const c = e.target.closest("[data-color]"); if (c) { color = p.colors[+c.dataset.color]; draw(); }
      const q = e.target.closest("[data-q]"); if (q) { qty = Math.max(1, qty + +q.dataset.q); draw(); }
      if (e.target.closest("[data-add]")) { addToCart(p, color[0], qty); closeProduct(); openCart(); }
    };
    $("#stickyAtc").onclick = (e) => { if (e.target.closest("[data-add]")) { addToCart(p, color[0], qty); closeProduct(); openCart(); } };
  }
  function closeProduct() {
    $("#pdpOverlay").hidden = true; $("#stickyAtc").hidden = true; document.body.classList.remove("lock");
    if (location.hash.startsWith("#p/")) history.replaceState(null, "", location.pathname + location.search);
  }

  // ---------- cart ----------
  function addToCart(p, color, qty) {
    const line = cart.find((l) => l.id === p.id && l.color === color);
    line ? (line.qty += qty) : cart.push({ id: p.id, color, qty });
    save();
    Track.event("AddToCart", { value: p.price * qty, ids: [p.id] });
  }
  function renderCartCount() { $("#cartCount").textContent = cart.reduce((s, l) => s + l.qty, 0); }

  function renderCart() {
    const t = totals();
    const toFree = S.freeShippingOver - (t.subtotal - t.discount);
    const pct = Math.min(100, ((t.subtotal - t.discount) / S.freeShippingOver) * 100);
    const addOn = byId["cubes"];
    $("#cart").innerHTML = `
      <div class="cart-head"><h3>Your bag</h3><button class="close" data-close>×</button></div>
      ${cart.length ? `
        <div class="progress"><p>${toFree > 0 ? `You're ${money(toFree)} away from free shipping` : "You've unlocked free shipping"}</p><div><i style="width:${pct}%"></i></div></div>
        <div class="lines">${cart.map((l, i) => { const p = byId[l.id]; const c = p.colors.find((x) => x[0] === l.color) || p.colors[0]; return `
          <div class="line">
            <div class="thumb">${img(p, c[1])}</div>
            <div class="line-info"><b>${p.name}</b><span class="muted">${p.size} · ${l.color}</span>
              <div class="qty sm"><button data-lq="${i}" data-d="-1">−</button><span>${l.qty}</span><button data-lq="${i}" data-d="1">+</button></div></div>
            <div class="line-price">${money(p.price * l.qty)}<button class="link" data-rm="${i}">Remove</button></div>
          </div>`; }).join("")}</div>
        ${addOn && !cart.some((l) => l.id === addOn.id) ? `<div class="addon"><div class="thumb">${img(addOn)}</div><div><b>${addOn.name}</b><span class="muted">Pack 30% more</span></div><button class="btn ghost sm" data-addon>+ ${money(addOn.price)}</button></div>` : ""}
        <div class="sums">
          <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          ${t.discount ? `<div class="save"><span>Multi-case savings</span><span>−${money(t.discount)}</span></div>` : t.cases === 1 ? `<div class="hint">Add one more case to save ${Math.round(S.bundleDiscount * 100)}%</div>` : ""}
          <div><span>Shipping</span><span>${t.shipping ? money(t.shipping) : "Free"}</span></div>
          <div class="total"><span>Total</span><span>${money(t.total)}</span></div>
        </div>
        <button class="btn primary wide" data-checkout>Checkout</button>
        <p class="small center">Arrives ${deliveryWindow()} · 30-day returns</p>`
      : `<p class="empty">Your bag is empty.</p><a href="#shop" class="btn ghost wide" data-close>Shop luggage</a>`}`;
  }
  function openCart() { renderCart(); $("#cartOverlay").hidden = false; document.body.classList.add("lock"); }
  function closeCart() { $("#cartOverlay").hidden = true; document.body.classList.remove("lock"); }

  $("#cartBtn").onclick = openCart;
  $("#cartOverlay").onclick = (e) => {
    const ov = $("#cartOverlay");
    if (e.target === ov || e.target.closest("[data-close]")) return closeCart();
    const q = e.target.closest("[data-lq]");
    if (q) { const l = cart[+q.dataset.lq]; l.qty += +q.dataset.d; if (l.qty < 1) cart.splice(+q.dataset.lq, 1); save(); renderCart(); }
    const rm = e.target.closest("[data-rm]"); if (rm) { cart.splice(+rm.dataset.rm, 1); save(); renderCart(); }
    if (e.target.closest("[data-addon]")) { const a = byId["cubes"]; addToCart(a, a.colors[0][0], 1); renderCart(); }
    if (e.target.closest("[data-checkout]")) checkout();
  };

  function checkout() {
    const t = totals();
    Track.event("InitiateCheckout", { value: t.total, ids: cart.map((l) => l.id) });
    const mode = S.checkout.mode;
    if (mode === "shopify" && S.checkout.shopifyDomain) {
      // Needs each product's Shopify variant id in p.shopifyVariant (see README).
      const items = cart.filter((l) => byId[l.id].shopifyVariant).map((l) => `${byId[l.id].shopifyVariant}:${l.qty}`).join(",");
      location.href = `https://${S.checkout.shopifyDomain}/cart/${items}`;
      return;
    }
    if (mode === "stripe" && cart.length === 1 && byId[cart[0].id].stripeLink) {
      location.href = byId[cart[0].id].stripeLink; return;
    }
    $("#cart").insertAdjacentHTML("beforeend", `<div class="notice">Demo mode: payments aren't connected yet. Order total would be <b>${money(t.total)}</b>. See README to connect Shopify or Stripe.</div>`);
  }

  // ---------- routing (lets ads link straight to a product: /#p/aviator-20 or ?p=aviator-20) ----------
  function route() {
    const q = new URLSearchParams(location.search).get("p");
    const h = location.hash.match(/^#p\/(.+)/);
    if (h) openProduct(h[1]); else if (q && byId[q]) openProduct(q);
  }
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeProduct(); closeCart(); } });

  renderFilters(); renderGrid(); renderCartCount(); route();
})();
