import { buildSearchTokens } from './searchText';

export function buildSearchWhere(search: string | undefined): { OR: { searchText: { contains: string } }[] } | undefined {
  if (!search?.trim()) {
    return undefined;
  }

  const tokens = buildSearchTokens(search);

  if (tokens.length === 0) {
    return undefined;
  }

  return {
    OR: tokens.map((token) => ({ searchText: { contains: token } })),
  };
}
