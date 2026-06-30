import Link from 'next/link';
import Image from 'next/image';
import { Tv, PlayCircle } from 'lucide-react';

interface ChannelCardProps {
  channel: {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    category?: { name: string };
    status: string;
  }
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <Link href={`/watch/${channel.slug}`} className="block w-full">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(0,200,83,0.2)] hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="relative aspect-video bg-black/50 flex items-center justify-center p-4 overflow-hidden">
          {channel.logo ? (
            <img 
              src={channel.logo} 
              alt={channel.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
            />
          ) : (
            <Tv className="w-10 h-10 text-gray-600 transition-transform duration-500 group-hover:scale-110" />
          )}
          
          {/* Subtle inner shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-2xl" />
          </div>
          
          {channel.status === 'Live' && (
            <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm border border-red-500/50 text-white text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              LIVE
            </div>
          )}
        </div>
        
        <div className="p-4 relative z-10 bg-gradient-to-b from-transparent to-black/60">
          <h3 className="font-bold text-base text-gray-100 mb-0.5 truncate group-hover:text-primary transition-colors">{channel.name}</h3>
          {channel.category && (
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{channel.category.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
