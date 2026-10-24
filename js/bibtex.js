/* ============================================================
   BibTeX Toggle & Copy Controller
   ============================================================ */

export function initBibtex() {
  const toggleButtons = document.querySelectorAll(".pub-bibtex-toggle");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;
      const targetBox = document.getElementById(targetId);
      if (!targetBox) return;

      const isHidden = targetBox.hasAttribute("hidden");
      if (isHidden) {
        targetBox.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        targetBox.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  const copyButtons = document.querySelectorAll(".pub-bibtex-copy-btn");
  copyButtons.forEach((copyBtn) => {
    copyBtn.addEventListener("click", async () => {
      const codeId = copyBtn.getAttribute("data-code");
      if (!codeId) return;
      const codeEl = document.getElementById(codeId);
      if (!codeEl) return;

      const text = codeEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✓ Copied!";
        copyBtn.style.background = "var(--success)";
        copyBtn.style.color = "#fff";
        copyBtn.style.borderColor = "var(--success)";

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = "";
          copyBtn.style.color = "";
          copyBtn.style.borderColor = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy BibTeX: ", err);
      }
    });
  });
}
