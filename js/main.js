/* ============================================================
   Main Application Entry Point
   ============================================================ */

import { initTheme } from "./theme.js";
import { initLightbox } from "./lightbox.js";
import { initShowcases } from "./showcase.js";
import { initAlbums } from "./album.js";
import { initBibtex } from "./bibtex.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLightbox();
  initShowcases();
  initAlbums();
  initBibtex();
});
