import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Biddable and Coffee',
  description: 'Internal dashboard for programmatic market pulse.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
