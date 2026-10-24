/* ============================================================
   Showcase Interactive Switcher (Multi-Tab & Thumbnails)
   ============================================================ */

export function initShowcases() {
  const showcases = document.querySelectorAll(".showcase-media-hub");

  showcases.forEach((hub) => {
    const tabs = hub.querySelectorAll(".showcase-tab");
    const thumbs = hub.querySelectorAll(".showcase-thumb");
    const mainImg = hub.querySelector(".showcase-main-img");
    const caption = hub.querySelector(".showcase-caption");

    const viewsData = [];
    thumbs.forEach((thumb) => {
      viewsData.push({
        src: thumb.dataset.src || thumb.querySelector("img").src,
        alt: thumb.dataset.alt || thumb.querySelector("img").alt,
        caption: thumb.dataset.caption || "",
      });
    });

    function selectView(index) {
      if (!viewsData[index]) return;
      tabs.forEach((tab, i) => tab.classList.toggle("is-active", i === index));
      thumbs.forEach((thumb, i) => thumb.classList.toggle("is-active", i === index));

      mainImg.style.opacity = "0.2";
      mainImg.style.transform = "scale(0.98)";

      setTimeout(() => {
        mainImg.src = viewsData[index].src;
        mainImg.dataset.fullSrc = viewsData[index].src;
        mainImg.alt = viewsData[index].alt;
        if (caption) caption.innerHTML = viewsData[index].caption;
        mainImg.style.opacity = "1";
        mainImg.style.transform = "scale(1)";
      }, 120);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectView(index));
    });

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => selectView(index));
    });
  });
}
