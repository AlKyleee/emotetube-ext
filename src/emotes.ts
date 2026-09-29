export type Emote = {
  name: string;
  url: string;
};

declare const chrome: {
  runtime: {
    sendMessage(message: { type: string }): Promise<unknown>;
  };
};

export const EMOTES: Emote[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function loadEmotes(): Promise<void> {
  const response: unknown = await chrome.runtime.sendMessage({
    type: "EMOTETUBE_GET_EMOTES",
  });

  if (!isRecord(response)) {
    throw new Error("The emote API returned an invalid response.");
  }

  if (typeof response.error === "string") {
    throw new Error(response.error);
  }

  if (!Array.isArray(response.emotes)) {
    throw new Error("The emote API response did not contain an emote list.");
  }

  const emotes = response.emotes.flatMap((value): Emote[] => {
    if (
      !isRecord(value) ||
      typeof value.name !== "string" ||
      !value.name ||
      typeof value.url !== "string"
    ) {
      return [];
    }

    try {
      if (new URL(value.url).protocol !== "https:") {
        return [];
      }
    } catch {
      return [];
    }

    return [{ name: value.name, url: value.url }];
  });

  if (emotes.length === 0) {
    throw new Error("The emote API returned no valid emotes.");
  }

  EMOTES.splice(0, EMOTES.length, ...emotes);
}