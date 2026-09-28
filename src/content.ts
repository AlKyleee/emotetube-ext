import { EMOTES, type Emote } from "./emotes";
import { addEmoteTubePickerCategory } from "./category"
import { connectEmoteHover, createEmoteHoverPreview } from "./emoteHover";

console.log("emotetube extension loaded!");


function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createEmoteRegex(emotes: Emote[]): RegExp {
  const names = emotes
    .map((emote) => escapeRegex(emote.name))
    .join("|");

  return new RegExp(
    `(?<![A-Za-z0-9_])(${names})(?![A-Za-z0-9_])`,
    "g"
  );
}

const EMOTE_REGEX = createEmoteRegex(EMOTES);

function replaceEmotes(message: HTMLElement) {
  const messageContainer = message.querySelector("#message");

  if (!(messageContainer instanceof HTMLElement)) {
    return;
  }

  // Don't process if there are already emote images
  if (messageContainer.querySelector("img[data-ytwaga-emote]")) {
    return;
  }

  const walker = document.createTreeWalker(
    messageContainer,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node instanceof Text) {
      textNodes.push(node);
    }
  }

  // Create ONE preview for this message
  const emoteHoverPreview = createEmoteHoverPreview();

  for (const textNode of textNodes) {
    const text = textNode.textContent;

    if (!text) {
      continue;
    }

    EMOTE_REGEX.lastIndex = 0;

    if (!EMOTE_REGEX.test(text)) {
      continue;
    }

    EMOTE_REGEX.lastIndex = 0;

    const fragment = document.createDocumentFragment();

    let lastIndex = 0;

    text.replace(
      EMOTE_REGEX,
      (
        match: string,
        emoteName: string,
        offset: number
      ) => {
        if (offset > lastIndex) {
          fragment.appendChild(
            document.createTextNode(
              text.slice(lastIndex, offset)
            )
          );
        }

        const emote = EMOTES.find(
          (item) => item.name === emoteName
        );

        if (!emote) {
          return match;
        }

        const img = document.createElement("img");

        connectEmoteHover(img, emote, emoteHoverPreview);

        img.src = emote.url;
        img.alt = emote.name;

        img.dataset.ytwagaEmote = "true";

        img.style.height = "32px";
        img.style.objectFit = "contain";
        img.style.verticalAlign = "middle";
        img.style.display = "inline-block";

        img.draggable = false;

        fragment.appendChild(img);

        lastIndex = offset + match.length;

        return match;
      }
    );

    if (lastIndex < text.length) {
      fragment.appendChild(
        document.createTextNode(
          text.slice(lastIndex)
        )
      );
    }

    textNode.replaceWith(fragment);
  }
}

function centerAuthorPhoto(message: HTMLElement) {
  const authorPhoto = message.querySelector("#author-photo");

  if (!(authorPhoto instanceof HTMLElement)) {
    return;
  }

  authorPhoto.style.alignSelf = "center";
}

function processMessage(message: HTMLElement) {
  replaceEmotes(message);
  centerAuthorPhoto(message);
}

function processElement(element: HTMLElement) {
  if (
    element.tagName.toLowerCase() ===
    "yt-live-chat-text-message-renderer"
  ) {
    processMessage(element);
  }

  const messages = element.querySelectorAll(
    "yt-live-chat-text-message-renderer"
  );

  messages.forEach((message) => {
    processMessage(message as HTMLElement);
  });
}




// Process existing messages
document
  .querySelectorAll("yt-live-chat-text-message-renderer")
  .forEach((message) => {
    processMessage(message as HTMLElement);
  });

// Watch the chat for changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // New elements
    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLElement) {
        processElement(node);
      }
    }

    // Existing elements whose contents changed
    if (mutation.type === "childList" && mutation.target instanceof Element) 
    {
      const message = mutation.target.closest("yt-live-chat-text-message-renderer");

      if (message instanceof HTMLElement) {
        processMessage(message);
      }
    }

    // Elements whose children changed
    if (
      mutation.type === "childList" &&
      mutation.target instanceof HTMLElement
    ) {
      const message = mutation.target.closest(
        "yt-live-chat-text-message-renderer"
      );

      if (message instanceof HTMLElement) {
        processMessage(message);
      }
    }
  }
  addEmoteTubePickerCategory();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

console.log("emotetube is watching Live Chat!");