import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white/75 text-sm">
      <div className="w-[92%] max-w-[1500px] mx-auto py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Bloc 1: Navigation */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">Navigation</h6>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/recherche" className="hover:underline">
                Recherche
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="hover:underline">
                À propos
              </Link>
            </li>
          </ul>
        </div>

        {/* Bloc 2: Pour les gérants */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">
            Pour les gérants
          </h6>
          <ul className="space-y-2">
            <li>
              <Link href="/login" className="hover:underline">
                Connexion
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:underline">
                Inscription
              </Link>
            </li>
          </ul>
        </div>

        {/* Bloc 3: Liens légaux */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">
            Informations
          </h6>
          <ul className="space-y-2">
            <li>
              <Link href="/cgu" className="hover:underline">
                CGU
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:underline">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:underline">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>

        {/* Bloc 4: Contact */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">Contact</h6>
          <ul className="space-y-2">
            <li>
              Email :{" "}
              <a
                href="mailto:support@optua.com"
                className="hover:underline"
              >
                support@optua.com
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Formulaire de contact
              </Link>
            </li>
            <li>
              <a
                href="https://discord.gg/UxFBQ6QAvw"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black/10 text-center py-6 border-t border-white/10 text-white/50">
        © {new Date().getFullYear()} Copyright –{" "}
        <Link href="/" className="font-semibold text-white hover:underline">
          Optua
        </Link>
      </div>
    </footer>
  );
}
