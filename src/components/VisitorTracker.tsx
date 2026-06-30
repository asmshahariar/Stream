'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Generate a unique ID for this session/tab if one doesn't exist
    let visitorId = sessionStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('visitorId', visitorId);
    }

    // Ping the visitors API to record activity
    const recordVisit = () => {
      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId })
      }).catch(console.error);
    };

    // Record on initial load
    recordVisit();

    // Ping every 1 minute to keep "online" status active
    // The server considers users "online" if active in last 5 minutes
    const interval = setInterval(recordVisit, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
