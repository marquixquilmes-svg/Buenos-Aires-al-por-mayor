import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Buenos Aires al por mayor',
  description: 'Catálogo mayorista y comercio online.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
