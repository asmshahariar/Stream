'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import { usePathname } from 'next/navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <SessionProvider>
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
    </SessionProvider>
  );
}
