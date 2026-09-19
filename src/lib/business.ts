export const BUSINESS_CONTACT = {
  brand: 'Buenos Aires al por mayor',
  instagramHandle: '@marquixquilmes',
  instagramUrl: 'https://www.instagram.com/marquixquilmes/',
  whatsappNumber: '+5491172502826',
  whatsappUrl: 'https://wa.me/5491172502826',
} as const;

export function buildWhatsAppMessage(message = 'Hola, quiero consultar por productos mayoristas.') {
  return `${BUSINESS_CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
