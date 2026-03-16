import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Home, List, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Lost Items', path: '/lost', icon: List },
    { name: 'Found Items', path: '/found', icon: Search },
    { name: 'Post Lost', path: '/post-lost', icon: PlusCircle },
    { name: 'Post Found', path: '/post-found', icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight sm:block">Campus L&F</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-black text-white" 
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
