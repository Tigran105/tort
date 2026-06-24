import type { ApiOrder } from '../types/order';

export interface OrderNotificationPayload {
  orderId: string;
  orderType: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryDate?: string;
  notes?: string;
  totalPrice?: number;
  details: string;
}

function formatOrderDetails(order: ApiOrder): string {
  if (order.orderType === 'custom' && order.customSelections) {
    const { tier, size, filling, fruit, nut } = order.customSelections;
    const parts = [
      tier?.name ? `Հարկեր: ${tier.name}` : null,
      size?.name ? `Չափս: ${size.name}` : null,
      filling?.name ? `Միջուկ: ${filling.name}` : null,
      fruit?.name ? `Մրգեր: ${fruit.name}` : null,
      nut?.name ? `Ընդեղեն: ${nut.name}` : null,
    ].filter(Boolean);

    return parts.join('\n');
  }

  return order.cake?.name ? `Տորթ: ${order.cake.name}` : 'Կատալոգային պատվեր';
}

export function buildOrderNotificationPayload(order: ApiOrder): OrderNotificationPayload {
  return {
    orderId: order._id,
    orderType: order.orderType,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    customerEmail: order.customer.email,
    deliveryDate: order.deliveryDate?.toISOString(),
    notes: order.notes ?? undefined,
    totalPrice: order.totalPrice,
    details: formatOrderDetails(order),
  };
}

function buildNotificationMessage(payload: OrderNotificationPayload): string {
  const lines = [
    '🎂 Նոր պատվեր',
    `ID: ${payload.orderId}`,
    `Տեսակ: ${payload.orderType === 'custom' ? 'Անհատական' : 'Կատալոգ'}`,
    `Հաճախորդ: ${payload.customerName}`,
    `Հեռ.: ${payload.customerPhone}`,
  ];

  if (payload.customerEmail) {
    lines.push(`Email: ${payload.customerEmail}`);
  }

  if (payload.deliveryDate) {
    lines.push(`Առաքման ամսաթիվ: ${payload.deliveryDate}`);
  }

  if (payload.totalPrice !== undefined) {
    lines.push(`Գին: ${payload.totalPrice} դր`);
  }

  lines.push('', payload.details);

  if (payload.notes) {
    lines.push('', `Նշումներ: ${payload.notes}`);
  }

  return lines.join('\n');
}

async function sendTelegramNotification(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[notifications] Telegram is not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)');
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${errorText}`);
  }
}

async function sendEmailNotification(
  payload: OrderNotificationPayload,
  message: string,
): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !notifyEmail) {
    console.warn('[notifications] Email is not configured (SMTP_* / NOTIFY_EMAIL)');
    return;
  }

  console.info('[notifications] Email notification ready to send', {
    to: notifyEmail,
    subject: `Նոր պատվեր #${payload.orderId}`,
    body: message,
    smtpHost,
    smtpPort,
    smtpUser,
  });
}

export async function notifyNewOrder(order: ApiOrder): Promise<void> {
  const payload = buildOrderNotificationPayload(order);
  const message = buildNotificationMessage(payload);

  const results = await Promise.allSettled([
    sendTelegramNotification(message),
    sendEmailNotification(payload, message),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[notifications] Failed to send notification:', result.reason);
    }
  }
}
