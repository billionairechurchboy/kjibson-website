const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

/* ─── Always open at the top, never leave a hash in the URL ─── */
window.addEventListener("pageshow", () => window.scrollTo(0, 0));

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    const target = id === "#top" ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    if (id === "#top") window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    closeMenu();
  });
});

/* ─── Header state ─── */
const header = $("#header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ─── Mobile menu ─── */
const toggle = $(".nav__toggle");
const links = $("#nav-links");

function closeMenu() {
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  links.classList.remove("is-open");
  header.classList.remove("menu-open");
}

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  links.classList.toggle("is-open", open);
  header.classList.toggle("menu-open", open);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ─── Active nav link ─── */
const navMap = new Map($$(".nav__links a").map((a) => [a.getAttribute("href").slice(1), a]));
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navMap.forEach((l) => l.classList.remove("is-active"));
      navMap.get(entry.target.id)?.classList.add("is-active");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
["top", ...navMap.keys()].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ─── Boarding pass: split-flap origin city ─── */
const flipCode = $("[data-flip]");
const flipCity = $("[data-flip-city]");
const origins = [
  ["LOS", "Lagos"],
  ["ACC", "Accra"],
  ["NBO", "Nairobi"],
  ["DEL", "Delhi"],
  ["CAI", "Cairo"],
  ["ABV", "Abuja"],
  ["IST", "Istanbul"],
];
if (flipCode && !reduceMotion) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % origins.length;
    flipCode.classList.remove("is-flipping");
    void flipCode.offsetWidth;
    flipCode.classList.add("is-flipping");
    setTimeout(() => {
      flipCode.textContent = origins[i][0];
      flipCity.textContent = origins[i][1];
    }, 230);
  }, 2600);
}

/* ─── Services: folder tabs ─── */
const tabs = $$(".folder__tab");
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, idx) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = tabs[(idx + dir + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

/* ─── Process: stamp each step as it reaches the middle ─── */
const steps = $$(".step");
const stepCount = $("[data-step-count]");
const stepBar = $("[data-step-bar]");
const finalStamp = $("[data-final-stamp]");

function setStep(n) {
  steps.forEach((s, i) => {
    s.classList.toggle("is-current", i === n - 1);
    s.classList.toggle("is-done", i < n);
  });
  stepCount.textContent = String(n).padStart(2, "0");
  stepBar.style.width = `${(n / steps.length) * 100}%`;
  finalStamp.classList.toggle("is-on", n === steps.length);
}

const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setStep(Number(entry.target.dataset.step));
    });
  },
  { rootMargin: "-48% 0px -48% 0px" }
);
steps.forEach((s) => stepObserver.observe(s));

/* ─── Reels: one plays at a time; fallback only on a real load error ─── */
const reelVideos = $$(".reel video");
reelVideos.forEach((video) => {
  const reel = video.closest(".reel");
  const markMissing = () => reel.classList.add("is-missing");
  // networkState is briefly NO_SOURCE while loading starts, so rely on errors only.
  video.addEventListener("error", markMissing);
  if (video.error) markMissing();
  video.addEventListener("play", () => {
    reelVideos.forEach((other) => other !== video && other.pause());
  });
});

/* ─── Scroll reveal ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ─── Contact form ─── */
const form = $(".form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.textContent = "Received. We'll be in touch.";
  btn.disabled = true;
  setTimeout(() => {
    form.reset();
    btn.innerHTML = original;
    btn.disabled = false;
  }, 3200);
});

$("#year").textContent = new Date().getFullYear();
