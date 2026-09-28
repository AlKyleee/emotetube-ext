# EmoteTube Extension

Custom emotes for YouTube Live Chat.

EmoteTube is a Chrome extension that adds EmoteTube emotes to the YouTube Live Chat emoji picker and replaces matching emote names in chat messages with images.

## Current Features

- Adds an **EmoteTube** category to the YouTube Live Chat emoji picker.
- Places the EmoteTube category before YouTube's built-in emoji category.
- Displays custom EmoteTube emotes in the picker.
- Clicking an emote inserts its name into the chatbox.
- Adds a space after inserted emote names.
- Replaces matching emote names in chat messages with the corresponding emote image.
- Emote matching is case-sensitive and uses whole-word/token matching.
- Shows a larger emote preview and emote name when hovering over an EmoteTube emote.
- Uses a `MutationObserver` to handle YouTube's dynamically changing Live Chat DOM.

## Emote Matching

Emote names are replaced only when they appear as their own token.

Examples:

```text
waga          -> replaced
hello waga    -> replaced
waga!         -> replaced
(waga)        -> replaced

Waga          -> not replaced
WAGA          -> not replaced
wagaburger    -> not replaced
mywaga        -> not replaced
```

The same matching behavior should apply to future emotes.

## Project Structure

```text
src/
├── content.ts
├── emotes.ts
├── category.ts
├── emoteInsert.ts
└── emoteHover.ts

public/
└── emotes/
```

### `content.ts`

Main content script.

Responsible for:

- Watching the YouTube Live Chat DOM.
- Processing existing and newly added chat messages.
- Calling the picker/category functionality.

### `emotes.ts`

Contains the EmoteTube emote definitions.

Example:

```ts
export type Emote = {
  name: string;
  url: string;
};

export const EMOTES: Emote[] = [
  {
    name: "waga",
    url: chrome.runtime.getURL("emotes/waga.avif"),
  },
];
```

### `category.ts`

Builds the EmoteTube category inside YouTube's emoji picker.

Responsible for:

- Creating the EmoteTube category.
- Creating the title and emoji container.
- Adding EmoteTube emotes.
- Handling picker emote clicks and hover previews.

### `emoteInsert.ts`

Handles inserting an emote name into the YouTube chat input.

### `emoteHover.ts`

Creates and manages the custom hover preview used for EmoteTube emotes.

## Current Emotes

The initial global emotes are:

- `AINTNOWAY`
- `LETSGO`
- `waga`
- `WAJUJU`
- `xdd`

More emotes will be added later.

## Development

This project uses:

- TypeScript
- Vite
- Chrome Extension Manifest V3

Chrome content scripts can modify the DOM of pages where the extension has access, which is the mechanism currently used to integrate with YouTube Live Chat. citeturn482632search11turn482632search5

### Build

Install dependencies:

```bash
npm install
```

Build the extension:

```bash
npm run build
```

The generated extension files are placed in the project's `dist/` directory.

### Load in Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project's `dist/` directory.
5. Open a YouTube Live Chat page and test the extension.

## Planned

- Dynamically load global emotes instead of keeping the list entirely hardcoded.
- Connect the extension to the EmoteTube backend.
- Store emote metadata in Supabase.
- Store emote images in Cloudflare R2.
- Use the EmoteTube CDN for emote images.
- Improve integration with YouTube's emoji picker search.
- Support channel-specific emote sets.
- Add user authentication and emote management through the EmoteTube website.

## Architecture

The planned architecture is:

```text
EmoteTube Website
      |
      v
   Supabase
      |
      | emote metadata
      v
 Chrome Extension
      |
      | image URL
      v
Cloudflare R2 / CDN
```

Supabase will be used for metadata and application data, while Cloudflare R2 will store the actual image files.

## Status

**Early development / prototype**

YouTube's Live Chat DOM is not a stable public extension API, so DOM selectors and picker behavior may need updates as YouTube changes its interface.
