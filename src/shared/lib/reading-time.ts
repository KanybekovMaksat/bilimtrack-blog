/** Words in a chunk of text (whitespace-separated, empty-safe). */
export function countWords(text: string): number {
  const trimmed = text.trim();

  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
}

/** Reading time in minutes (~200 wpm, floor of 1). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
