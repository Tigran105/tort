export const siteConfig = {
  name: 'Տորթերի խանութ',
  title: 'Տորթերի խանութ | Անհատական տորթերի պատվեր',
  description:
    '\u055a\u0561\u057f\u057e\u056b\u0580\u0565\u0584 \u056e\u0576\u0576\u0564\u0575\u0561\u0576, \u0570\u0561\u0580\u057d\u0561\u0576\u0565\u056f\u0561\u0576, \u0574\u0561\u0576\u056f\u0561\u056f\u0561\u0576 \u0587 \u0561\u0574\u0565\u0576\u0585\u0580\u0575\u0561 / \u0569\u0565\u0575\u056b \u057d\u0565\u056d\u0561\u0576\u056b \u057f\u0578\u0580\u0565\u0580\u0589 \u0531\u0576\u0570\u0561\u057f\u0561\u056f\u0561\u0576 \u057a\u0561\u057f\u057e\u056b\u0580\u0578\u0582\u0574 \u056f\u0561\u0574 \u057a\u0561\u057f\u0580\u0561\u057d\u057f \u0570\u0561\u057d\u0563\u0561\u056c\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0561\u056f\u0561\u0576\u0589',
  keywords: [
    'տորթ',
    'tort',
    'tsnndyan tort',
    'harsanekan tort',
    'cake shop',
    'bakery',
    'Yerevan cakes',
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  phone: process.env.NEXT_PUBLIC_PHONE || '+37400000000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '37400000000',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || 'https://instagram.com',
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    '\u0532\u0561\u0580\u0565\u057e, \u0571\u0561\u0576\u056f\u0561\u0576\u0578\u0582\u0574 \u0565\u0576 \u057a\u0561\u057f\u057e\u056b\u0580\u0565\u056c \u057f\u0578\u0580\u057f\u0568\u0589 \u053d\u0576\u0564\u0580\u0578\u0582\u0574 \u0565\u0576 \u056f\u0561\u057a \u0570\u0561\u057d\u057f\u0561\u057f\u0565\u056c\u0589',
};

export function getWhatsAppUrl(): string {
  const text = encodeURIComponent(siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${text}`;
}

export function getPhoneUrl(): string {
  return `tel:${siteConfig.phone.replace(/\s/g, '')}`;
}
