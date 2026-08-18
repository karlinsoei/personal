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
 * Chapter nav active state — highlights whichever section is crossing the
 * middle of the viewport.
 *
 * This used to use `threshold: 0.5`, which is a trap: the ratio is measured
 * against the *target's* own height, so a section taller than the viewport can
 * never be 50% visible and simply never activates. Sections 02 and 03 are both
 * well over a screen tall, so their numerals stayed dead.
 *
 * Collapsing the root to a thin band across the viewport's middle and watching
 * for any intersection at all makes activation independent of section height.
 */
function initChapterNav() {
  const sections = document.querySelectorAll<HTMLElement>("main .section");
  const links = document.querySelectorAll<HTMLAnchorElement>(
    ".chapter-nav a"
  );

  const setActive = (id: string) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive((entry.target as HTMLElement).id);
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * The overture.
 *
 * The page opens on mom's line and answers it a beat later — the reversal is
 * the point, so the headline is what gets held back, not the bubble.
 *
 * The hidden state lives in CSS behind `.js`, so with no JavaScript both are
 * visible immediately and nothing here is load-bearing. The reply also lands
 * the instant the reader does anything at all: waiting is the joke, but only
 * for people who choose to wait.
 */
function initOverture() {
  const root = document.querySelector<HTMLElement>("[data-overture]");
  if (!root) return;

  const answer = () => root.classList.add("is-answered");

  if (prefersReducedMotion) {
    root.classList.add("is-shouting");
    answer();
    return;
  }

  requestAnimationFrame(() => root.classList.add("is-shouting"));

  const timer = window.setTimeout(answer, 2200);
  const early = () => {
    window.clearTimeout(timer);
    answer();
  };
  addEventListener("scroll", early, { once: true, passive: true });
  addEventListener("pointerdown", early, { once: true });
  addEventListener("keydown", early, { once: true });
}

/**
 * Reel — the early-gaming strip.
 *
 * The scrolling is CSS (scroll-snap on an overflow container), so the thing
 * already works with no JS, with touch, with a trackpad, and with arrow keys
 * once the viewport has focus. Everything here is enhancement: the counter,
 * the progress rule, and the two buttons — which stay hidden until the `.js`
 * class confirms there's something to drive them.
 */
function initReels() {
  document.querySelectorAll<HTMLElement>("[data-reel]").forEach((reel) => {
    const viewport = reel.querySelector<HTMLElement>("[data-reel-viewport]");
    const slides = Array.from(reel.querySelectorAll<HTMLElement>(".reel__slide"));
    if (!viewport || slides.length === 0) return;

    const indexEl = reel.querySelector<HTMLElement>("[data-reel-index]");
    const fill = reel.querySelector<HTMLElement>("[data-reel-fill]");
    const prev = reel.querySelector<HTMLButtonElement>("[data-reel-prev]");
    const next = reel.querySelector<HTMLButtonElement>("[data-reel-next]");

    const pad = (n: number) => String(n).padStart(2, "0");
    let current = 0;

    const render = () => {
      if (indexEl) {
        indexEl.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
      }
      if (fill) {
        fill.style.width = `${100 / slides.length}%`;
        fill.style.transform = `translateX(${current * 100}%)`;
      }
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === slides.length - 1;
    };

    const go = (i: number) => {
      current = Math.max(0, Math.min(slides.length - 1, i));
      viewport.scrollTo({
        left: slides[current].offsetLeft - slides[0].offsetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      render();
    };

    prev?.addEventListener("click", () => go(current - 1));
    next?.addEventListener("click", () => go(current + 1));

    // Swiping and trackpad scrolling bypass the buttons entirely, so the
    // readout has to follow the scroll position rather than our own counter.
    let frame = 0;
    viewport.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const step = viewport.clientWidth || 1;
          const i = Math.round(viewport.scrollLeft / step);
          if (i !== current && i >= 0 && i < slides.length) {
            current = i;
            render();
          }
        });
      },
      { passive: true }
    );

    render();
  });
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

/**
 * Content is the product; the reveal is decoration on top of it. So every
 * entry point below is wrapped — if the animation layer throws, the words
 * still end up on screen rather than staying at opacity 0 forever.
 */
function revealEverything() {
  document
    .querySelectorAll<HTMLElement>("[data-reveal]")
    .forEach((el) => el.classList.add("is-revealed"));
}

// The module booted, so the inline failsafe in index.html isn't needed.
const w = window as unknown as { __revealFailsafe?: number };
if (w.__revealFailsafe) {
  clearTimeout(w.__revealFailsafe);
  delete w.__revealFailsafe;
}

try {
  initReveals();
} catch (err) {
  console.error("Scroll reveals failed to initialise; showing all content.", err);
  revealEverything();
}

try {
  initChapterNav();
} catch (err) {
  console.error("Chapter nav failed to initialise.", err);
}

try {
  initOverture();
} catch (err) {
  // Without this the headline stays hidden until the <head> failsafe fires.
  console.error("Overture failed to initialise; showing the headline.", err);
  document.querySelector("[data-overture]")?.classList.add("is-shouting", "is-answered");
}

try {
  initReels();
} catch (err) {
  // The strip still scrolls natively; only the readout and buttons are lost.
  console.error("Reel controls failed to initialise.", err);
}

try {
  initCopyEmail();
} catch (err) {
  console.error("Tap-to-copy failed to initialise.", err);
}
