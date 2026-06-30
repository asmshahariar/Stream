'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

interface Match {
  _id: string;
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
  channelId?: string;
}

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [channels, setChannels] = useState<{_id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const [formData, setFormData] = useState({
    league: '',
    team1: '',
    team2: '',
    team1Flag: '',
    team2Flag: '',
    date: '',
    time: '',
    location: '',
    status: 'Upcoming',
    countdown: '',
    channelId: ''
  });

  useEffect(() => {
    fetchMatches();
    fetchChannels();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/admin/matches');
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/admin/channels');
      const data = await res.json();
      setChannels(data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingMatch ? `/api/admin/matches/${editingMatch._id}` : '/api/admin/matches';
    const method = editingMatch ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMatches();
        setFormData({ league: '', team1: '', team2: '', team1Flag: '', team2Flag: '', date: '', time: '', location: '', status: 'Upcoming', countdown: '', channelId: '' });
        setEditingMatch(null);
      }
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    try {
      const res = await fetch(`/api/admin/matches/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const openEditModal = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      league: match.league,
      team1: match.team1,
      team2: match.team2,
      team1Flag: match.team1Flag,
      team2Flag: match.team2Flag,
      date: match.date,
      time: match.time,
      location: match.location,
      status: match.status,
      countdown: match.countdown || '',
      channelId: match.channelId || ''
    });
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading matches...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Matches</h1>
        <button
          onClick={() => {
            setEditingMatch(null);
            setFormData({ league: '', team1: '', team2: '', team1Flag: '', team2Flag: '', date: '', time: '', location: '', status: 'Upcoming', countdown: '', channelId: '' });
            setIsModalOpen(true);
          }}
          className="bg-primary text-background px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={20} /> Add Match
        </button>
      </div>

      <div className="bg-card border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50 text-gray-400">
              <th className="p-4 font-medium">League</th>
              <th className="p-4 font-medium">Match</th>
              <th className="p-4 font-medium">Date/Time</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-4 text-sm">{match.league}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <img src={match.team1Flag} alt={match.team1} className="w-6 h-6 object-cover rounded-full" />
                    <span>{match.team1} vs {match.team2}</span>
                    <img src={match.team2Flag} alt={match.team2} className="w-6 h-6 object-cover rounded-full" />
                  </div>
                </td>
                <td className="p-4 text-sm">{match.date} {match.time}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${match.status === 'Latest' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-300'}`}>
                    {match.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(match)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(match._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold">{editingMatch ? 'Edit Match' : 'Add New Match'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">League Name</label>
                  <input
                    type="text"
                    required
                    value={formData.league}
                    onChange={e => setFormData({...formData, league: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. FIFA WORLD CUP 2026 - ROUND OF 32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location / Stadium</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. DHAKA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team 1 Name</label>
                  <input
                    type="text"
                    required
                    value={formData.team1}
                    onChange={e => setFormData({...formData, team1: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team 2 Name</label>
                  <input
                    type="text"
                    required
                    value={formData.team2}
                    onChange={e => setFormData({...formData, team2: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team 1 Flag URL</label>
                  <input
                    type="text"
                    required
                    value={formData.team1Flag}
                    onChange={e => setFormData({...formData, team1Flag: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team 2 Flag URL</label>
                  <input
                    type="text"
                    required
                    value={formData.team2Flag}
                    onChange={e => setFormData({...formData, team2Flag: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. TUE 30 JUN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Time or Score</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. 11:00 pm or 2 - 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'Latest' | 'Upcoming'})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Latest">Latest (Live/Finished)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Countdown Text</label>
                  <input
                    type="text"
                    value={formData.countdown}
                    onChange={e => setFormData({...formData, countdown: e.target.value})}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. 4h : 0m : 41s or Played"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Linked Channel (For 'Watch Live' button)</label>
                <select
                  value={formData.channelId}
                  onChange={e => setFormData({...formData, channelId: e.target.value})}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">-- No linked channel (use search) --</option>
                  {channels.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-primary text-background font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
