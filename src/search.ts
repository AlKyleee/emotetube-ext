export function setupEmoteTubeSearch(category: HTMLElement) {
  const searchPanel = document.querySelector("#search-panel");

  if (!(searchPanel instanceof HTMLElement)) {
    return;
  }

  const youtubeSearchInput = searchPanel.querySelector("input");

  if (!(youtubeSearchInput instanceof HTMLInputElement)) {
    return;
  }

  const searchInput = youtubeSearchInput.cloneNode(false) as HTMLInputElement;
  searchInput.value = "";
  searchInput.placeholder = "Search EmoteTube";
  searchInput.dataset.emotetubeSearch = "true";
  youtubeSearchInput.replaceWith(searchInput);

  document.addEventListener("input", (event) => {
    if (event.target !== searchInput) {
      return;
    }

    event.stopImmediatePropagation();

    const query = searchInput.value.toLowerCase().trim();
    console.log("Search:", query);

    const categories = category.closest("#categories");

    if (!(categories instanceof HTMLElement)) {
      return;
    }

    const categoriesWrapper = document.querySelector(
      "#categories-wrapper"
    );

    if (categoriesWrapper instanceof HTMLElement) {
      categoriesWrapper.style.display = query === "" ? "" : "block";
      categoriesWrapper.style.overflowY = query === "" ? "" : "auto";
    }

    categories
      .querySelectorAll<HTMLElement>(
        ":scope > yt-emoji-picker-category-renderer"
      )
      .forEach((pickerCategory) => {
        let displayedEmotes = 0;

        pickerCategory
          .querySelectorAll("#emoji img[aria-label]")
          .forEach((emote) => {
            if (!(emote instanceof HTMLElement)) {
              return;
            }

            const name = (
              emote.getAttribute("aria-label") ?? ""
            ).toLowerCase();

            const matches = query === "" || name.includes(query);
            emote.style.display = matches ? "" : "none";

            if (matches) {
              displayedEmotes += 1;
            }
          });

        pickerCategory.style.display =
          query === "" || displayedEmotes > 0
            ? ""
            : "none";
      });
  }, true);
}