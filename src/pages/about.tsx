import React from "react";
import Head from "next/head";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white">
      <Head>
        <title>About Us - ResolbIT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg mb-4">
          ResolbIT es un proyecto de testing dedicado a la comercialización de
          software y servicios de digitalización empresarial. Nuestro objetivo
          es ofrecer soluciones tecnológicas eficientes y personalizadas para
          mejorar los procesos empresariales de nuestros clientes.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Tecnologías Utilizadas</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Next.js</li>
          <li>Tailwind CSS</li>
          <li>Prisma</li>
          <li>PostgreSQL</li>
          <li>Azure Cloud</li>
          <li>Clerk para autenticación</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Software y Servicios Ofrecidos
        </h2>
        <ul className="list-disc list-inside mb-4">
          <li>Desarrollo de software personalizado</li>
          <li>Plataformas educativas</li>
          <li>Aplicaciones personalizadas</li>
          <li>Soluciones de e-commerce</li>
          <li>Servicios en la nube</li>
          <li>Blockchain</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Arquitectura del Sistema
        </h2>
        <p className="text-lg mb-4">
          Nuestra arquitectura se basa en una estructura moderna y escalable
          utilizando Next.js para la construcción de interfaces de usuario,
          Tailwind CSS para el diseño responsivo, Prisma para la gestión de
          bases de datos, y Azure Cloud para el alojamiento y la gestión de
          recursos. Implementamos Clerk para manejar la autenticación y la
          administración de usuarios, asegurando así una experiencia de usuario
          segura y eficiente.
        </p>
      </main>
    </div>
  );
};

export default About;
