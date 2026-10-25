/* ============================================================
   Scroll Telemetry & Active Section Spy & Scroll Navigation Controls — 2026 Edition
   ============================================================ */

export function initScrollTelemetry() {
  const progressBar = document.getElementById("scroll-progress");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const sections = document.querySelectorAll("section[id]");
  const topBtn = document.getElementById("scroll-top-btn");
  const bottomBtn = document.getElementById("scroll-bottom-btn");

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (bottomBtn) {
    bottomBtn.addEventListener("click", () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    });
  }

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // 1. Reading progress calculation
    if (progressBar) {
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // 2. Active Section Spy
    if (sections.length > 0 && navLinks.length > 0) {
      let currentSectionId = "";
      const scrollPos = scrollTop + 120;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.getAttribute("id");
        }
      });

      if (currentSectionId) {
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href.includes(`#${currentSectionId}`)) {
            link.classList.add("nav-active");
          } else {
            link.classList.remove("nav-active");
          }
        });
      }
    }

    // 3. Floating Scroll Button Disabled / Opacity States
    if (topBtn) {
      if (scrollTop < 40) {
        topBtn.classList.add("is-disabled");
      } else {
        topBtn.classList.remove("is-disabled");
      }
    }
    if (bottomBtn) {
      if (docHeight <= 0 || scrollTop >= docHeight - 40) {
        bottomBtn.classList.add("is-disabled");
      } else {
        bottomBtn.classList.remove("is-disabled");
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
