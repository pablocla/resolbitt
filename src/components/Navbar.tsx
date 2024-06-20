import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior passHref>
          <a>
            <Image
              src="/logo.png"
              alt="ResolbIT"
              width={50}
              height={50}
              className="logo"
            />
          </a>
        </Link>
        {status === "unauthenticated" && (
          <ul className="flex space-x-4">
            <li>
              <Link href="/auth/signin" legacyBehavior passHref>
                <a className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
                  Iniciar Sesión
                </a>
              </Link>
            </li>
            <li>
              <Link href="/auth/singup" legacyBehavior passHref>
                <a className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md">
                  Registrarse
                </a>
              </Link>
            </li>
          </ul>
        )}
        {status === "authenticated" && (
          <ul className="flex space-x-4">
            <li>
              <Link href="/app/dashboard" legacyBehavior passHref>
                <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
              >
                Log Out
              </button>
            </li>
          </ul>
        )}
      </div>
      {status === "unauthenticated" && (
        <div className="mt-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" legacyBehavior passHref>
                <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                  Cotizar Software Personalizado
                </a>
              </Link>
            </li>
            <li>
              <Link href="/ecommerce" legacyBehavior passHref>
                <a className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                  E-commerce
                </a>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
