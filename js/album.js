/* ============================================================
   3D Album Stack Component
   ============================================================ */

export function initAlbums() {
  const albums = document.querySelectorAll("[data-album]");

  albums.forEach((album) => {
    const trigger = album.querySelector(".album-stack");
    const photos = [...album.querySelectorAll(".album-photo")];
    const prevBtn = album.querySelector(".album-prev");
    const nextBtn = album.querySelector(".album-next");
    const counter = album.querySelector(".album-counter");
    if (!trigger || photos.length === 0) return;

    let active = 0;
    const total = photos.length;
    let timer = null;
    let touchX = null;

    function render() {
      photos.forEach((photo, i) => {
        const depth = (i - active + total) % total;
        photo.setAttribute("data-depth", String(depth));
      });
      if (counter) counter.textContent = `${active + 1} / ${total}`;
    }

    function advance(step) {
      active = (active + step + total) % total;
      render();
    }

    function start() {
      stop();
      timer = setInterval(() => advance(1), 3800);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        advance(-1);
        start();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        advance(1);
        start();
      });
    }

    // Clicking anywhere on the album stack advances to the next photo
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      advance(1);
      start();
    });

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
}
