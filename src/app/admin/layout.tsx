'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Tv, List, LogOut, CalendarDays } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated' && pathname !== '/admin/login') {
    router.push('/admin/login');
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary text-background' : 'hover:bg-gray-800'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/categories' ? 'bg-primary text-background' : 'hover:bg-gray-800'}`}>
            <List className="w-5 h-5" />
            Categories
          </Link>
          <Link href="/admin/channels" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/channels' ? 'bg-primary text-background' : 'hover:bg-gray-800'}`}>
            <Tv className="w-5 h-5" />
            Channels
          </Link>
          <Link href="/admin/matches" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/matches' ? 'bg-primary text-background' : 'hover:bg-gray-800'}`}>
            <CalendarDays className="w-5 h-5" />
            Matches
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-gray-800 w-full text-left transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
