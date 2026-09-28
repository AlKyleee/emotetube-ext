import { EMOTES, type Emote } from "./emotes";

export function insertEmoteIntoChat(emote: Emote) {
  const inputRenderer = document.querySelector(
    "yt-live-chat-text-input-field-renderer#input"
  );

  if (!(inputRenderer instanceof HTMLElement)) {
    return;
  }

  const chatInput = inputRenderer.querySelector("div#input");

  if (!(chatInput instanceof HTMLElement)) {
    return;
  }

  chatInput.focus();

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    chatInput.appendChild(
      document.createTextNode(emote.name)
    );
  } else {
    const range = selection.getRangeAt(0);

    range.deleteContents();

    const textNode = document.createTextNode(`${emote.name} `);

    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  chatInput.dispatchEvent(
    new Event("input", {
      bubbles: true,
    })
  );
}