import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full text-center py-10">
      <div className="w-[92%] max-w-[1500px] mx-auto min-h-[75vh] space-y-8">
        {/* Deux blocs côte à côte */}
        <div className="flex flex-col md:flex-row md:justify-center md:gap-24 text-left">
          {/* Bloc gauche */}
          <div className="md:w-[40%] bg-white p-6 rounded-lg shadow flex flex-col justify-between mb-6 md:mb-0">
            <div>
              <h2 className="text-2xl font-bold mb-2">Titre Pro</h2>
              
              <Image
                src="/images/pro.png"
                alt="Image Pro"
                width={400}
                height={100}
                className="w-full h-100 object-cover rounded mb-2"
              />
              
              <p className="text-gray-700 mb-6">
                Texte descriptif pour le bloc Pro.
              </p>
            </div>
            <div className="mx-auto">
              <a
                href="/register"
                className="block w-full sm:inline-block text-center px-5 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition"
              >
                CTA Pro
              </a>
            </div>
          </div>

          {/* Bloc droit */}
          <div className="md:w-[40%] bg-white p-6 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Titre Particulier</h2>

              <Image
                src="/images/particulier.png"
                alt="Image Particulier"
                width={400}
                height={100}
                className="w-full h-100 object-cover rounded mb-2"
              />

              <p className="text-gray-700 mb-6">
                Texte descriptif pour le bloc Particulier.
              </p>
            </div>
            <div className="mx-auto">
              <a
                href="/search"
                className="block w-full sm:inline-block text-center px-5 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition"
              >
                CTA Particulier
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
