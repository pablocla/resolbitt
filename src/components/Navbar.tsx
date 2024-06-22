import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/app/dashboard" legacyBehavior passHref>
          <a className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="ResolbIT"
              width={50}
              height={50}
              className="logo"
            />
            <span className="text-xl font-bold">ResolbIT</span>
          </a>
        </Link>
        <ul className="flex space-x-4 items-center">
          {status === "unauthenticated" && (
            <>
              <li>
                <Link href="/auth/signin" legacyBehavior passHref>
                  <a className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300">
                    Iniciar Sesión
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" legacyBehavior passHref>
                  <a className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition duration-300">
                    Registrarse
                  </a>
                </Link>
              </li>
            </>
          )}
          {status === "authenticated" && (
            <>
              <li>
                <Link href="/app/dashboard" legacyBehavior passHref>
                  <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300">
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition duration-300"
                >
                  Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="mt-4">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Link href="/quote" legacyBehavior passHref>
              <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300">
                Cotizar Software Personalizado
              </a>
            </Link>
          </li>
          <li>
            <Link href="/app/dashboard" legacyBehavior passHref>
              <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300">
                Facturador
              </a>
            </Link>
          </li>
          <li>
            <Link href="/about" legacyBehavior passHref>
              <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300">
                Sobre nosotros
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
