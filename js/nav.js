/* ============================================================
   Mobile Navigation Drawer Controller
   ============================================================ */

export function initMobileNav() {
  const menuBtn = document.querySelector(".nav-menu-btn");
  const drawer = document.querySelector("#mobile-nav-drawer");
  if (!menuBtn || !drawer) return;

  const menuIcon = menuBtn.querySelector(".menu-icon");

  function openDrawer() {
    drawer.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    if (menuIcon) menuIcon.textContent = "✕";
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (menuIcon) menuIcon.textContent = "☰";
  }

  function toggleDrawer() {
    if (drawer.classList.contains("is-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  // Close when clicking any drawer link
  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("is-open") && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });
}
