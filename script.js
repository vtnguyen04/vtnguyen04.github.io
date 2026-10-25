const lightbox = document.querySelector("#media-lightbox");
const lightboxContent = lightbox.querySelector(".media-lightbox-content");
const lightboxClose = lightbox.querySelector(".media-lightbox-close");
const zoomableMedia = document.querySelectorAll("#research .project-figure:not([data-gallery]):not([data-album]) img, #projects .project-figure:not([data-gallery]):not([data-album]) img, .showcase-main-figure img, .award-cert-thumb img, .zoomable-media");
const galleries = document.querySelectorAll("#research [data-gallery]");
const albums = document.querySelectorAll("#research [data-album]");

/* ---------- Color theme ---------- */

const themeToggle = document.querySelector(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  applyTheme(saved === "dark" || saved === "light" ? saved : (prefersDark.matches ? "dark" : "light"));
}

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) applyTheme(event.matches ? "dark" : "light");
});

initTheme();

function openLightbox(media) {
  const image = document.createElement("img");
  image.src = media.dataset.fullSrc || media.currentSrc || media.src;
  image.alt = media.alt;
  lightboxContent.classList.remove("is-gallery");
  lightboxContent.replaceChildren(image);
  lightbox.showModal();
  document.body.classList.add("lightbox-open");
}

function openGallery(gallery) {
  const mediaItems = [...gallery.querySelectorAll("img")].sort((a, b) => {
    return Number(a.dataset.galleryOrder || 0) - Number(b.dataset.galleryOrder || 0);
  });
  const images = mediaItems.map((media) => {
    const image = document.createElement("img");
    image.src = media.dataset.fullSrc || media.currentSrc || media.src;
    image.alt = media.alt;
    return image;
  });
  lightboxContent.classList.add("is-gallery");
  lightboxContent.replaceChildren(...images);
  lightbox.showModal();
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.close();
}

zoomableMedia.forEach((media) => {
  media.classList.add("zoomable-media");
  media.tabIndex = 0;
  media.setAttribute("role", "button");
  media.setAttribute("aria-label", `View larger: ${media.alt}`);

  media.addEventListener("click", () => openLightbox(media));
  media.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(media);
    }
  });
});

galleries.forEach((gallery) => {
  gallery.querySelectorAll("img").forEach((media) => {
    media.classList.add("zoomable-media");
    media.tabIndex = 0;
    media.setAttribute("role", "button");
    media.setAttribute("aria-label", `Open gallery: ${media.alt}`);
    media.addEventListener("click", () => openGallery(gallery));
    media.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGallery(gallery);
      }
    });
  });
});

albums.forEach((album) => {
  const trigger = album.querySelector(".album-stack");
  const photos = [...album.querySelectorAll(".album-photo")];
  const prevBtn = album.querySelector(".album-prev");
  const nextBtn = album.querySelector(".album-next");
  const counter = album.querySelector(".album-counter");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let front = 0;
  let timer;
  let touchX = null;

  const render = () => {
    photos.forEach((photo, index) => {
      photo.dataset.depth = (index - front + photos.length) % photos.length;
    });
    if (counter) counter.textContent = `${front + 1} / ${photos.length}`;
  };

  const advance = (dir) => {
    front = (front + dir + photos.length) % photos.length;
    render();
  };
  const shuffle = () => advance(1);
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!reduceMotion) timer = window.setInterval(shuffle, 4000);
  };

  trigger.addEventListener("click", () => openGallery(album));
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); advance(-1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); advance(1); });
  trigger.addEventListener("mouseenter", stop);
  trigger.addEventListener("mouseleave", start);
  trigger.addEventListener("focus", stop);
  trigger.addEventListener("blur", start);

  trigger.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; stop(); }, { passive: true });
  trigger.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) advance(dx > 0 ? -1 : 1);
    touchX = null;
    start();
  }, { passive: true });

  album.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); advance(1); }
  });

  render();
  start();
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  lightboxContent.replaceChildren();
});

/* ---------- Showcase interactive switcher ---------- */

const showcases = document.querySelectorAll(".showcase-media-hub");
showcases.forEach((hub) => {
  const tabs = hub.querySelectorAll(".showcase-tab");
  const thumbs = hub.querySelectorAll(".showcase-thumb");
  const wrapper = hub.querySelector(".showcase-image-wrapper");
  const mainImg = hub.querySelector(".showcase-main-img");
  const zoomHint = hub.querySelector(".showcase-zoom-hint");
  const caption = hub.querySelector(".showcase-caption");

  if (!wrapper || !mainImg) return;

  const mainVideo = document.createElement("video");
  mainVideo.className = "showcase-main-video";
  mainVideo.controls = true;
  mainVideo.autoplay = true;
  mainVideo.loop = true;
  mainVideo.muted = true;
  mainVideo.playsInline = true;
  mainVideo.style.display = "none";
  wrapper.appendChild(mainVideo);

  const viewsData = [];
  thumbs.forEach((thumb) => {
    const thumbImg = thumb.querySelector("img");
    viewsData.push({
      src: thumb.dataset.src || thumbImg.src,
      poster: thumbImg ? thumbImg.src : "",
      alt: thumb.dataset.alt || (thumbImg ? thumbImg.alt : ""),
      caption: thumb.dataset.caption || "",
    });
  });

  function selectView(index, immediate = false) {
    const view = viewsData[index];
    if (!view) return;
    tabs.forEach((tab, i) => tab.classList.toggle("is-active", i === index));
    thumbs.forEach((thumb, i) => thumb.classList.toggle("is-active", i === index));

    const isVideo = view.src.toLowerCase().endsWith(".mp4");
    if (isVideo) {
      mainImg.style.display = "none";
      if (zoomHint) zoomHint.style.display = "none";
      mainVideo.style.display = "block";
      if (view.poster) {
        mainVideo.poster = view.poster;
      }
      if (!mainVideo.src.endsWith(view.src)) {
        mainVideo.src = view.src;
      }
      mainVideo.currentTime = 0;
      mainVideo.play().catch(() => {});
      if (caption) caption.innerHTML = view.caption;
    } else {
      mainVideo.pause();
      mainVideo.style.display = "none";
      mainImg.style.display = "block";
      if (zoomHint) zoomHint.style.display = "";

      if (immediate) {
        mainImg.src = view.src;
        mainImg.dataset.fullSrc = view.src;
        mainImg.alt = view.alt;
        if (caption) caption.innerHTML = view.caption;
        mainImg.style.opacity = "1";
        mainImg.style.transform = "scale(1)";
      } else {
        mainImg.style.opacity = "0.2";
        mainImg.style.transform = "scale(0.98)";

        setTimeout(() => {
          mainImg.src = view.src;
          mainImg.dataset.fullSrc = view.src;
          mainImg.alt = view.alt;
          if (caption) caption.innerHTML = view.caption;
          mainImg.style.opacity = "1";
          mainImg.style.transform = "scale(1)";
        }, 120);
      }
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectView(index));
  });

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => selectView(index));
  });

  selectView(0, true);
});

/* ---------- Mobile Navigation Drawer ---------- */
const mobileMenuBtn = document.querySelector(".nav-menu-btn");
const mobileDrawer = document.querySelector("#mobile-nav-drawer");
if (mobileMenuBtn && mobileDrawer) {
  const menuIcon = mobileMenuBtn.querySelector(".menu-icon");
  function toggleDrawer() {
    const isOpen = mobileDrawer.classList.toggle("is-open");
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    if (menuIcon) menuIcon.textContent = isOpen ? "✕" : "☰";
  }
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDrawer();
  });
  mobileDrawer.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileDrawer.classList.remove("is-open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      if (menuIcon) menuIcon.textContent = "☰";
    });
  });
  document.addEventListener("click", (e) => {
    if (mobileDrawer.classList.contains("is-open") && !mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileDrawer.classList.remove("is-open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      if (menuIcon) menuIcon.textContent = "☰";
    }
  });
}

/* ---------- Floating Scroll Navigation Controls ---------- */
const fallbackTopBtn = document.getElementById("scroll-top-btn");
const fallbackBottomBtn = document.getElementById("scroll-bottom-btn");
if (fallbackTopBtn) {
  fallbackTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
if (fallbackBottomBtn) {
  fallbackBottomBtn.addEventListener("click", () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }));
}


