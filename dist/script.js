document.documentElement.classList.add("js");

const searchInput = document.querySelector("#menu-search");
const menuItems = [...document.querySelectorAll("[data-menu-item]")];
const menuCards = [...document.querySelectorAll("[data-menu-card]")];
const menuSections = [...document.querySelectorAll("[data-menu-section]")];
const searchStatus = document.querySelector(".search-status");
const noResults = document.querySelector("#no-results");
const clearSearch = document.querySelector("#clear-search");
const categoryLinks = [...document.querySelectorAll(".category-link")];

const normalise = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function filterMenu() {
  const query = normalise(searchInput.value);
  let matches = 0;

  menuItems.forEach((item) => {
    const searchableText = normalise(`${item.dataset.name || ""} ${item.textContent}`);
    const isMatch = !query || searchableText.includes(query);
    item.hidden = !isMatch;
    if (isMatch) matches += 1;
  });

  menuCards.forEach((card) => {
    const hasVisibleItem = [...card.querySelectorAll("[data-menu-item]")].some((item) => !item.hidden);
    card.hidden = !hasVisibleItem;
  });

  menuSections.forEach((section) => {
    const hasVisibleItem = [...section.querySelectorAll("[data-menu-item]")].some((item) => !item.hidden);
    section.hidden = !hasVisibleItem;
  });

  noResults.hidden = matches !== 0;
  searchStatus.textContent = query
    ? `${matches} ${matches === 1 ? "item" : "items"} found`
    : "";
}

searchInput?.addEventListener("input", filterMenu);
clearSearch?.addEventListener("click", () => {
  searchInput.value = "";
  filterMenu();
  searchInput.focus();
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    categoryLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  },
  { rootMargin: "-25% 0px -65%", threshold: [0, 0.1, 0.3] }
);

menuSections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8%", threshold: 0.08 }
);

menuCards.forEach((card) => revealObserver.observe(card));
