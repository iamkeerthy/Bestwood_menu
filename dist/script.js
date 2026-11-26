const navigation = document.querySelector(".category-nav");
const search = document.querySelector(".search-wrap");
const searchInput = document.querySelector("#menu-search");
const searchStatus = document.querySelector(".search-status");
const noResults = document.querySelector("#no-results");
const menuCards = [...document.querySelectorAll("[data-menu-card]")];
const menuSections = [...document.querySelectorAll("[data-menu-section]")];

function normalise(value) {
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}

const menuItems = [...document.querySelectorAll("[data-menu-item]")].map((item) => {
  const cardTitle = item.closest("[data-menu-card]").querySelector(":scope > h3");
  const sectionTitle = item.closest("[data-menu-section]").querySelector("h2");
  const searchableText = normalise(
    [item.dataset.name, item.textContent, cardTitle?.textContent, sectionTitle.textContent].join(" ")
  );
  return { item, searchableText };
});

function filterMenu() {
  const query = normalise(searchInput.value);
  const words = query.split(/\s+/).filter(Boolean);
  let matches = 0;

  for (const { item, searchableText } of menuItems) {
    const matchesQuery = words.every((word) => searchableText.includes(word));
    item.hidden = !matchesQuery;
    if (matchesQuery) matches += 1;
  }

  for (const group of [...menuCards, ...menuSections]) {
    group.hidden = !group.querySelector("[data-menu-item]:not([hidden])");
  }

  noResults.hidden = matches > 0;
  searchStatus.classList.toggle("sr-only", matches === 0);
  searchStatus.textContent = query
    ? `${matches} ${matches === 1 ? "item" : "items"} found`
    : "";
}

searchInput.addEventListener("input", filterMenu);
document.querySelector("#clear-search").addEventListener("click", () => {
  searchInput.value = "";
  filterMenu();
  searchInput.focus();
});

navigation.addEventListener("click", (event) => {
  if (!event.target.closest(".category-link") || !searchInput.value) return;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  searchInput.value = "";
  filterMenu();
});

// Keep anchor targets below the sticky menu even when the buttons wrap.
if ("ResizeObserver" in window) {
  const navigationSize = new ResizeObserver(() => {
    document.documentElement.style.setProperty("--nav-height", `${navigation.offsetHeight}px`);
  });
  navigationSize.observe(navigation);
}

filterMenu();
search.hidden = false;
