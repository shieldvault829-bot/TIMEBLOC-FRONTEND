// components/PremiumNavbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedLogo from './AnimatedLogo';
import { usePathname } from 'next/navigation';

// ✅ CORRECT: React-icons use karo (Heroicons se better)
import { 
  FiHome, 
  FiCompass, 
  FiPlusCircle, 
  FiHeart,
  FiUser,
  FiBell,
  FiSearch,
  FiShoppingCart
} from 'react-icons/fi';

const PremiumNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: FiHome, label: 'Home', href: '/' },
    { icon: FiSearch, label: 'Explore', href: '/explore' },
    { icon: FiPlusCircle, label: 'Create', href: '/create' },
    { icon: FiCompass, label: 'Discover', href: '/discover' },
    { icon: FiHeart, label: 'Activity', href: '/activity' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-lg border-b border-dark-700' : 'bg-dark-900'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Left - Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <AnimatedLogo size="md" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                TimeBloc
              </span>
              <span className="text-xs text-primary-500/70 group-hover:text-primary-400 transition-colors">
                beta
              </span>
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search capsules..."
                className="pl-10 pr-4 py-2 w-64 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Center - Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-500/10 text-primary-400' 
                      : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Right - User Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Create Post Button */}
            <Link 
              href="/create" 
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/20 animate-glow"
            >
              <FiPlusCircle className="w-5 h-5" />
              <span className="font-medium">Create</span>
            </Link>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors">
              <FiBell className="w-6 h-6 text-dark-300" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {notifications}
                </span>
              )}
            </button>
            
            {/* Cart for Premium Items */}
            <button className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors">
              <FiShoppingCart className="w-6 h-6 text-dark-300" />
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            
            {/* User Avatar with Frame */}
            <Link href="/profile" className="relative group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-dark-700 group-hover:border-primary-500 transition-colors">
                <img 
                  src="/avatars/robo-girl.png" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Frame */}
              <div className="absolute -inset-1 rounded-full border-2 border-amber-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              
              {/* Subscription Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  isActive ? 'text-primary-400' : 'text-dark-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavbar;