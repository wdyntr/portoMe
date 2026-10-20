const header = document.getElementById("site-header");
const nav = document.getElementById("site-nav");
const navToggle = document.getElementById("nav-toggle");
const year = document.getElementById("year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 901px)");
  const handleDesktopChange = (event) => {
    if (event.matches) setMenu(false);
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else {
    desktopQuery.addListener(handleDesktopChange);
  }
}

const navItems = Array.from(document.querySelectorAll(".site-nav a:not(.nav-cta)"))
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href")),
  }))
  .filter((item) => item.section);

let scrollTicking = false;

const updateScrollState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);

  let current = null;
  navItems.forEach((item) => {
    if (item.section.getBoundingClientRect().top <= 160) {
      current = item;
    }
  });

  navItems.forEach((item) => {
    const isActive = item === current;
    item.link.classList.toggle("is-active", isActive);
    if (isActive) {
      item.link.setAttribute("aria-current", "true");
    } else {
      item.link.removeAttribute("aria-current");
    }
  });

  scrollTicking = false;
};

const requestScrollUpdate = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateScrollState);
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollState();

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    Array.from(group.children)
      .filter((child) => child.classList.contains("reveal"))
      .forEach((child, index) => {
        child.style.transitionDelay = `${index * 80}ms`;
      });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".glow-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}
