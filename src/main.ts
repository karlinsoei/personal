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
 * The hero swap — uncovering the gamer under the portrait.
 *
 * The mask itself is CSS; this only feeds it three numbers (centre x, centre y,
 * radius) as custom properties. Position and radius are eased here in a single
 * rAF loop rather than by CSS transitions, because the pointer target moves
 * continuously — a transition would restart on every mousemove and stutter.
 *
 * The loop runs only while something is actually moving and stops once it
 * settles, so an idle hero costs nothing.
 */
function initHeroSwap() {
  const root = document.querySelector<HTMLButtonElement>("[data-hero-swap]");
  const under = document.querySelector<HTMLElement>("[data-hero-under]");
  const frame = document.querySelector<HTMLElement>("[data-hero-frame]");
  if (!root || !under || !frame) return;

  const states = document.querySelectorAll<HTMLElement>("[data-hero-state]");
  const toggles =
    document.querySelectorAll<HTMLButtonElement>("[data-hero-toggle]");

  // Fractions of the frame, resolved against its live size on each read so a
  // resize or an orientation change can't leave the blob mis-scaled.
  // Deliberately small: a wide opening just interleaves two unrelated
  // compositions, where a tight one reads as a window cut into the portrait.
  const REST = 0.3;
  const EASE_POS = 0.2;
  const EASE_RADIUS = 0.14;

  let revealed = false;
  let hovering = false;
  let raf = 0;

  const size = () => {
    const r = frame.getBoundingClientRect();
    return { w: r.width, h: r.height };
  };

  const restRadius = () => Math.min(size().w, size().h) * REST;
  // Generous enough that the blob's soft outer stop still clears the far
  // corner once it has re-centred, so a full reveal has no faded edge.
  const fullRadius = () => Math.hypot(size().w, size().h) * 1.1;

  const { w: w0, h: h0 } = size();
  let curX = w0 / 2;
  let curY = h0 * 0.42;
  let curR = 0;
  let tgtX = curX;
  let tgtY = curY;
  let tgtR = 0;

  const paint = () => {
    under.style.setProperty("--mx", `${curX}px`);
    under.style.setProperty("--my", `${curY}px`);
    under.style.setProperty("--r", `${curR}px`);
  };

  const settle = () => {
    curX = tgtX;
    curY = tgtY;
    curR = tgtR;
    paint();
  };

  const tick = () => {
    curX += (tgtX - curX) * EASE_POS;
    curY += (tgtY - curY) * EASE_POS;
    curR += (tgtR - curR) * EASE_RADIUS;
    paint();

    const done =
      Math.abs(tgtX - curX) < 0.4 &&
      Math.abs(tgtY - curY) < 0.4 &&
      Math.abs(tgtR - curR) < 0.4;

    raf = done ? 0 : requestAnimationFrame(tick);
    if (done) settle();
  };

  const run = () => {
    if (prefersReducedMotion) {
      settle();
      return;
    }
    if (!raf) raf = requestAnimationFrame(tick);
  };

  // Everything carrying data-hero-state flips together: the two headline
  // endings, both of mom's faces, and both of her lines.
  const setState = (next: boolean) => {
    revealed = next;
    root.setAttribute("aria-pressed", String(next));
    states.forEach((el) => {
      el.classList.toggle(
        "is-on",
        (el.dataset.heroState === "revealed") === next
      );
    });
    toggles.forEach((btn) => {
      const on = (btn.dataset.heroToggle === "revealed") === next;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  };

  const aim = (e: PointerEvent | MouseEvent) => {
    const box = frame.getBoundingClientRect();
    tgtX = e.clientX - box.left;
    tgtY = e.clientY - box.top;
  };

  /**
   * The one-time peek.
   *
   * The label says the photograph is interactive; this shows it, which primes
   * far better than any wording. It opens the blob at the centre, holds, and
   * closes — once, and only for someone who hasn't already found it.
   *
   * It waits for the overture to land first. Two things animating in the same
   * screen at the same moment read as noise rather than as an invitation.
   */
  let peekTimers: number[] = [];
  const cancelPeek = () => {
    peekTimers.forEach(clearTimeout);
    peekTimers = [];
  };

  const peek = () => {
    if (revealed || hovering) return;
    const { w, h } = size();
    // Snap the centre before opening: at radius 0 there is nothing on screen
    // to see move, so this costs nothing and avoids a drift-in from wherever
    // the blob last sat.
    tgtX = w / 2;
    tgtY = h * 0.42;
    curX = tgtX;
    curY = tgtY;
    tgtR = restRadius() * 0.92;
    run();

    peekTimers.push(
      window.setTimeout(() => {
        if (revealed || hovering) return;
        tgtR = 0;
        run();
      }, 1150)
    );
  };

  if (!prefersReducedMotion) {
    peekTimers.push(
      window.setTimeout(() => {
        // Nothing to prime if they have already scrolled into the story, and
        // nothing to teach if they already worked it out themselves.
        if (root.classList.contains("has-interacted")) return;
        const box = frame.getBoundingClientRect();
        if (box.bottom > 0 && box.top < innerHeight) peek();
      }, 3200)
    );
  }

  root.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "touch") return;
    cancelPeek();
    hovering = true;
    root.classList.add("has-interacted");
    aim(e);
    // Open at the pointer rather than easing in from wherever it last sat.
    if (!revealed && curR === 0) {
      curX = tgtX;
      curY = tgtY;
    }
    if (!revealed) tgtR = restRadius();
    run();
  });

  root.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch" || revealed) return;
    aim(e);
    run();
  });

  root.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "touch") return;
    hovering = false;
    if (!revealed) tgtR = 0;
    run();
  });

  // Records where a tap landed so the reveal grows out of the finger rather
  // than out of the middle of the frame.
  root.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    cancelPeek();
    aim(e);
    curX = tgtX;
    curY = tgtY;
  });

  // Fires for mouse, touch and keyboard alike, so this is the only toggle.
  root.addEventListener("click", () => {
    cancelPeek();
    root.classList.add("has-interacted");
    const { w, h } = size();

    if (!revealed) {
      setState(true);
      // Re-centre as it grows: it bounds how large the blob has to get to
      // cover the frame, and reads as the photograph settling into place.
      tgtX = w / 2;
      tgtY = h / 2;
      tgtR = fullRadius();
    } else {
      setState(false);
      tgtX = hovering ? tgtX : w / 2;
      tgtY = hovering ? tgtY : h * 0.42;
      tgtR = hovering ? restRadius() : 0;
    }
    run();
  });

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      cancelPeek();
      root.classList.add("has-interacted");
      const next = btn.dataset.heroToggle === "revealed";
      if (next === revealed) return;
      setState(next);
      const { w, h } = size();
      if (next) {
        tgtX = w / 2;
        tgtY = h / 2;
        tgtR = fullRadius();
      } else {
        tgtX = w / 2;
        tgtY = h * 0.42;
        tgtR = hovering ? restRadius() : 0;
      }
      run();
    });
  });

  addEventListener(
    "resize",
    () => {
      if (revealed) {
        const { w, h } = size();
        tgtX = w / 2;
        tgtY = h / 2;
        tgtR = fullRadius();
        settle();
      }
    },
    { passive: true }
  );

  paint();
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

    // Which slide the strip is currently nearest. Slides are narrower than the
    // viewport (the next one peeks in at the edge), so scrollLeft / clientWidth
    // would not name the slide — this measures against their real offsets.
    const nearest = () => {
      const x = viewport.scrollLeft;
      let best = 0;
      let bestGap = Infinity;
      slides.forEach((slide, i) => {
        const gap = Math.abs(slide.offsetLeft - slides[0].offsetLeft - x);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      return best;
    };

    // Drag to swipe, for mouse only. Touch already scrolls natively with
    // momentum, and hijacking it here would replace that with something worse.
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startLeft = viewport.scrollLeft;
      viewport.setPointerCapture(e.pointerId);
      // Snap fights a drag in progress; it goes back on release so the strip
      // still settles onto a slide.
      viewport.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      viewport.scrollLeft = startLeft - (e.clientX - startX);
    });

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;

      // Read the target while snapping is still off. Re-enabling mandatory
      // snap can reposition the scroller immediately — often back to the slide
      // it started on — so measuring after would settle on where the drag
      // began rather than where it ended.
      const target = slides[nearest()].offsetLeft - slides[0].offsetLeft;

      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId);
      }
      viewport.scrollTo({
        left: target,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("dragstart", (e) => e.preventDefault());
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
  initHeroSwap();
} catch (err) {
  // The portrait stays put and the default headline stands; only the reveal
  // is lost, which is the enhancement rather than the content.
  console.error("Hero swap failed to initialise.", err);
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
