import { AppError } from '../middleware/errorHandler';

export function parseId(
  value: string | string[],
  message = 'Սխալ նույնականացուցիչ',
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number.parseInt(raw, 10);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(message, 400);
  }

  return id;
}

export function parseOptionalId(
  value: unknown,
  message = 'Սխալ նույնականացուցիչ',
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return parseId(String(value), message);
}
