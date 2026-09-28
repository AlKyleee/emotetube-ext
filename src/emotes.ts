export type Emote = {
  name: string;
  url: string;
};

export const EMOTES: Emote[] = [
  {
    name: "waga",
    url: chrome.runtime.getURL("emotes/waga.avif"),
  },
  {
    name: "xdd",
    url: chrome.runtime.getURL("emotes/xdd.avif"),
  },
  {
    name: "WAJUJU",
    url: chrome.runtime.getURL("emotes/wajuju.avif"),
  },
  {
    name: "LETSGO",
    url: chrome.runtime.getURL("emotes/letsgo.avif"),
  },
  {
    name: "AINTNOWAY",
    url: chrome.runtime.getURL("emotes/aintnoway.avif"),
  },
  {
    name: "....",
    url: chrome.runtime.getURL("emotes/.....avif"),
  }
];