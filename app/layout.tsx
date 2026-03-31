import './globals.css';
import type { Metadata, Viewport } from 'next';
import { SITE_CONFIG } from './config/site';

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.nome} | Gás e Água com entrega rápida`,
    template: `%s | ${SITE_CONFIG.nome}`,
  },
  description:
    'Peça gás e água com rapidez e praticidade. Entrega rápida, pedido online e acompanhamento em tempo real.',
  keywords: [
    'gás',
    'água',
    'entrega de gás',
    'gás jacareí',
    'gás são josé dos campos',
    'água 20 litros',
    'distribuidora de gás',
  ],
  authors: [{ name: SITE_CONFIG.nome }],
  metadataBase: new URL('https://villagaz.com.br'),
  openGraph: {
    title: `${SITE_CONFIG.nome} | Pedido online de gás e água`,
    description:
      'Faça seu pedido de gás e água online com entrega rápida e acompanhe em tempo real.',
    url: 'https://villagaz.com.br',
    siteName: SITE_CONFIG.nome,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.nome,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#facc15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#fff7ed] text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}