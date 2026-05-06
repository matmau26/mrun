// Header scroll behaviour
const header = document.querySelector('.site-header');
const updateHeader = () => {
  if (!header) return;
  if (window.scrollY > 40) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });
  links.addEventListener('click', (e) => {
    if (e.target.matches('a')) links.classList.remove('is-open');
  });
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Active nav link on scroll (homepage only — needs section[id] anchors present)
const trackedLinks = Array.from(document.querySelectorAll('.nav-link')).filter((link) => {
  const href = link.getAttribute('href') || '';
  // On garde : Accueil (index.html ou /), liens d'ancre vers une section (#xxx),
  // ainsi que tout lien avec un attribut data-active-on qui mappe à un id de section.
  return href === 'index.html' || href === '/' || href === '#' || /#./.test(href) || !!link.dataset.activeOn;
});
const sectionsWithId = Array.from(document.querySelectorAll('section[id]'));
const homeLink = trackedLinks.find((l) => {
  const href = l.getAttribute('href') || '';
  return href === 'index.html' || href === '/';
});

// On ne suit que les sections qui ont un lien correspondant dans la nav
const linkAnchorIds = new Set();
trackedLinks.forEach((l) => {
  const m = (l.getAttribute('href') || '').match(/#([^#]+)$/);
  if (m) linkAnchorIds.add(m[1]);
  if (l.dataset.activeOn) linkAnchorIds.add(l.dataset.activeOn);
});
const trackedSections = sectionsWithId.filter((s) => linkAnchorIds.has(s.id));

if (trackedSections.length > 0 && trackedLinks.length > 0) {
  const setActive = (link) => {
    trackedLinks.forEach((l) => l.classList.toggle('is-active', l === link));
  };

  const updateActiveLink = () => {
    const scrollY = window.scrollY;
    // Tout en haut de la page : Accueil reste actif
    if (scrollY < 80 && homeLink) {
      setActive(homeLink);
      return;
    }
    // Cherche la dernière section *suivie* dont le top a passé la ligne de référence
    const trigger = scrollY + window.innerHeight * 0.32;
    let current = null;
    for (const section of trackedSections) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= trigger) current = section;
    }
    if (current) {
      const id = current.id;
      const match = trackedLinks.find((l) => {
        const href = l.getAttribute('href') || '';
        return href.endsWith('#' + id) || l.dataset.activeOn === id;
      });
      if (match) { setActive(match); return; }
    }
    if (homeLink) setActive(homeLink);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateActiveLink(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateActiveLink();
}

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach((c) => counterObserver.observe(c));
