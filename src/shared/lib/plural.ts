/** Russian pluralization: pick [one, few, many] by count. */
export function pluralRu(n: number, forms: [string, string, string]): string {
  const m10 = n % 10;
  const m100 = n % 100;

  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];

  return forms[2];
}

/** "статья / статьи / статей" for article counts. */
export function pluralArticles(n: number): string {
  return pluralRu(n, ["статья", "статьи", "статей"]);
}

/** "слово / слова / слов" for word counts. */
export function pluralWords(n: number): string {
  return pluralRu(n, ["слово", "слова", "слов"]);
}
