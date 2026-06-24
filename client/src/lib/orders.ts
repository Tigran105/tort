import { postApi } from './api';
import type { CustomOrderPayload } from '@/types/builder';

export async function submitCustomOrder(payload: CustomOrderPayload) {
  return postApi('/orders', payload);
}
