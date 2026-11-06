/* Ad pixels. Turns on whichever IDs are set in STORE.pixels and exposes
 * Track.event(name, data) so the store fires the same event to all of them. */
(function () {
  const px = window.STORE.pixels;
  const load = (src) => { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); };

  if (px.meta) {
    !function (f, b, e, v, n) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; }(window, document);
    load("https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", px.meta); fbq("track", "PageView");
  }
  if (px.tiktok) {
    window.ttq = window.ttq || []; ["track", "page", "identify"].forEach((m) => (ttq[m] = (...a) => ttq.push([m, ...a])));
    load("https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + px.tiktok); ttq.page();
  }
  if (px.ga4) {
    load("https://www.googletagmanager.com/gtag/js?id=" + px.ga4);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", px.ga4);
  }
  if (px.pinterest) {
    window.pintrk = function () { pintrk.queue.push(Array.prototype.slice.call(arguments)); }; pintrk.queue = [];
    load("https://s.pinimg.com/ct/core.js"); pintrk("load", px.pinterest); pintrk("page");
  }

  const ga = { ViewContent: "view_item", AddToCart: "add_to_cart", InitiateCheckout: "begin_checkout", Purchase: "purchase" };
  const tt = { ViewContent: "ViewContent", AddToCart: "AddToCart", InitiateCheckout: "InitiateCheckout", Purchase: "CompletePayment" };
  const pin = { ViewContent: "pagevisit", AddToCart: "addtocart", InitiateCheckout: "checkout", Purchase: "checkout" };

  window.Track = {
    event(name, d = {}) {
      const data = { currency: "USD", value: d.value || 0, content_ids: d.ids || [], content_type: "product" };
      try { window.fbq && fbq("track", name, data); } catch (e) {}
      try { window.ttq && ttq.track(tt[name] || name, data); } catch (e) {}
      try { window.gtag && gtag("event", ga[name] || name, { currency: "USD", value: data.value, items: data.content_ids.map((id) => ({ item_id: id })) }); } catch (e) {}
      try { window.pintrk && pintrk("track", pin[name] || name, { value: data.value, currency: "USD" }); } catch (e) {}
    },
  };
})();
