import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/**
 * Scroll-triggered reveals.
 * Kept deliberately simple — a single fade/rise, no scattered per-element
 * effects. Anything fancier should be a conscious choice per section, not a
 * default applied everywhere.
 */
function initReveals() {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  items.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => el.classList.add("is-revealed"),
    });
  });
}

/**
 * Chapter nav active state — tracks which section is centered in viewport.
 */
function initChapterNav() {
  const sections = document.querySelectorAll<HTMLElement>("main .section");
  const links = document.querySelectorAll<HTMLAnchorElement>(
    ".chapter-nav a"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Tap-to-copy email — small human gesture, borrowed intentionally from the
 * reference site rather than a generic mailto-only link.
 */
function initCopyEmail() {
  const el = document.querySelector<HTMLAnchorElement>("[data-copy]");
  if (!el) return;

  el.addEventListener("click", async (e) => {
    const email = el.getAttribute("href")?.replace("mailto:", "");
    if (!email || email.startsWith("[TODO")) return; // placeholder guard
    e.preventDefault();
    await navigator.clipboard.writeText(email);
    const original = el.textContent;
    el.textContent = "Copied ✓";
    setTimeout(() => {
      el.textContent = original;
    }, 1500);
  });
}

initReveals();
initChapterNav();
initCopyEmail();
