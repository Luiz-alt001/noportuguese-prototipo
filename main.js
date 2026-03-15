/* ═══════════════════════════════════════════════════
   NO PORTUGUESE IDIOMAS — main.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── PORTAL TIMER ── */
let portalTimer = null;

/* ── PAGE ROUTER ── */
function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + name);
  if (!target) return;
  target.classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update nav active state
  document.querySelectorAll('.nav-links li button').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  // Handle portal countdown
  stopPortalCountdown();
  if (name === 'portal') startPortalCountdown();

  // Close mobile menu
  closeMobileMenu();

  // Trigger scroll reveal
  setTimeout(triggerReveal, 100);
}

/* ── MOBILE MENU ── */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ── LANG TABS (Courses) ── */
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
  const el = document.getElementById('portalCountdown');
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

/* ── FAQ ACCORDION ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── SCROLL REVEAL ── */
function triggerReveal() {
  const currentPage = document.querySelector('.page.active');
  if (!currentPage) return;

  const items = currentPage.querySelectorAll('.reveal:not(.visible)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  items.forEach(el => observer.observe(el));

  // Força elementos já visíveis no viewport
  setTimeout(() => {
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 120);
}

function getCurrentPage() {
  const active = document.querySelector('.page.active');
  return active ? active.id.replace('page-', '') : 'home';
}

/* ── NAV SCROLL SHADOW ── */
function initNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── SMOOTH HOVER IMAGE CDN ── */
function initImageFallback() {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', function() {
      this.src = this.dataset.fallback;
    });
  });
}

/* ── WHATSAPP FORM SUBMIT ── */
function submitToWhatsApp(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const name = form.querySelector('[data-field="name"]')?.value || '';
  const phone = form.querySelector('[data-field="phone"]')?.value || '';
  const interest = form.querySelector('[data-field="interest"]')?.value || '';

  let msg = 'Olá! Quero agendar uma aula experimental gratuita.';
  if (name) msg += `\nNome: ${name}`;
  if (phone) msg += `\nWhatsApp: ${phone}`;
  if (interest) msg += `\nInteresse: ${interest}`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://api.whatsapp.com/send?phone=5522981259080&text=${encoded}`, '_blank');
}

/* ── COUNTER ANIMATION ── */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const duration = 1200;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  initFAQ();
  initNavScroll();
  initImageFallback();

  // Counter on stats visibility — trigger with low threshold and rootMargin
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    obs.observe(statsRow);
  }
});