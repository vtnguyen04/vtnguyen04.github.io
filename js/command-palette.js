/* ============================================================
   Command Palette Controller (⌘K / Ctrl+K) — 2026 Edition
   ============================================================ */

export function initCommandPalette() {
  const backdrop = document.getElementById("cmd-palette");
  const input = document.getElementById("cmd-input");
  const list = document.getElementById("cmd-list");
  const triggerBtns = document.querySelectorAll(".nav-cmd-btn");

  if (!backdrop || !input || !list) return;

  const items = [
    // Research Papers & Projects
    { title: "Sim-to-Real Traffic-JEPA (ECCV Oral, 1st Worldwide)", group: "Publications & Research", icon: "🏆", action: () => jumpTo("project-traffic-jepa") },
    { title: "JEPA Guided Diffusion (ECCV Poster, Rank 3)", group: "Publications & Research", icon: "🥉", action: () => jumpTo("project-traffic-forecast") },
    { title: "UniQuery: Cross-Domain Pedestrian Attribute (WACV)", group: "Publications & Research", icon: "❖", action: () => jumpTo("project-uniquery") },
    { title: "LENS: Attribute-Based Person Retrieval (WACV)", group: "Publications & Research", icon: "🎯", action: () => jumpTo("project-lens") },
    { title: "Perception-to-Planning YOLOv11 + Frenet (IEEE GTSD)", group: "Publications & Research", icon: "🚗", action: () => jumpTo("project-gtsd-2026") },
    { title: "Bosch Future Mobility Challenge (BFMC 2025 & 2026)", group: "Engineering", icon: "🏎️", action: () => jumpTo("projects") },
    
    // Quick Actions
    { title: "Download Full Curriculum Vitae (PDF)", group: "Quick Actions", icon: "📄", action: () => window.open("VoThanhNguyen_CV.pdf", "_blank") },
    { title: "Toggle Color Theme (Dark / Light)", group: "Quick Actions", icon: "🌓", action: () => toggleTheme() },
    { title: "Open Google Scholar Citations", group: "External Links", icon: "🎓", action: () => window.open("https://scholar.google.com/citations?user=WgjDCU4AAAAJ&hl=vi&authuser=1", "_blank") },
    { title: "Open OpenReview Profile", group: "External Links", icon: "📝", action: () => window.open("https://openreview.net/profile?id=%7EThanh_Nguyen_Vo1", "_blank") },
    { title: "Open GitHub Profile (@vtnguyen04)", group: "External Links", icon: "💻", action: () => window.open("https://github.com/vtnguyen04", "_blank") },
    { title: "Send Email (nguyenvothanh04@gmail.com)", group: "Contact", icon: "✉️", action: () => window.location.href = "mailto:nguyenvothanh04@gmail.com" },
  ];

  let selectedIndex = 0;
  let filteredItems = [...items];

  function openPalette() {
    backdrop.classList.add("is-open");
    input.value = "";
    filter("");
    input.focus();
  }

  function closePalette() {
    backdrop.classList.remove("is-open");
  }

  function jumpTo(elementId) {
    closePalette();
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function toggleTheme() {
    closePalette();
    const toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) toggleBtn.click();
  }

  function render() {
    list.innerHTML = "";
    if (filteredItems.length === 0) {
      list.innerHTML = `<li style="padding: 24px; text-align: center; color: var(--faint); font-size: .88rem;">No results found</li>`;
      return;
    }

    let currentGroup = "";
    filteredItems.forEach((item, index) => {
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        const groupEl = document.createElement("li");
        groupEl.className = "cmd-group-title";
        groupEl.textContent = currentGroup;
        list.appendChild(groupEl);
      }

      const li = document.createElement("li");
      li.className = `cmd-item ${index === selectedIndex ? "is-selected" : ""}`;
      li.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${item.icon}</span>
          <span>${item.title}</span>
        </div>
        <span class="cmd-item-badge">Jump ↵</span>
      `;

      li.addEventListener("click", () => {
        item.action();
      });

      li.addEventListener("mouseenter", () => {
        selectedIndex = index;
        updateSelection();
      });

      list.appendChild(li);
    });

    scrollSelectedIntoView();
  }

  function updateSelection() {
    const renderedItems = list.querySelectorAll(".cmd-item");
    renderedItems.forEach((el, idx) => {
      if (idx === selectedIndex) {
        el.classList.add("is-selected");
      } else {
        el.classList.remove("is-selected");
      }
    });
  }

  function scrollSelectedIntoView() {
    const selectedEl = list.querySelector(".cmd-item.is-selected");
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }

  function filter(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      filteredItems = [...items];
    } else {
      filteredItems = items.filter(it => 
        it.title.toLowerCase().includes(q) || 
        it.group.toLowerCase().includes(q)
      );
    }
    selectedIndex = 0;
    render();
  }

  // Trigger bindings
  triggerBtns.forEach(btn => {
    btn.addEventListener("click", openPalette);
  });

  // Global Keyboard Shortcut: ⌘K or Ctrl+K or '/'
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (backdrop.classList.contains("is-open")) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === "/" && document.activeElement !== input && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openPalette();
    } else if (e.key === "Escape" && backdrop.classList.contains("is-open")) {
      closePalette();
    }
  });

  // Input navigation inside palette
  input.addEventListener("input", (e) => {
    filter(e.target.value);
  });

  input.addEventListener("keydown", (e) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredItems.length;
      updateSelection();
      scrollSelectedIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
      updateSelection();
      scrollSelectedIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  });

  // Click outside to close
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closePalette();
    }
  });
}
