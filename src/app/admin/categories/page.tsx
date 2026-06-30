'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: '', status: 'active' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setShowForm(false);
      setFormData({ name: '', slug: '', icon: '', status: 'active' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: { _id: string, name: string, slug: string, icon: string, status: string, [key: string]: unknown }) => {
    setFormData({ name: category.name, slug: category.slug, icon: category.icon, status: category.status });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button 
          onClick={() => {
            setFormData({ name: '', slug: '', icon: '', status: 'active' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-primary hover:bg-primary-hover text-background px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus className="w-5 h-5"/> Add Category</>}
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
              <label className="block text-sm text-gray-400 mb-1">Icon URL (optional)</label>
              <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-background border border-gray-700 p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background border border-gray-700 p-2 rounded">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-primary text-background font-bold py-2 px-6 rounded">
            {editingId ? 'Update Category' : 'Save Category'}
          </button>
        </form>
      )}

      <div className="bg-card rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="p-4 font-semibold text-gray-400">Name</th>
              <th className="p-4 font-semibold text-gray-400">Slug</th>
              <th className="p-4 font-semibold text-gray-400">Status</th>
              <th className="p-4 font-semibold text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat._id} className={i !== categories.length - 1 ? "border-b border-gray-800" : ""}>
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-400">{cat.slug}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${cat.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {cat.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(cat)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded mr-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
