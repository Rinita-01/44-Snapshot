const DEFAULT_FOLDER_COLOR = "#ffffff";

export function normalizeFolderColor(color) {
  if (typeof color !== "string") return DEFAULT_FOLDER_COLOR;

  const normalized = color.trim();

  if (!normalized) return DEFAULT_FOLDER_COLOR;

  return normalized;
}

function normalizeHex(hexColor) {
  const color = normalizeFolderColor(hexColor).replace("#", "");

  if (color.length === 3) {
    return color.split("").map((value) => value + value).join("");
  }

  if (color.length === 6) {
    return color;
  }

  return DEFAULT_FOLDER_COLOR.replace("#", "");
}

export function getFolderTextColor(color) {
  const hex = normalizeHex(color);
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness >= 160 ? "#0f172a" : "#ffffff";
}

export function getFolderMutedTextColor(color) {
  return getFolderTextColor(color) === "#ffffff" ? "rgba(255, 255, 255, 0.78)" : "#475569";
}

export { DEFAULT_FOLDER_COLOR };
