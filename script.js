const header = document.getElementById("header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const yearEl = document.getElementById("year");
const contactForm = document.querySelector(".contact-form");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Always start at hero on load / refresh ─── */
function scrollToHero() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function clearHashIfPresent() {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

function scrollToHeroInstant() {
  clearHashIfPresent();
  document.documentElement.classList.add("no-smooth-scroll");
  scrollToHero();
  requestAnimationFrame(() => {
    scrollToHero();
    document.documentElement.classList.remove("no-smooth-scroll");
  });
}

scrollToHeroInstant();

window.addEventListener("pageshow", scrollToHeroInstant);
window.addEventListener("load", scrollToHeroInstant);
window.addEventListener("DOMContentLoaded", scrollToHeroInstant);

/* Catch late browser scroll restoration after refresh */
requestAnimationFrame(scrollToHeroInstant);
setTimeout(scrollToHeroInstant, 0);
setTimeout(scrollToHeroInstant, 50);
setTimeout(scrollToHeroInstant, 150);

/* Reset scroll position before reload so the browser cannot restore mid-page */
window.addEventListener("beforeunload", scrollToHero);

/* In-page nav without leaving a hash in the URL (clean refresh → hero) */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") {
      e.preventDefault();
      scrollToHeroInstant();
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
  });
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ─── Header scroll state ─── */
window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true }
);

/* ─── Mobile nav ─── */
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  navLinks?.classList.toggle("open", !open);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
    navLinks?.classList.remove("open");
  });
});

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = "Thank you! We will be in touch.";
  btn.disabled = true;
  setTimeout(() => {
    contactForm.reset();
    btn.textContent = original;
    btn.disabled = false;
  }, 3000);
});

/* ─── Scroll reveal (fade + mask sections in) ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("destination-card")) {
          entry.target.classList.add("is-visible");
        }
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
);

document.querySelectorAll(".reveal, .destination-card, .ig-tile, .checklist-item, .story-card, .service-card").forEach((el) => {
  revealObserver.observe(el);
});

/* ─── Parallax: pan, zoom factor, depth per layer ─── */
const parallaxLayers = document.querySelectorAll("[data-parallax]");

function getSceneProgress(el) {
  const scene = el.closest(".scene") || el.closest("section") || document.documentElement;
  const rect = scene.getBoundingClientRect();
  const vh = window.innerHeight;
  const center = rect.top + rect.height * 0.5;
  const viewCenter = vh * 0.5;
  return (viewCenter - center) / (vh + rect.height * 0.5);
}

function updateParallax() {
  if (prefersReducedMotion) return;

  parallaxLayers.forEach((layer) => {
    const speed = parseFloat(layer.dataset.parallax) || 0;
    const progress = getSceneProgress(layer);
    const range = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--parallax-range")) || 120;
    const y = progress * range * speed;
    const x = progress * range * speed * 0.35;
    const scaleAttr = layer.dataset.parallaxScale;
    const scale = scaleAttr ? 1 + progress * (parseFloat(scaleAttr) - 1) * 0.15 : 1;

    layer.style.setProperty("--py", `${y}px`);
    layer.style.setProperty("--px", `${x}px`);
    layer.style.setProperty("--pscale", String(Math.max(0.92, Math.min(1.2, scale))));
  });
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

updateParallax();

/* ─── Mouse tilt on [data-tilt] elements ─── */
function bindTilt(el) {
  if (prefersReducedMotion) return;

  const maxTilt = 6;

  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${x * maxTilt}deg`);
    el.style.setProperty("--tilt-y", `${-y * maxTilt}deg`);
  });

  el.addEventListener("mouseleave", () => {
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  });
}

document.querySelectorAll("[data-tilt]").forEach(bindTilt);

/* ─── Destination cards: scroll-based zoom when in view ─── */
const destinationCards = document.querySelectorAll(".destination-card");

function updateCardZoom() {
  if (prefersReducedMotion) return;

  destinationCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top < vh && rect.bottom > 0) {
      const visible = 1 - Math.abs(rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      const bg = card.querySelector(".card-depth__bg");
      if (bg && visible > 0.3) {
        const s = 1.05 + visible * 0.06;
        const ty = (1 - visible) * 12;
        bg.style.transform = `scale(${s}) translateY(${ty}px)`;
      }
    }
  });
}

window.addEventListener(
  "scroll",
  () => {
    requestAnimationFrame(updateCardZoom);
  },
  { passive: true }
);
