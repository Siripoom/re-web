import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/์navbar/page';
import Footer from '../components/footer/page';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ruby Real Estate',
  description: 'Find your dream home in Phuket',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col font-sans bg-gray-50`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}