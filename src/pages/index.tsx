<<<<<<< HEAD
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Home: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white">
      <Head>
        <title>ResolbIT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-7xl mx-auto py-12 px-6 sm:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a ResolbIT</h1>
        <p className="mt-4 text-xl">
          Soluciones de software a medida para tu negocio. Desde e-commerce
          hasta servicios en la nube y blockchain .
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/quote">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
              Cotizar Software Personalizado
            </button>
          </Link>
          <Link href="/facturador">
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
              Ir al Facturador
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
=======
// pages/index.tsx
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Bienvenido a ResolbIT
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Soluciones de software a medida para tu negocio. Desde e-commerce
          hasta servicios en la nube y blockchain.
        </p>
        <a
          href="/quote"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          Cotizar Software Personalizado
        </a>
      </div>
    </Layout>
  );
}
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
