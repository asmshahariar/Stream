'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tv } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <Tv className="w-12 h-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-2 px-4 rounded transition-colors mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
