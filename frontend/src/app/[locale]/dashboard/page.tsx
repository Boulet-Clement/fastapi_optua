'use client';

import { useEffect, useState } from 'react';

interface UserData {
  message: string;
  user: {
    sub: string;
    email: string;
    exp: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:8000/auth/dashboard', {
            method: 'GET',
            credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Vous devez être connecté');
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchDashboard();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Chargement...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>{data.message}</p>
      <p>Email : {data.user.email}</p>
    </div>
  );
}
