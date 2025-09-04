import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Annuaire Pro</h1>
      <nav className="space-x-4">
        <Link href="/">Accueil</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  );
}
