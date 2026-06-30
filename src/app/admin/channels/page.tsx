'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ChannelsManagement() {
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', slug: '', logo: '', category: '', description: '', 
    streamUrl: '', streamType: 'Auto', status: 'Live', featured: false 
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [chRes, catRes] = await Promise.all([
        fetch('/api/channels'),
        fetch('/api/categories')
      ]);
      setChannels(await chRes.json());
      const cats = await catRes.json();
      setCategories(cats);
      if (cats.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: cats[0]._id }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/channels/${editingId}` : '/api/channels';
      const method = editingId ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', slug: '', logo: '', category: categories.length > 0 ? categories[0]._id : '', 
      description: '', streamUrl: '', streamType: 'Auto', status: 'Live', featured: false 
    });
    setEditingId(null);
  }

  const handleEdit = (channel: { _id: string, name: string, slug: string, logo: string, description: string, streamUrl: string, streamType: string, status: string, featured: boolean, category: { _id: string, [key: string]: unknown } | null, [key: string]: unknown }) => {
    setFormData({ 
      name: channel.name, slug: channel.slug, logo: channel.logo, category: channel.category?._id || '', 
      description: channel.description, streamUrl: channel.streamUrl, streamType: channel.streamType, 
      status: channel.status, featured: channel.featured 
    });
    setEditingId(channel._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      try {
        await fetch(`/api/channels/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Channels</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-primary hover:bg-primary-hover text-background px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus className="w-5 h-5"/> Add Channel</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input type="text" value={formData.name} onChange={e => {
                  const val = e.target.value;
                  setFormData({...formData, name: val, slug: val.toLowerCase().replace(/\s+/g, '-')})
                }} required className="w-full bg-background border border-gray-700 p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className="w-full bg-background border border-gray-700 p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="w-full bg-background border border-gray-700 p-2 rounded">
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
              <input type="text" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full bg-background border border-gray-700 p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Stream URL</label>
              <input type="url" value={formData.streamUrl} onChange={e => setFormData({...formData, streamUrl: e.target.value})} required className="w-full bg-background border border-gray-700 p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Stream Type</label>
              <select value={formData.streamType} onChange={e => setFormData({...formData, streamType: e.target.value})} className="w-full bg-background border border-gray-700 p-2 rounded">
                <option value="Auto">Auto Detect</option>
                <option value="HLS">HLS (.m3u8)</option>
                <option value="TS">TS</option>
                <option value="MP4">MP4</option>
                <option value="DASH">DASH (.mpd)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background border border-gray-700 p-2 rounded">
                <option value="Live">Live</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm text-gray-400">Featured Channel (shows on home page)</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-gray-700 p-2 rounded" rows={3}></textarea>
            </div>
          </div>
          <button type="submit" className="bg-primary text-background font-bold py-2 px-6 rounded">
            {editingId ? 'Update Channel' : 'Save Channel'}
          </button>
        </form>
      )}

      <div className="bg-card rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="p-4 font-semibold text-gray-400">Name</th>
              <th className="p-4 font-semibold text-gray-400">Category</th>
              <th className="p-4 font-semibold text-gray-400">Status</th>
              <th className="p-4 font-semibold text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch, i) => (
              <tr key={ch._id} className={i !== channels.length - 1 ? "border-b border-gray-800" : ""}>
                <td className="p-4 font-medium flex items-center gap-3">
                  {ch.logo && <img src={ch.logo} className="w-8 h-8 rounded bg-gray-900 object-contain" alt=""/>}
                  {ch.name}
                  {ch.featured && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-1 rounded uppercase font-bold">Featured</span>}
                </td>
                <td className="p-4 text-gray-400">{ch.category?.name || 'Unknown'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${ch.status === 'Live' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-400'}`}>
                    {ch.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(ch)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded mr-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(ch._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
            {channels.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No channels found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
