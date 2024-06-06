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
