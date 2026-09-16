(() => {
  "use strict";

  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navMenu.hidden = open;
    });
  }

  // Keep the footer copyright current. The markup carries a year so the page
  // still reads correctly with JavaScript off.
  const year = String(new Date().getFullYear());
  for (const el of document.querySelectorAll("[data-year]")) {
    el.textContent = year;
  }

  // Theme mode is "system" | "light" | "dark", persisted in localStorage.
  // The hidden #theme-toggle checkbox is the actual daisyUI theme-controller
  // that flips the theme via CSS :has(); an inline script next to it already
  // set its initial checked state (before first paint, to avoid a flash).
  // This wires up the System/Light/Dark dropdown, keeps "system" mode live
  // if the OS preference changes while the tab is open, and persists
  // explicit choices.
  const themeToggle = document.getElementById("theme-toggle");
  const themeButtons = document.querySelectorAll("[data-theme-mode]");
  const darkMq = window.matchMedia("(prefers-color-scheme: dark)");

  const getThemeMode = () => {
    try {
      return localStorage.getItem("theme-mode") || "system";
    } catch (e) {
      return "system";
    }
  };

  const applyThemeMode = (mode) => {
    const dark = mode === "dark" || (mode === "system" && darkMq.matches);
    if (themeToggle) themeToggle.checked = dark;
    for (const btn of themeButtons) {
      btn.classList.toggle("menu-active", btn.dataset.themeMode === mode);
    }
  };

  if (themeToggle && themeButtons.length) {
    applyThemeMode(getThemeMode());

    for (const btn of themeButtons) {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.themeMode;
        try {
          localStorage.setItem("theme-mode", mode);
        } catch (e) {
          // Storage disabled (private mode, etc.) — the choice still
          // applies for the current page, it just won't persist.
        }
        applyThemeMode(mode);
        btn.closest("details")?.removeAttribute("open");
      });
    }

    darkMq.addEventListener("change", () => {
      if (getThemeMode() === "system") applyThemeMode("system");
    });
  }
})();
