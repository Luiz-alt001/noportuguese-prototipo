// main.js — NoPortuguese SPA

// ── ROTEAMENTO ──
const PAGES = ['home','cursos','metodo','sobre','contato'];

function goTo(page) {
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
    const nl = document.getElementById('nl-' + p);
    if (nl) nl.classList.remove('active');
  });
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ page }, '', '/' + (page === 'home' ? '' : page));
  }
  const activeLink = document.getElementById('nl-' + page);
  if (activeLink) activeLink.classList.add('active');
  observeReveal();
}

// Roteamento inicial pela URL
window.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.replace('/', '').replace('.html', '') || 'home';
  const page = PAGES.includes(path) ? path : 'home';
  goTo(page);
});

window.addEventListener('popstate', (e) => {
  if (e.state?.page) goTo(e.state.page);
});

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ── MENU MOBILE ──
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
}

// ── FAQ ──
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── LANG TABS (Cursos) ──
function setLang(lang, btn) {
  document.querySelectorAll('.lang-tab').forEach(t => {
    t.classList.remove('active-en', 'active-es');
  });
  btn.classList.add('active-' + lang);
  document.querySelectorAll('.course-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + lang);
  if (panel) panel.classList.add('active');
}

// ── CHECKOUT ──
function irCheckout() {
  const select = document.querySelector('.hero-form-col select');
  const plano  = select?.value?.includes('Básico') ? 'basico' : 'premium';
  location.href = '/checkout.html?plano=' + plano;
}

// ── CONTATO ──
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

// ── SCROLL REVEAL ──
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// Inicia o reveal
observeReveal();
