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

  const demo = document.querySelector("[data-verse-demo]");
  if (!demo) return;

  const gaps = Array.from(demo.querySelectorAll(".gap"));
  const status = demo.querySelector("[data-gap-status]");
  const reset = demo.querySelector("[data-gap-reset]");

  const remaining = () =>
    gaps.filter((gap) => gap.getAttribute("aria-pressed") !== "true").length;

  const render = () => {
    const left = remaining();
    if (left === 0) {
      status.textContent = "That is the whole idea. Recall first, read second.";
      reset.hidden = false;
      return;
    }
    status.textContent =
      left === 1 ? "1 word held back" : `${left} words held back`;
    reset.hidden = true;
  };

  gaps.forEach((gap) => {
    gap.addEventListener("click", () => {
      gap.setAttribute("aria-pressed", "true");
      render();
    });
  });

  reset.addEventListener("click", () => {
    gaps.forEach((gap) => gap.setAttribute("aria-pressed", "false"));
    render();
    gaps[0].focus();
  });

  render();
})();
