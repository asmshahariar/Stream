'use client';

import { useState, useEffect } from 'react';
import ChannelCard from '@/components/ChannelCard';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchChannels();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchChannels = async () => {
    setLoading(true);
    try {
      // We will do client-side filtering for simplicity if we fetch all,
      // but an API is better. Since we don't have a specific search API yet,
      // we can fetch all channels and filter, or we can just create a basic search route.
      // Let's use the GET /api/channels and filter here for now.
      const res = await fetch('/api/channels');
      const data = await res.json();
      
      const filtered = data.filter((channel: any) => {
        const q = query.toLowerCase();
        return channel.name.toLowerCase().includes(q) || 
               (channel.category && channel.category.name.toLowerCase().includes(q));
      });
      
      setResults(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-6">Search Channels</h1>
        <div className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by channel name or category..."
            className="w-full bg-card border border-gray-700 text-white px-6 py-4 rounded-full text-lg focus:outline-none focus:border-primary transition-colors pl-14"
          />
          <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>
      </div>

      {loading && <div className="text-center py-10"><span className="animate-pulse text-primary font-bold text-xl">Searching...</span></div>}

      {!loading && query.trim() !== '' && results.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No channels found matching "{query}"
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(channel => (
            <ChannelCard key={channel._id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
}
