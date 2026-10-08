"use strict";

/* ---------- AOS (scroll animations) ---------- */
if (window.AOS) {
  AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
    disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}

/* ---------- Mobile navigation ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("navLinks");

function setNav(open) {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

navToggle?.addEventListener("click", () =>
  setNav(!navLinks.classList.contains("open")),
);
navLinks?.addEventListener("click", (e) => {
  if (e.target.closest("a")) setNav(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setNav(false);
});

/* ---------- Highlight active nav link while scrolling ---------- */
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const observed = navAnchors
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) =>
        a.classList.toggle(
          "active",
          a.getAttribute("href") === `#${entry.target.id}`,
        ),
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
observed.forEach((section) => sectionObserver.observe(section));

/* ---------- Generic carousel ---------- */
function initCarousel(root) {
  const track = root.querySelector(".track");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const slides = [...track.children];
  const dotsBox = root.hasAttribute("data-dots")
    ? root.parentElement.querySelector("[data-dots-container]")
    : null;

  let current = 0;
  let dots = [];

  if (dotsBox) {
    dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `${i + 1}-slayd`);
      dot.addEventListener("click", () => goTo(i));
      dotsBox.appendChild(dot);
      return dot;
    });
  }

  const setActive = (index) => {
    current = index;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  };

  function goTo(index) {
    const i = (index + slides.length) % slides.length; // loop around
    track.scrollTo({
      left: slides[i].offsetLeft - slides[0].offsetLeft,
      behavior: "smooth",
    });
    setActive(i);
  }

  prev?.addEventListener("click", () => goTo(current - 1));
  next?.addEventListener("click", () => goTo(current + 1));

  // Keep the dots in sync when the user swipes or drags
  let ticking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const base = slides[0].offsetLeft;
        let closest = 0;
        let min = Infinity;
        slides.forEach((slide, i) => {
          const d = Math.abs(slide.offsetLeft - base - track.scrollLeft);
          if (d < min) {
            min = d;
            closest = i;
          }
        });
        setActive(closest);
        ticking = false;
      });
    },
    { passive: true },
  );

  // Arrow keys when the track is focused
  track.tabIndex = 0;
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });

  setActive(0);
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);

/* ---------- Lightbox: view a family photo in full, uncropped ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");

document.querySelectorAll("[data-lightbox]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    const card = btn.closest(".card");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = card
      ? `${card.querySelector("h3").textContent} · ${card.querySelector(".age").textContent}`
      : img.alt;
    lightbox.showModal();
  });
});

lightbox
  .querySelector(".lightbox-close")
  .addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close(); // click on backdrop
});
