'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Tv, MapPin } from 'lucide-react';

export interface Match {
  id: string;
  league: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  date: string;
  time: string;
  location: string;
  status: 'Latest' | 'Upcoming';
  countdown: string;
}

export default function Scoreboard({ matches }: { matches: Match[] }) {
  const [activeTab, setActiveTab] = useState<'Latest' | 'Upcoming'>('Upcoming');

  if (!matches || matches.length === 0) return null;

  const filteredMatches = matches.filter(m => m.status === activeTab);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00E676] mb-6">Live Matches</h2>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('Latest')}
          className={`px-6 py-2.5 rounded-md font-bold text-sm transition-colors ${activeTab === 'Latest' ? 'bg-primary text-background shadow-[0_0_15px_rgba(0,200,83,0.3)]' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
        >
          Latest Matches
        </button>
        <button 
          onClick={() => setActiveTab('Upcoming')}
          className={`px-6 py-2.5 rounded-md font-bold text-sm transition-colors ${activeTab === 'Upcoming' ? 'bg-primary text-background shadow-[0_0_15px_rgba(0,200,83,0.3)]' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
        >
          Upcoming
        </button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((match) => (
          <Link href={`/?search=${encodeURIComponent(match.team1)}`} key={match.id} className="block group">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden relative transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,200,83,0.15)] hover:-translate-y-1">
              
              {/* Background watermark icon (simulating the player silhouette) */}
              <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Trophy className="w-48 h-48 text-white" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FFD700] fill-current" />
                  <span className="text-xs font-bold text-gray-200 tracking-wide uppercase">{match.league}</span>
                </div>
                <Tv className="w-4 h-4 text-gray-400" />
              </div>

              {/* Body */}
              <div className="flex items-center justify-between p-4 relative z-10">
                
                {/* Left: Date/Time/Location */}
                <div className="flex flex-col gap-1 w-1/3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{match.date}</span>
                  <span className="text-sm font-black text-primary">{match.time}</span>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-gray-400 uppercase">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {match.location}
                  </div>
                </div>

                {/* Center: Teams */}
                <div className="flex flex-col gap-3 w-1/3 border-l border-r border-white/10 px-4">
                  <div className="flex items-center gap-3">
                    <img src={match.team1Flag} alt={match.team1} className="w-6 h-6 object-cover rounded-full border border-white/20 shadow-md bg-black/50" />
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{match.team1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={match.team2Flag} alt={match.team2} className="w-6 h-6 object-cover rounded-full border border-white/20 shadow-md bg-black/50" />
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{match.team2}</span>
                  </div>
                </div>

                {/* Right: Starts In */}
                <div className="flex flex-col items-end w-1/3 pl-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{match.status === 'Upcoming' ? 'STARTS IN' : 'STATUS'}</span>
                  <span className="text-xs font-black text-white bg-white/10 border border-white/5 px-2 py-1 rounded">
                    {match.countdown}
                  </span>
                </div>

              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
