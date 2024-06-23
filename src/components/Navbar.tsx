import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  FaUserPlus,
  FaSearch,
  FaSignOutAlt,
  FaPlusCircle,
  FaFileInvoice,
} from "react-icons/fa";

const Navbar = ({
  onQuickAction,
}: {
  onQuickAction: (action: string) => void;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isDashboardOrInternal = router.pathname.startsWith("/app");

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
                <Link href="/auth/singup" legacyBehavior passHref>
                  <a className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition duration-300">
                    Registrarse
                  </a>
                </Link>
              </li>
            </>
          )}
          {status === "authenticated" && (
            <>
              {isDashboardOrInternal && (
                <>
                  <li>
                    <button
                      onClick={() => onQuickAction("addClient")}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300"
                    >
                      <FaUserPlus className="mr-2" /> Agregar Cliente
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onQuickAction("searchPrice")}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300"
                    >
                      <FaSearch className="mr-2" /> Buscar Precio
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onQuickAction("createProduct")}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300"
                    >
                      <FaPlusCircle className="mr-2" /> Crear Producto
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onQuickAction("createInvoice")}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300"
                    >
                      <FaFileInvoice className="mr-2" /> Crear Factura
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition duration-300"
                >
                  <FaSignOutAlt className="mr-2" /> Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      {!isDashboardOrInternal && (
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
      )}
    </nav>
  );
};

export default Navbar;
