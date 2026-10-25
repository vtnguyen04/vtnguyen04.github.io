/* ============================================================
   Lightbox & Media Zoom Controller
   ============================================================ */

export function initLightbox() {
  const lightbox = document.querySelector("#media-lightbox");
  if (!lightbox) return;

  const lightboxContent = lightbox.querySelector(".media-lightbox-content");
  const lightboxClose = lightbox.querySelector(".media-lightbox-close");
  const zoomableMedia = document.querySelectorAll("#research .project-figure:not([data-gallery]):not([data-album]) img, #projects .project-figure:not([data-gallery]):not([data-album]) img, .showcase-main-figure img, .award-cert-thumb img, .zoomable-media");
  const galleries = document.querySelectorAll("#research [data-gallery]");

  function openLightbox(media) {
    const image = document.createElement("img");
    image.src = media.dataset.fullSrc || media.currentSrc || media.src;
    image.alt = media.alt || "Enlarged media preview";
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

  document.querySelectorAll(".award-cert-thumb").forEach((thumb) => {
    thumb.addEventListener("click", (event) => {
      const img = thumb.querySelector("img");
      if (img && event.target !== img) {
        openLightbox(img);
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

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    lightboxContent.replaceChildren();
  });
}
