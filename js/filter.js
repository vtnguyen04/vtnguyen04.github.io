/* ============================================================
   Research Category Filter Controller — 2026 Edition
   ============================================================ */

export function initFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll("#research .project");

  if (filterBtns.length === 0 || projects.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filterVal = btn.getAttribute("data-filter");

      projects.forEach((proj) => {
        const category = proj.getAttribute("data-category") || "";
        
        if (filterVal === "all" || category.includes(filterVal)) {
          proj.style.display = "";
          proj.style.opacity = "0";
          proj.style.transform = "translateY(12px)";
          setTimeout(() => {
            proj.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
            proj.style.opacity = "1";
            proj.style.transform = "translateY(0)";
          }, 30);
        } else {
          proj.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          proj.style.opacity = "0";
          proj.style.transform = "translateY(8px)";
          setTimeout(() => {
            proj.style.display = "none";
          }, 200);
        }
      });
    });
  });
}
