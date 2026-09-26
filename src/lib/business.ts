export const BUSINESS_CONTACT = {
  brand: 'Buenos Aires al por mayor',
  instagramHandle: '@buenosairesalpormayor',
  instagramUrl: 'https://www.instagram.com/buenosairesalpormayor/',
  whatsappNumber: '+5491172502826',
  whatsappUrl: 'https://wa.me/5491172502826',
  emails: ['info@buenosairesalpormayor.com', 'buenosairesalpormayor@gmail.com'],
} as const;

export function buildWhatsAppMessage(message = 'Hola, quiero consultar por productos mayoristas.') {
  return `${BUSINESS_CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
