'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // In a real app, you'd route to `/search?q=${query}`
      // For now we'll route to a search page or just alert if we don't have one
      router.push(`/?search=${encodeURIComponent(query.trim())}#live`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative w-full max-w-2xl mx-auto mt-6 group animate-fade-in-up" 
      style={{ animationDelay: '0.4s' }}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for matches, channels, or sports..." 
        className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-full py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-xl"
      />
      <button 
        type="submit" 
        className="absolute inset-y-1.5 right-1.5 bg-primary hover:bg-primary-hover text-black font-bold px-6 rounded-full transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,200,83,0.3)]"
      >
        Search
      </button>
    </form>
  );
}
