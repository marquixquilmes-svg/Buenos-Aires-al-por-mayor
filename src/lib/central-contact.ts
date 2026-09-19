export const CENTRAL_CONTACT = {
  whatsapp: '+5491172502826',
  whatsappUrl: 'https://wa.me/5491172502826',
  instagram: '@marquixquilmes',
  instagramUrl: 'https://instagram.com/marquixquilmes',
} as const;

export function buildWhatsAppOrderMessage(orderId: string, summary: string) {
  return `${CENTRAL_CONTACT.whatsappUrl}?text=${encodeURIComponent(`Buenos Aires al por mayor - Pedido ${orderId}\n${summary}`)}`;
}
