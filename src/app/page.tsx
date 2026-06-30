import ChannelCard from '@/components/ChannelCard';
import SearchBar from '@/components/SearchBar';
import Scoreboard from '@/components/Scoreboard';
import connectToDatabase from '@/lib/mongodb';
import Channel from '@/models/Channel';
import Category from '@/models/Category';
import MatchModel from '@/models/Match';
import Link from 'next/link';
import { Trophy, Flame, Clock, CalendarDays } from 'lucide-react';

async function getHomeData(searchQuery?: string) {
  try {
    await connectToDatabase();
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 }).lean();
    
    let query = {};
    if (searchQuery) {
      query = { name: { $regex: searchQuery, $options: 'i' } };
    }

    // Fetch channels for different sections
    const liveChannels = await Channel.find({ ...query, status: 'Live' }).populate('category').sort({ createdAt: -1 }).lean();
    const popularChannels = await Channel.find({ ...query, featured: true }).populate('category').sort({ createdAt: -1 }).lean();
    const recentChannels = await Channel.find(query).populate('category').sort({ createdAt: -1 }).lean();

    // Convert _id to string for serialization
    const serializeChannels = (channels: any[]) => channels.map(c => ({
      ...c,
      _id: c._id.toString(),
      category: c.category ? { ...c.category, _id: c.category._id.toString() } : null
    }));

    const serializeCategories = (cats: any[]) => cats.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));

    return {
      categories: serializeCategories(categories),
      liveChannels: serializeChannels(liveChannels),
      popularChannels: serializeChannels(popularChannels),
      recentChannels: serializeChannels(recentChannels),
    };
  } catch (error) {
    console.error("Failed to fetch home data", error);
    return {
      categories: [],
      liveChannels: [],
      popularChannels: [],
      recentChannels: [],
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  
  // Fetch everything in parallel for speed
  const [homeData] = await Promise.all([
    getHomeData(query)
  ]);

  const { categories, liveChannels, popularChannels, recentChannels } = homeData;
  
  let matches: any[] = [];
  try {
    await connectToDatabase();
    const dbMatches = await MatchModel.find({}).sort({ createdAt: -1 }).lean();
    matches = dbMatches.map(m => ({
      ...m,
      _id: m._id.toString(),
      id: m._id.toString(), // Scoreboard uses id
      channelId: m.channelId ? m.channelId.toString() : undefined
    }));
  } catch (error) {
    console.error("Failed to fetch matches", error);
  }

  return (
    <div className="pb-24 overflow-hidden">
      {/* Compact Sports-Themed Hero Banner */}
      <div className="relative min-h-[350px] flex items-center justify-center -mt-16 pt-16 border-b border-primary/20">
        {/* Energetic Green/Gold Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C853]/30 via-black to-black opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-background"></div>
        
        {/* Floating Accent Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center pt-12 pb-16">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 mb-8 tracking-tighter animate-fade-in-up leading-tight">
              Watch Live TV <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00E676] to-[#00C853]">Anywhere</span>
            </h1>
            
            <SearchBar />

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Live Scoreboard */}
        {!query && matches && matches.length > 0 && (
          <section className="animate-fade-in-up w-full py-8" style={{ animationDelay: '0.4s' }}>
            <Scoreboard matches={matches} />
          </section>
        )}

        {/* Horizontal Categories Scroll */}
        <section id="categories" className="animate-fade-in-up relative" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#FFD700]" /> 
              Categories
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          <div className="relative group">
            {/* Fade edges for scroll indication */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex overflow-x-auto gap-3 pb-4 pt-1 snap-x scrollbar-hide hide-scroll-bar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category: any) => (
                <Link 
                  key={category._id} 
                  href={`/category/${category.slug}`}
                  className="flex-shrink-0 snap-start bg-white/5 hover:bg-primary/20 backdrop-blur-md px-6 py-3 rounded-full text-center transition-all duration-300 border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,200,83,0.3)] hover:-translate-y-1"
                >
                  <h3 className="font-bold text-gray-200 uppercase tracking-wide text-sm">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {query && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-white">Search Results for "{query}"</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            {recentChannels.length === 0 ? (
              <p className="text-gray-400 py-8 text-center bg-white/5 rounded-xl border border-white/10">No channels found matching your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {recentChannels.map((channel: any, index: number) => (
                  <div key={channel._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ChannelCard channel={channel} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Popular Channels */}
        {!query && popularChannels.length > 0 && (
          <section className="animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Trending Now
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/20 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {popularChannels.map((channel: any, index: number) => (
                <div key={channel._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Channels */}
        {!query && liveChannels.length > 0 && (
          <section id="live" className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                Live
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-red-500/20 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {liveChannels.map((channel: any, index: number) => (
                <div key={channel._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recently Added */}
        {!query && recentChannels.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                Latest Additions
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recentChannels.map((channel: any, index: number) => (
                <div key={channel._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
