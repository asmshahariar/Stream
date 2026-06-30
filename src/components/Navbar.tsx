import Link from 'next/link';
import { Search, Tv } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-card sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl">
              <Tv className="w-8 h-8" />
              <span>LiveTV</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link href="/#categories" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Categories</Link>
                <Link href="/#live" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Live
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/search" className="text-gray-300 hover:text-primary p-2">
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
