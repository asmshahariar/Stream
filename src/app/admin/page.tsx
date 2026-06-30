'use client';

import { useEffect, useState } from 'react';
import { Users, Tv, List } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ online: 0, today: 0, total: 0 });
  const [counts, setCounts] = useState({ channels: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchStats() {
      try {
        const [visitorsRes, channelsRes, categoriesRes] = await Promise.all([
          fetch('/api/visitors'),
          fetch('/api/admin/channels'),
          fetch('/api/admin/categories')
        ]);
        
        const visitors = await visitorsRes.json();
        const channels = await channelsRes.json();
        const categories = await categoriesRes.json();

        setStats(visitors);
        setCounts({ channels: channels.length, categories: categories.length });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
    interval = setInterval(fetchStats, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-full">
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Online Visitors</p>
            <p className="text-2xl font-bold">{stats.online}</p>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Today's Visitors</p>
            <p className="text-2xl font-bold">{stats.today}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-full">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Visitors</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-yellow-500/10 rounded-full">
            <Tv className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Channels</p>
            <p className="text-2xl font-bold">{counts.channels}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-pink-500/10 rounded-full">
            <List className="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Categories</p>
            <p className="text-2xl font-bold">{counts.categories}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
