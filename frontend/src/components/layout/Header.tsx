"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { ROUTES } from '@/constants/routes';
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const trans = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText.trim()) {
      router.push(ROUTES.search(locale))
    } else {
      router.push(ROUTES.search_with_query(locale, encodeURIComponent(searchText)))
    }    
  };

  const hideSearchBar = pathname.startsWith(`/${locale}/search`);

  return (
    <header className="bg-white shadow-md relative z-10">
      <div className="w-[92%] max-w-[1500px] mx-auto py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Colonne 1 : Logo + Burger */}
          <div className="flex justify-between items-center md:block">
            <Link href={ROUTES.home(locale)} className="relative w-[60px] h-[60px] inline-block text-center">
              <Image
                src="/images/logo-optua.png"
                alt="Logo Optua"
                fill
                className="object-contain"
                sizes="60px"
                priority
              />
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-gray-600 hover:text-primary focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Colonne 2 : Recherche */}
          {!hideSearchBar && (
            <form className="relative w-full md:flex-1 md:max-w-[500px]" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                name={trans('searchBar.name')}
                placeholder={trans('searchBar.placeholder')}
                className="w-full px-4 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </button>
            </form>
          )}

          {/* Colonne 3 : Menu desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={ROUTES.home(locale)} className="text-gray-600 hover:text-primary">
              {trans('menu.links.home')}
            </Link>
            <Link href={ROUTES.search(locale)} className="text-gray-600 hover:text-primary">
              {trans('menu.links.search')}
            </Link>
            <Link href={ROUTES.auth.login(locale)} className="text-gray-600 hover:text-primary">
              {trans('menu.links.account')}
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Menu latéral mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-600 hover:text-primary focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-4 space-y-4">
          <Link href={ROUTES.home(locale)} className="block text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
            {trans('menu.links.home')}
          </Link>
          <Link href="/services" className="block text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
            Services
          </Link>
          <Link href={ROUTES.auth.login(locale)} className="block text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
            {trans('menu.links.account')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
