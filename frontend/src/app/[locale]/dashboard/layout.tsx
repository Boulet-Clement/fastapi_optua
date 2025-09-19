'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ROUTES } from '@/constants/routes';
import { API_ROUTES } from '@/constants/api_routes';
import Link from 'next/link';
import Title2 from '@/components/ui/Titles/Title2';

import {
  Home,
  Building2,
  CreditCard,
  Settings,
  Menu,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface UserData {
  message: string;
  user: {
    sub: string;
    email: string;
    exp: number;
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const trans = useTranslations('DashboardLayout');
  const locale = useLocale();
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: trans('home'), href: ROUTES.dashboard.index(locale), icon: Home },
    { name: trans('organizations'), href: ROUTES.dashboard.organizations.index(locale), icon: Building2 },
    { name: trans('billing'), href: ROUTES.dashboard.billing(locale), icon: CreditCard },
    { name: trans('settings'), href: ROUTES.dashboard.settings(locale), icon: Settings },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(API_ROUTES.dashboard, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error(trans('must_login'));

        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        router.push(ROUTES.auth.login(locale)) // Redirige si erreur / pas connecté
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, trans]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-2 text-primary">{trans('loading')}</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <AlertCircle className="w-8 h-8 mr-2" />
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 inset-y-0 left-0 w-64 bg-gray-100 border-r p-6 transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <Title2>{trans('my_space')}</Title2>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {data?.user?.email && (
            <p className="text-sm text-gray-600 mb-6">{data.user.email}</p>
        )}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            let isActive = false;

            // Exact match prioritaire
            if (item.href === ROUTES.dashboard.index(locale)) {
              isActive = pathname === ROUTES.dashboard.index(locale);
            // Sinon on peut autoriser les sous-routes
            } else if (pathname.startsWith(item.href)) {
              isActive = true;
            }
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold">{trans('dashboard')}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
