/* ============================================================
   Main Application Entry Point — 2026 Interactive Engine
   ============================================================ */

import { initTheme } from "./theme.js";
import { initMobileNav } from "./nav.js";
import { initLightbox } from "./lightbox.js";
import { initShowcases } from "./showcase.js";
import { initAlbums } from "./album.js";
import { initBibtex } from "./bibtex.js";
import { initSpotlight } from "./spotlight.js";
import { initCommandPalette } from "./command-palette.js";
import { initFilter } from "./filter.js";
import { initScrollTelemetry } from "./scroll-progress.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initLightbox();
  initShowcases();
  initAlbums();
  initBibtex();
  initSpotlight();
  initCommandPalette();
  initFilter();
  initScrollTelemetry();
});
