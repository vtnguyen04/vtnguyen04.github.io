/* ============================================================
   Interactive Mouse Spotlight Engine — 2026 Linear Standard
   ============================================================ */

export function initSpotlight() {
  const cards = document.querySelectorAll(".spotlight-card, .project-showcase, .profile-card, .pub-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}
