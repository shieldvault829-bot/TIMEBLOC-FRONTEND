import './globals.css';  // ✅ Yeh line exist karni chahiye
import { Inter } from 'next/font/google';
import PremiumNavbar from '../components/PremiumNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TimeBloc - Secure Digital Time Capsules',
  description: 'Military-grade encrypted social platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-900 text-white antialiased`}>
        <PremiumNavbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}