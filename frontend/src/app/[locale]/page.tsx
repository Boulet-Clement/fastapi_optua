import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  const trans = useTranslations('Home');
  const locale = useLocale();

  return (
    <main className="w-full text-center py-10">
      <div className="w-[92%] max-w-[1500px] mx-auto min-h-[75vh] space-y-8">
        <div className="flex flex-col md:flex-row md:justify-center md:gap-24 text-left">
          {/* Left */}
          <div className="md:w-[40%] bg-white p-6 rounded-lg shadow flex flex-col justify-between mb-6 md:mb-0">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {trans('pros.title')}
              </h2>
              
              <Image
                src="/images/pro.png"
                alt="Image Pro"
                width={400}
                height={100}
                className="w-full h-100 object-cover rounded mb-2"
              />
              
              <p className="text-gray-700 mb-6">
                {trans('pros.text')}
              </p>
            </div>
            <div className="mx-auto">
              <a
                href={ROUTES.register(locale)}
                className="block w-full sm:inline-block text-center px-5 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition"
              >
                {trans('pros.ctaLabel')}
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="md:w-[40%] bg-white p-6 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {trans('particuliers.title')}
              </h2>

              <Image
                src="/images/particulier.png"
                alt="Image Particulier"
                width={400}
                height={100}
                className="w-full h-100 object-cover rounded mb-2"
              />

              <p className="text-gray-700 mb-6">
                {trans('particuliers.text')}
              </p>
            </div>
            <div className="mx-auto">
              <a
                href={ROUTES.search(locale)}
                className="block w-full sm:inline-block text-center px-5 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition"
              >
                {trans('particuliers.ctaLabel')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
