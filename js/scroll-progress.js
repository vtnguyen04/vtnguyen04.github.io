/* ============================================================
   Scroll Telemetry & Active Section Spy — 2026 Edition
   ============================================================ */

export function initScrollTelemetry() {
  const progressBar = document.getElementById("scroll-progress");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    // 1. Reading progress calculation
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // 2. Active Section Spy
    if (sections.length > 0 && navLinks.length > 0) {
      let currentSectionId = "";
      const scrollPos = window.scrollY + 120;

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
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
