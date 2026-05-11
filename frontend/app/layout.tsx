import type { Metadata } from 'next';
import './globals.css';
import ClickSpark from '@/components/effects/ClickSpark';
<<<<<<< HEAD
import { Providers } from './providers';
=======
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e

export const metadata: Metadata = {
  title: 'V.A.L.U.E — Value Assessment & Ledger for Usage Efficiency',
  description:
    'A premium financial intelligence platform for tracking, analyzing, and optimizing subscription value. Blockchain-verified. AI-powered.',
  keywords: ['subscription tracker', 'financial intelligence', 'value analytics', 'blockchain finance'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
<<<<<<< HEAD
        <Providers>
          <ClickSpark
            sparkColor="#ffffff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            {children}
          </ClickSpark>
        </Providers>
=======
        <ClickSpark
          sparkColor="#ffffff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          {children}
        </ClickSpark>
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      </body>
    </html>
  );
}
<<<<<<< HEAD

=======
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
