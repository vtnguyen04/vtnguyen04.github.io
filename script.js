const lightbox = document.querySelector("#media-lightbox");
const lightboxContent = lightbox.querySelector(".media-lightbox-content");
const lightboxClose = lightbox.querySelector(".media-lightbox-close");
const zoomableMedia = document.querySelectorAll("#research .project-figure:not([data-gallery]):not([data-album]) img");
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
  let front = 0;
  let timer;

  const shuffle = () => {
    front = (front + 1) % photos.length;
    photos.forEach((photo, index) => {
      photo.dataset.depth = (index - front + photos.length) % photos.length;
    });
  };
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setInterval(shuffle, 4000);
    }
  };

  trigger.addEventListener("click", () => openGallery(album));
  trigger.addEventListener("mouseenter", stop);
  trigger.addEventListener("mouseleave", start);
  trigger.addEventListener("focus", stop);
  trigger.addEventListener("blur", start);
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
