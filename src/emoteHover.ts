import type { Emote } from "./emotes";

export function createEmoteHoverPreview() {
    const preview = document.createElement("div");

    preview.dataset.emotetubePreview = "true";

    preview.style.position = "fixed";
    preview.style.display = "none";
    preview.style.flexDirection = "column";
    preview.style.alignItems = "center";
    preview.style.gap = "6px";
    preview.style.padding = "8px";
    preview.style.background = "#181818";
    preview.style.border = "1px solid #303030";
    preview.style.borderRadius = "8px";
    preview.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
    preview.style.zIndex = "999999";
    preview.style.pointerEvents = "none";

    const image = document.createElement("img");

    image.style.width = "64px";
    image.style.height = "64px";
    image.style.objectFit = "contain";
    image.draggable = false;

    const name = document.createElement("div");

    name.style.fontSize = "12px";
    name.style.color = "#fff";
    name.style.whiteSpace = "nowrap";

    preview.appendChild(image);
    preview.appendChild(name);

    document.body.appendChild(preview);

    return {
        preview,
        image,
        name,
    };
}

export function connectEmoteHover(
    image: HTMLImageElement,
    emote: Emote,
    emoteHoverPreview: ReturnType<typeof createEmoteHoverPreview>
) {
    image.addEventListener("mouseenter", () => {
        const rect = image.getBoundingClientRect();

        emoteHoverPreview.image.src = emote.url;
        emoteHoverPreview.image.alt = emote.name;
        emoteHoverPreview.name.textContent = emote.name;

        emoteHoverPreview.preview.style.display = "flex";
        emoteHoverPreview.preview.style.left = `${
            rect.left + rect.width / 2
        }px`;
        emoteHoverPreview.preview.style.top = `${rect.top - 8}px`;
        emoteHoverPreview.preview.style.transform = "translate(-50%, -100%)";
    });

    image.addEventListener("mouseleave", () => {
        emoteHoverPreview.preview.style.display = "none";
    });
}