/*!
 * S2 Advogados - camada de medição (dataLayer -> GTM -> GA4)
 * Todos os eventos são enviados como:
 *   dataLayer.push({ event: 's2_evt', s2_event: '<nome_do_evento>', ...parametros })
 * O GTM (tag "GA4 - Eventos S2") repassa s2_event como nome do evento no GA4.
 * Nenhum dado pessoal é coletado (apenas cliques, seções e tempo).
 */
(function () {
  'use strict';
  if (window.__s2TrackingLoaded) return;
  window.__s2TrackingLoaded = true;

  var dl = (window.dataLayer = window.dataLayer || []);
  var doc = document;
  var isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  var DEVICE = isMobile ? 'mobile' : 'desktop';
  var START = Date.now();

  /* ---------- helpers ---------- */
  function clip(v, n) {
    v = (v == null ? '' : String(v)).replace(/\s+/g, ' ').trim();
    return v.length > n ? v.slice(0, n) : v;
  }

  function push(name, params) {
    var payload = {
      event: 's2_evt',
      s2_event: name,
      device_type: DEVICE,
      page_path: location.pathname
    };
    if (params) for (var k in params) if (params[k] !== undefined && params[k] !== '') payload[k] = params[k];
    dl.push(payload);
  }

  function qs(name) {
    try { return new URLSearchParams(location.search).get(name) || ''; } catch (e) { return ''; }
  }

  function sectionOf(el) {
    if (!el || !el.closest) return 'outro';
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.mobile-float-wpp')) return 'barra_flutuante_mobile';
    if (el.closest('.lawfarm-hero-section')) return 'hero';
    if (el.closest('#servicos')) return 'servicos';
    if (el.closest('#diferenciais')) return 'diferenciais';
    if (el.closest('#dra-marcela')) return 'sobre_dra_marcela';
    if (el.closest('#como-funciona')) return 'como_funciona';
    if (el.closest('#faq')) return 'faq';
    if (el.closest('.lawfarm-cta-section')) return 'cta_final';
    return 'outro';
  }

  var SECTION_SELECTORS = [
    ['hero', '.lawfarm-hero-section'],
    ['servicos', '#servicos'],
    ['diferenciais', '#diferenciais'],
    ['sobre_dra_marcela', '#dra-marcela'],
    ['como_funciona', '#como-funciona'],
    ['faq', '#faq'],
    ['cta_final', '.lawfarm-cta-section'],
    ['footer', 'footer']
  ];

  function isWhatsApp(a) {
    var h = (a.getAttribute('href') || '').toLowerCase();
    return h.indexOf('wa.me') > -1 || h.indexOf('whatsapp.com') > -1 || h.indexOf('5534991692737') > -1;
  }

  function serviceOf(a) {
    var card = a.closest('.servico-lawfarm-card');
    if (card) {
      var t = card.querySelector('.card-title');
      if (t) return clip(t.textContent, 100);
    }
    return '';
  }

  /* ---------- 1) contexto da visita (1x por página) ---------- */
  push('page_context', {
    utm_source_page: qs('utm_source'),
    utm_medium_page: qs('utm_medium'),
    utm_campaign_page: qs('utm_campaign'),
    utm_term_page: qs('utm_term'),
    has_gclid: qs('gclid') || qs('gbraid') || qs('wbraid') ? 'sim' : 'nao',
    referrer_host: (function () {
      try { return doc.referrer ? new URL(doc.referrer).hostname : '(direto)'; } catch (e) { return ''; }
    })(),
    viewport: window.innerWidth + 'x' + window.innerHeight,
    lang: navigator.language || ''
  });

  /* ---------- 2) cliques (delegação global) ---------- */
  var firstInteraction = false;
  function markInteraction(type) {
    if (firstInteraction) return;
    firstInteraction = true;
    push('first_interaction', { interaction_type: type, seconds_to_interact: Math.round((Date.now() - START) / 1000) });
  }

  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    markInteraction('click');

    /* botões do slider de serviços */
    var btn = t.closest('#servicos-prev, #servicos-next');
    if (btn) {
      push('slider_click', { slider: 'servicos', direction: btn.id === 'servicos-next' ? 'proximo' : 'anterior' });
      return;
    }

    var a = t.closest('a');
    if (a) {
      var href = a.getAttribute('href') || '';
      var loc = sectionOf(a);
      var label = clip(a.textContent, 80);

      if (isWhatsApp(a)) {
        var svc = serviceOf(a);
        push('whatsapp_click', {
          click_location: loc,
          cta_text: label,
          service: svc,
          cta_type: a.className && /card-action/.test(a.className) ? 'card_servico' : (a.className || '').split(' ')[0],
          seconds_on_page: Math.round((Date.now() - START) / 1000),
          max_scroll_pct: maxScroll
        });
        return;
      }

      if (/^tel:/i.test(href)) { push('phone_click', { click_location: loc, cta_text: label }); return; }
      if (/^mailto:/i.test(href)) { push('email_click', { click_location: loc, cta_text: label }); return; }

      if (href.charAt(0) === '#' || (a.hostname === location.hostname && a.pathname === location.pathname && a.hash)) {
        var target = a.hash || href;
        if (a.classList.contains('brand-link') || target === '#') {
          push('logo_click', { click_location: loc });
        } else {
          push('nav_click', { nav_target: target.replace('#', ''), nav_label: label, click_location: loc });
        }
        return;
      }

      if (a.hostname && a.hostname !== location.hostname) {
        push('outbound_click', { link_host: a.hostname, link_url: clip(a.href, 200), click_location: loc, cta_text: label });
        return;
      }
    }

    /* clique em imagem/cartão/qualquer outro elemento relevante */
    var card = t.closest('.lawfarm-card');
    if (card && !a) {
      var title = card.querySelector('h3, h4, .card-title');
      push('card_click', { click_location: sectionOf(card), card_title: title ? clip(title.textContent, 100) : '' });
    }
  }, true);

  /* ---------- 3) FAQ (details/summary) ---------- */
  doc.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d || !d.classList || !d.classList.contains('lawfarm-faq-item')) return;
    var q = d.querySelector('.q-text');
    var all = Array.prototype.slice.call(doc.querySelectorAll('.lawfarm-faq-item'));
    push('faq_toggle', {
      faq_question: q ? clip(q.textContent, 120) : '',
      faq_index: all.indexOf(d) + 1,
      faq_state: d.open ? 'abriu' : 'fechou'
    });
  }, true);

  /* ---------- 4) copiar texto / seleção ---------- */
  doc.addEventListener('copy', function () {
    var sel = '';
    try { sel = String(window.getSelection() || ''); } catch (e) {}
    var digits = sel.replace(/\D/g, '');
    push('copy_text', {
      copy_type: digits.length >= 8 ? 'telefone' : (/@/.test(sel) ? 'email' : 'texto'),
      copy_length: sel.length,
      click_location: (function () {
        try { return sectionOf(window.getSelection().anchorNode.parentElement); } catch (e) { return ''; }
      })()
    });
  });

  /* ---------- 5) scroll depth ---------- */
  var maxScroll = 0;
  var scrollMarks = [25, 50, 75, 90, 100];
  var scrollSent = {};
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var h = doc.documentElement;
      var total = Math.max(h.scrollHeight - window.innerHeight, 1);
      var pct = Math.min(100, Math.round((window.scrollY / total) * 100));
      if (pct > maxScroll) maxScroll = pct;
      if (pct > 0) markInteraction('scroll');
      scrollMarks.forEach(function (m) {
        if (pct >= m && !scrollSent[m]) {
          scrollSent[m] = true;
          push('scroll_depth', { scroll_percent: m, seconds_on_page: Math.round((Date.now() - START) / 1000) });
        }
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 6) seções vistas + tempo de atenção por seção ---------- */
  var dwell = {};      // segundos visíveis acumulados por seção
  var visible = {};    // seção -> timestamp de quando ficou visível
  var viewedSent = {};
  var dwellSent = {};
  var DWELL_MARKS = [5, 15, 30];

  function flushVisible(name) {
    if (visible[name]) {
      dwell[name] = (dwell[name] || 0) + (Date.now() - visible[name]) / 1000;
      visible[name] = 0;
    }
  }

  function checkDwell(name) {
    var total = (dwell[name] || 0) + (visible[name] ? (Date.now() - visible[name]) / 1000 : 0);
    DWELL_MARKS.forEach(function (m) {
      var key = name + m;
      if (total >= m && !dwellSent[key]) {
        dwellSent[key] = true;
        push('section_dwell', { section_name: name, dwell_seconds: m });
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var name = en.target.getAttribute('data-s2-section');
        if (en.isIntersecting && en.intersectionRatio >= 0.4) {
          if (!visible[name] && doc.visibilityState === 'visible') visible[name] = Date.now();
          if (!viewedSent[name]) {
            viewedSent[name] = true;
            push('section_view', { section_name: name, seconds_on_page: Math.round((Date.now() - START) / 1000) });
          }
        } else {
          flushVisible(name);
        }
      });
    }, { threshold: [0, 0.4] });

    SECTION_SELECTORS.forEach(function (s) {
      var el = doc.querySelector(s[1]);
      if (el) { el.setAttribute('data-s2-section', s[0]); secObs.observe(el); }
    });

    setInterval(function () {
      if (doc.visibilityState !== 'visible') return;
      Object.keys(visible).forEach(function (n) { if (visible[n]) checkDwell(n); });
    }, 1000);

    /* ---------- 7) botões de WhatsApp que entraram na tela (impressões) ---------- */
    var ctaSeen = {};
    var ctaObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var a = en.target;
        var key = sectionOf(a) + '|' + serviceOf(a);
        if (ctaSeen[key]) return;
        ctaSeen[key] = true;
        push('cta_view', { click_location: sectionOf(a), service: serviceOf(a), cta_text: clip(a.textContent, 60) });
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(doc.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]'), function (a) { ctaObs.observe(a); });
  }

  /* ---------- 8) tempo engajado (aba visível) ---------- */
  var engaged = 0, lastTick = Date.now();
  var TIME_MARKS = [10, 30, 60, 120, 180, 300];
  var timeSent = {};
  setInterval(function () {
    var now = Date.now();
    if (doc.visibilityState === 'visible') engaged += (now - lastTick) / 1000;
    lastTick = now;
    TIME_MARKS.forEach(function (m) {
      if (engaged >= m && !timeSent[m]) { timeSent[m] = true; push('engaged_time', { engaged_seconds: m }); }
    });
  }, 1000);

  doc.addEventListener('visibilitychange', function () {
    lastTick = Date.now();
    if (doc.visibilityState === 'hidden') {
      Object.keys(visible).forEach(flushVisible);
      sendExit();
    } else {
      /* voltou para a aba: reinicia contagem das seções ainda visíveis */
      SECTION_SELECTORS.forEach(function (s) {
        var el = doc.querySelector(s[1]);
        if (!el) return;
        var r = el.getBoundingClientRect();
        var vis = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (vis > 0 && vis / Math.max(r.height, 1) >= 0.4 || vis > window.innerHeight * 0.4) visible[s[0]] = Date.now();
      });
    }
  });

  /* ---------- 9) saída da página (resumo) ---------- */
  var exitSent = false;
  function sendExit() {
    if (exitSent) return;
    exitSent = true;
    var top = '', topT = 0;
    Object.keys(dwell).forEach(function (n) { if (dwell[n] > topT) { topT = dwell[n]; top = n; } });
    push('page_exit', {
      engaged_seconds: Math.round(engaged),
      max_scroll_pct: maxScroll,
      sections_viewed: Object.keys(viewedSent).length,
      top_section: top
    });
  }
  window.addEventListener('pagehide', function () { Object.keys(visible).forEach(flushVisible); sendExit(); });
  doc.addEventListener('visibilitychange', function () { if (doc.visibilityState === 'visible') exitSent = false; });

  /* ---------- 10) erros de JS (saúde do site) ---------- */
  var errCount = 0;
  window.addEventListener('error', function (e) {
    if (errCount++ > 3) return;
    push('js_error', { error_message: clip(e.message, 100), error_file: clip((e.filename || '').split('/').pop(), 60) });
  });
})();
