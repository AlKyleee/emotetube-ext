export function setupEmoteTubeSearch(category: HTMLElement) {
  const searchPanel = document.querySelector("#search-panel");

  if (!(searchPanel instanceof HTMLElement)) {
    return;
  }

  const searchInput = searchPanel.querySelector("input");

  if (!(searchInput instanceof HTMLInputElement)) {
    return;
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    console.log("Search:", query);

    // Keep the EmoteTube category visible
    category.style.display = "";

    const emotes = category.querySelectorAll(
      "[data-emotetube-emote]"
    );

    emotes.forEach((emote) => {
      if (!(emote instanceof HTMLElement)) {
        return;
      }

      const name = (
        emote.getAttribute("aria-label") ?? ""
      ).toLowerCase();

      emote.style.display =
        query === "" || name.includes(query)
          ? ""
          : "none";
    });
  });
}