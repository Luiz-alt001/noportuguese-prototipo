/* ═══════════════════════════════════════════════════
   NO PORTUGUESE IDIOMAS — main.js (rebuild limpo)
   ═══════════════════════════════════════════════════ */
'use strict';

/* ── PORTAL TIMER ── */
let portalTimer = null;

/* ── PAGE ROUTER ── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links li button').forEach(b => b.classList.remove('active'));

  const target = document.getElementById('page-' + name);
  if (!target) return;
  target.classList.add('active');

  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'instant' });

  stopPortalCountdown();
  if (name === 'portal') startPortalCountdown();

  closeMobileMenu();

  // Revela tudo com delay mínimo para o DOM pintar
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      revealAll(target);
    });
  });
}

/* ── REVEAL ── */
function revealAll(container) {
  if (!container) container = document.querySelector('.page.active');
  if (!container) return;
  container.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('on');
  });
}

function revealOnScroll() {
  const page = document.querySelector('.page.active');
  if (!page) return;
  page.querySelectorAll('.reveal:not(.on)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + 80) el.classList.add('on');
  });
}

/* ── MOBILE MENU ── */
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ── LANG TABS ── */
function setLang(lang) {
  document.querySelectorAll('.course-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('course-' + lang);
  if (panel) panel.classList.add('active');
  const tabEn = document.getElementById('tab-en');
  const tabEs = document.getElementById('tab-es');
  if (tabEn) tabEn.className = 'lang-tab' + (lang === 'en' ? ' active-en' : '');
  if (tabEs) tabEs.className = 'lang-tab' + (lang === 'es' ? ' active-es' : '');
}

/* ── PORTAL COUNTDOWN ── */
function startPortalCountdown() {
  let elapsed = 0;
  const total = 3000;
  const el  = document.getElementById('portalCountdown');
  const bar = document.getElementById('portalBar');
  if (!el || !bar) return;
  el.textContent = '3';
  bar.style.width = '0%';
  portalTimer = setInterval(() => {
    elapsed += 100;
    bar.style.width = (elapsed / total * 100) + '%';
    const rem = Math.ceil((total - elapsed) / 1000);
    el.textContent = rem > 0 ? rem : '0';
    if (elapsed >= total) {
      clearInterval(portalTimer);
      window.location.href = '/login.html';
    }
  }, 100);
}
function stopPortalCountdown() {
  if (portalTimer) { clearInterval(portalTimer); portalTimer = null; }
}

/* ── FAQ ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── NAV SCROLL ── */
function initNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    revealOnScroll();
  }, { passive: true });
}

/* ── COUNTER ── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let cur = 0;
    const step = target / 75;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, 16);
  });
}

/* ── WHATSAPP FORM ── */
function submitToWhatsApp(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const name     = form.querySelector('[data-field="name"]')?.value || '';
  const phone    = form.querySelector('[data-field="phone"]')?.value || '';
  const interest = form.querySelector('[data-field="interest"]')?.value || '';
  let msg = 'Olá! Quero agendar uma aula experimental gratuita.';
  if (name)     msg += `\nNome: ${name}`;
  if (phone)    msg += `\nWhatsApp: ${phone}`;
  if (interest) msg += `\nInteresse: ${interest}`;
  window.open(`https://api.whatsapp.com/send?phone=5522981259080&text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── CONTATO ── */
function enviarContato(btn) {
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Mensagem enviada! ✓';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = 'Enviar mensagem →';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  initFAQ();
  initNavScroll();

  // Contador após 400ms (dá tempo para o layout pintar)
  setTimeout(animateCounters, 400);

  // Garante reveal contínuo
  setInterval(revealOnScroll, 200);
});
