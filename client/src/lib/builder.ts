import { fetchApi } from './api';
import type { BuilderOptions } from '@/types/builder';

export async function getBuilderOptions(): Promise<BuilderOptions> {
  return fetchApi<BuilderOptions>('/builder-options');
}
