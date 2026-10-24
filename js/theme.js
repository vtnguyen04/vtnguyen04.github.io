/* ============================================================
   Theme Management (Light / Dark mode)
   ============================================================ */

export function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  const saved = localStorage.getItem("theme");
  applyTheme(saved === "dark" || saved === "light" ? saved : (prefersDark.matches ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  prefersDark.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
}
