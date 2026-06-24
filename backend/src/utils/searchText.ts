const ARMENIAN_TO_LATIN: Record<string, string> = {
  ա: 'a',
  բ: 'b',
  գ: 'g',
  դ: 'd',
  ե: 'e',
  զ: 'z',
  է: 'e',
  ը: 'y',
  թ: 't',
  ժ: 'zh',
  ի: 'i',
  լ: 'l',
  խ: 'kh',
  ծ: 'ts',
  կ: 'k',
  հ: 'h',
  ձ: 'dz',
  ղ: 'gh',
  ճ: 'tch',
  մ: 'm',
  յ: 'y',
  ն: 'n',
  շ: 'sh',
  ո: 'o',
  չ: 'ch',
  պ: 'p',
  ջ: 'j',
  ռ: 'r',
  ս: 's',
  վ: 'v',
  տ: 't',
  ր: 'r',
  ց: 'ts',
  ւ: 'v',
  փ: 'p',
  ք: 'q',
  օ: 'o',
  ֆ: 'f',
  Ա: 'a',
  Բ: 'b',
  Գ: 'g',
  Դ: 'd',
  Ե: 'e',
  Զ: 'z',
  Է: 'e',
  Ը: 'y',
  Թ: 't',
  Ժ: 'zh',
  Ի: 'i',
  Լ: 'l',
  Խ: 'kh',
  Ծ: 'ts',
  Կ: 'k',
  Հ: 'h',
  Ձ: 'dz',
  Ղ: 'gh',
  Ճ: 'tch',
  Մ: 'm',
  Յ: 'y',
  Ն: 'n',
  Շ: 'sh',
  Ո: 'o',
  Չ: 'ch',
  Պ: 'p',
  Ջ: 'j',
  Ռ: 'r',
  Ս: 's',
  Վ: 'v',
  Տ: 't',
  Ր: 'r',
  Ց: 'ts',
  Ւ: 'v',
  Փ: 'p',
  Ք: 'q',
  Օ: 'o',
  Ֆ: 'f',
};

const LATIN_EQUIVALENTS: Record<string, string[]> = {
  kh: ['x', 'h'],
  zh: ['j'],
  tch: ['ch', 'c'],
  dz: ['z'],
  ts: ['c', 'z'],
  sh: ['s'],
  ch: ['tch'],
  q: ['k'],
  y: ['i', 'j'],
  ev: ['ew', 'ev'],
};

const ARMENIAN_CHAR_PATTERN = /[\u0531-\u0587]/;

export function containsArmenian(text: string): boolean {
  return ARMENIAN_CHAR_PATTERN.test(text);
}

export function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function transliterateArmenianToLatin(text: string): string {
  let result = text.replace(/և/gi, 'ev');

  result = Array.from(result)
    .map((char) => ARMENIAN_TO_LATIN[char] ?? char)
    .join('');

  return normalizeWhitespace(result.toLowerCase());
}

export function expandLatinVariants(text: string): string[] {
  const normalized = normalizeWhitespace(text.toLowerCase());
  const variants = new Set<string>([normalized]);

  for (const [source, replacements] of Object.entries(LATIN_EQUIVALENTS)) {
    if (normalized.includes(source)) {
      for (const replacement of replacements) {
        variants.add(normalized.replaceAll(source, replacement));
      }
    }
  }

  return Array.from(variants);
}

export function buildSearchTokens(...texts: string[]): string[] {
  const tokens = new Set<string>();

  for (const rawText of texts) {
    const text = normalizeWhitespace(rawText);
    if (!text) {
      continue;
    }

    const lower = text.toLowerCase();
    tokens.add(lower);

    if (containsArmenian(text)) {
      tokens.add(transliterateArmenianToLatin(text));
    } else {
      for (const variant of expandLatinVariants(lower)) {
        tokens.add(variant);
      }
    }
  }

  return Array.from(tokens).filter(Boolean);
}

export function buildSearchText(...texts: string[]): string {
  return buildSearchTokens(...texts).join(' ');
}

export function createSearchRegex(query: string): RegExp {
  const tokens = buildSearchTokens(query);

  if (tokens.length === 0) {
    return /.^/;
  }

  const pattern = tokens
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  return new RegExp(pattern, 'i');
}

export function matchesSearchText(searchText: string, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  return createSearchRegex(query).test(searchText);
}

export function slugify(text: string): string {
  return transliterateArmenianToLatin(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
