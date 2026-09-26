import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';

export const metadata: Metadata = {
  title: 'Buenos Aires al por mayor',
  description: 'Marketplace mayorista de Buenos Aires. Catálogos, pedidos y atención centralizada.',
  icons: { icon: '/brand-logo-square.jpg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><CartProvider>{children}</CartProvider></body></html>;
}
