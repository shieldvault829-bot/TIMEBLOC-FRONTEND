import './globals.css';
import { Inter } from 'next/font/google';
import PremiumNavbar from '@/components/PremiumNavbar';
import Logo from '@/components/Logo';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TimeBloc | Secure Digital Time Capsules',
  description: 'Military-grade encrypted social platform with auto-publish, stories, badges and more',
  keywords: 'encryption, security, social media, time capsule, auto-publish, badges',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className={`${inter.className} bg-dark-900 text-white`}>
        <PremiumNavbar />
        <main className="pt-16">
          {children}
        </main>
        {/* Global loading indicator */}
        <div id="global-loading" className="hidden fixed top-4 right-4 z-50">
          <Logo size={24} />
        </div>
      </body>
    </html>
  );
}