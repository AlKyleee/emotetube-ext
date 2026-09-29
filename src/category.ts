import { EMOTES } from "./emotes";
import { insertEmoteIntoChat } from "./emoteInsert"
import { connectEmoteHover, createEmoteHoverPreview } from "./emoteHover";
import { setupEmoteTubeSearch } from "./search"

const emoteHoverPreview = createEmoteHoverPreview();

export function addEmoteTubePickerCategory() {
  const categories = document.querySelector("#categories");

  if (!(categories instanceof HTMLElement)) {
    return;
  }

  // Don't add our category more than once
  if (categories.querySelector("[data-emotetube-category]")) {
    return;
  }

  // Find YouTube's category
  const youtubeCategory = [
    ...categories.querySelectorAll(
      "yt-emoji-picker-category-renderer"
    ),
  ].find((category) => {
    const emojiContainer = category.querySelector("#emoji");

    return (
      emojiContainer instanceof HTMLElement &&
      emojiContainer.classList.contains("CATEGORY_TYPE_GLOBAL") &&
      emojiContainer.getAttribute("aria-label") === "YouTube"
    );
  });

  if (!(youtubeCategory instanceof HTMLElement)) {
    return;
  }

  // Wait until YouTube has actually populated the category
  const emojiContainer = youtubeCategory.querySelector("#emoji");

  if (!(emojiContainer instanceof HTMLElement)) {
    return;
  }

  if (emojiContainer.children.length === 0) {
    return;
  }

  // Create our category
  const category = document.createElement(
    "yt-emoji-picker-category-renderer"
  );

  category.classList.add(
    "style-scope",
    "yt-emoji-picker-renderer"
  );

  category.dataset.emotetubeCategory = "true";

  category.setAttribute("label", "EmoteTube");

  // Title
  const title = document.createElement("emotetube-formatted-string");

  title.id = "title";

  title.classList.add(
    "style-scope",
    "yt-emoji-picker-category-renderer"
  );

  const attributedString = document.createElement(
    "yt-attributed-string"
  );

  attributedString.classList.add(
    "style-scope",
    "yt-formatted-string"
  );

  attributedString.textContent = "EMOTETUBE";

  title.appendChild(attributedString);
  category.appendChild(title);

  // Emoji container
  const emoteContainer = document.createElement("div");

  emoteContainer.id = "emoji";

  emoteContainer.classList.add(
    "CATEGORY_TYPE_CUSTOM",
    "style-scope",
    "yt-emoji-picker-category-renderer"
  );

  emoteContainer.setAttribute(
    "aria-label",
    "EmoteTube"
  );


    for (const emote of EMOTES) {
      const img = document.createElement("img");

      img.classList.add(
          "style-scope",
          "yt-emoji-picker-category-renderer"
      );

      img.height = 24;
      img.src = emote.url;
      img.alt = emote.name;
      img.ariaLabel = emote.name.toLowerCase();

      // Prevent YouTube's emoji hover handler from seeing our image
      img.addEventListener(
        "mouseover",
        (event) => {
        event.stopPropagation();
        }
      );

      img.addEventListener("mousedown", (event) => {
        event.stopPropagation();
      });

      connectEmoteHover(img, emote, emoteHoverPreview);

      img.addEventListener("click", () => {
        insertEmoteIntoChat(emote);
      });

      img.dataset.emotetubeEmote = "true";
      img.dataset.emoteName = emote.name.toLowerCase();

      img.draggable = false;

      emoteContainer.appendChild(img);
    }



  category.appendChild(emoteContainer);
  setupEmoteTubeSearch(category);

  // Put EmoteTube BEFORE YouTube
  youtubeCategory.before(category);
}