import Link from 'next/link';
import PremiumNavbar from '../components/PremiumNavbar';

export default function Custom500() {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <PremiumNavbar />
      <div className="pt-32 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-9xl font-bold text-red-500">500</h1>
        <h2 className="mt-4 text-3xl font-bold">Server Error</h2>
        <p className="mt-4 text-dark-300 max-w-md">
          Something went wrong on our end. Please try again later.
        </p>
        <Link 
          href="/"
          className="mt-8 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}