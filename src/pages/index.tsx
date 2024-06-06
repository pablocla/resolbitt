// src/pages/index.tsx
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Bienvenido a ResolbIT
      </h1>
      <p className="mt-4 text-xl text-center text-gray-600">
        Soluciones de software a medida para tu negocio. Desde e-commerce hasta
        servicios en la nube y blockchain.
      </p>
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          Cotizar Software Personalizado
        </button>
      </div>
    </div>
  );
};
export default Home;
