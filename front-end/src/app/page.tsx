'use client';

import React, { useState, useEffect } from 'react';
import PublicLanding from '../components/public-landing';
import AuthenticatedDashboard from '../components/dashboard';
import { authService } from '../services/auth.service';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user: sessionUser } = await authService.getMe();
        if (sessionUser) {
          setUser(sessionUser);
          localStorage.setItem('user', JSON.stringify(sessionUser));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Failed to log out cleanly on server:', err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <svg 
          className="h-8 w-8 animate-spin text-rose-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
      </div>
    );
  }

  if (user) {
    return <AuthenticatedDashboard user={user} onSignOut={handleSignOut} />;
  }

  return <PublicLanding />;
}
