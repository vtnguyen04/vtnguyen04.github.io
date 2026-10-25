/* ============================================================
   Theme Management (Default Dark 2026 / Light Toggle)
   ============================================================ */

export function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  // Default to clean, bright Light theme unless user explicitly saved 'dark'
  const saved = localStorage.getItem("theme");
  applyTheme(saved === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}
