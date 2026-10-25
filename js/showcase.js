/* ============================================================
   Showcase Interactive Switcher (Multi-Tab, Video & Thumbnails)
   ============================================================ */

export function initShowcases() {
  const showcases = document.querySelectorAll(".showcase-media-hub");

  showcases.forEach((hub) => {
    const tabs = hub.querySelectorAll(".showcase-tab");
    const thumbs = hub.querySelectorAll(".showcase-thumb");
    const wrapper = hub.querySelector(".showcase-image-wrapper");
    const mainImg = hub.querySelector(".showcase-main-img");
    const zoomHint = hub.querySelector(".showcase-zoom-hint");
    const caption = hub.querySelector(".showcase-caption");

    if (!wrapper || !mainImg) return;

    // Create a reusable <video> element and optional chapter bar for .mp4 tabs
    const mainVideo = document.createElement("video");
    mainVideo.className = "showcase-main-video";
    mainVideo.controls = true;
    mainVideo.autoplay = true;
    mainVideo.loop = true;
    mainVideo.muted = true;
    mainVideo.playsInline = true;
    mainVideo.style.display = "none";
    wrapper.appendChild(mainVideo);

    const chapterBar = document.createElement("div");
    chapterBar.className = "showcase-video-chapters";
    chapterBar.style.display = "none";
    wrapper.parentElement.insertBefore(chapterBar, caption);

    const viewsData = [];
    thumbs.forEach((thumb) => {
      const imgEl = thumb.querySelector("img");
      viewsData.push({
        src: thumb.dataset.src || (imgEl ? imgEl.src : ""),
        poster: imgEl ? imgEl.src : "",
        alt: thumb.dataset.alt || (imgEl ? imgEl.alt : ""),
        caption: thumb.dataset.caption || "",
        chapters: thumb.dataset.chapters || "",
      });
    });

    function renderChapters(chaptersStr) {
      if (!chaptersStr) {
        chapterBar.style.display = "none";
        chapterBar.innerHTML = "";
        return;
      }
      const items = chaptersStr.split("|").map((part) => {
        const [sec, label] = part.split(":");
        return { time: parseFloat(sec) || 0, label: label || "" };
      });
      chapterBar.innerHTML =
        `<span class="chapter-bar-label">Interactive Flow Steps:</span>` +
        items
          .map(
            (it, idx) =>
              `<button type="button" class="chapter-pill${idx === 0 ? " is-active" : ""}" data-time="${it.time}">${it.label}</button>`
          )
          .join("");
      chapterBar.style.display = "flex";

      const pills = chapterBar.querySelectorAll(".chapter-pill");
      pills.forEach((pill) => {
        pill.addEventListener("click", () => {
          const t = parseFloat(pill.dataset.time) || 0;
          mainVideo.currentTime = t;
          mainVideo.play().catch(() => {});
          pills.forEach((p) => p.classList.toggle("is-active", p === pill));
        });
      });

      mainVideo.ontimeupdate = () => {
        const ct = mainVideo.currentTime;
        let activeIdx = 0;
        for (let i = 0; i < items.length; i++) {
          if (ct >= items[i].time - 0.1) activeIdx = i;
        }
        pills.forEach((p, idx) => p.classList.toggle("is-active", idx === activeIdx));
      };
    }

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
        renderChapters(view.chapters);
        if (caption) caption.innerHTML = view.caption;
      } else {
        mainVideo.pause();
        mainVideo.style.display = "none";
        chapterBar.style.display = "none";
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
          mainImg.style.opacity = "0.25";
          mainImg.style.transform = "scale(0.985)";

          setTimeout(() => {
            mainImg.src = view.src;
            mainImg.dataset.fullSrc = view.src;
            mainImg.alt = view.alt;
            if (caption) caption.innerHTML = view.caption;
            mainImg.style.opacity = "1";
            mainImg.style.transform = "scale(1)";
          }, 100);
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
}
