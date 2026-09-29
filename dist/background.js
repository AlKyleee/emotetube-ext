const API_URL = "https://www.emotetube.com/api/emotes";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "EMOTETUBE_GET_EMOTES") {
    return;
  }

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Emote API request failed: ${response.status}`);
      }

      return response.json();
    })
    .then((payload) => {
      sendResponse(payload);
    })
    .catch((error) => {
      sendResponse({
        error: error instanceof Error ? error.message : String(error),
      });
    });

  return true;
});