import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Controle de Ativos',
  description: 'Sistema de Controle de Ativos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
