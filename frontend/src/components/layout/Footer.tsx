import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  const trans = useTranslations('Footer');
  const locale = useLocale();

  return (
    <footer className="bg-primary text-white/75 text-sm">
      <div className="w-[92%] max-w-[1500px] mx-auto py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Bloc 1: Navigation */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">
            {trans('menu.titles.navigation')}
          </h6>
          <ul className="space-y-2">
            <li>
              <Link href={ROUTES.home(locale)} className="hover:underline">
                {trans('menu.links.home')}
              </Link>
            </li>
            <li>
              <Link href="/recherche" className="hover:underline">
                {trans('menu.links.search')}
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="hover:underline">
                {trans('menu.links.roadmap')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Bloc 2: Pour les gérants */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">
            {trans('menu.titles.pros')}
          </h6>
          <ul className="space-y-2">
            <li>
              <Link href="/login" className="hover:underline">
                {trans('menu.links.login')}
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:underline">
                {trans('menu.links.register')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Bloc 3: Liens légaux */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">
            {trans('menu.titles.informations')}
          </h6>
          <ul className="space-y-2">
            <li>
              <Link href="/cgu" className="hover:underline">
                {trans('menu.links.cgu')}
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:underline">
                {trans('menu.links.policies')}
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:underline">
                {trans('menu.links.mandatoryInformations')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Bloc 4: Contact */}
        <div>
          <h6 className="mb-4 font-semibold uppercase text-white">
            {trans('menu.titles.contact')}
          </h6>
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
        <Link href={ROUTES.home(locale)} className="font-semibold text-white hover:underline">
          Optua
        </Link>
      </div>
    </footer>
  );
}
