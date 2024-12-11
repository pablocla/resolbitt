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
  FaTachometerAlt,
  FaUsers,
  FaBoxes,
  FaClipboardList,
  FaCog,
  FaWarehouse,
  FaShoppingCart,
} from "react-icons/fa";

const Navbar = ({ onQuickAction }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 rounded-lg shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/app/dashboard">
          <div className="flex items-center space-x-3 cursor-pointer">
            <Image
              src="/logo.png"
              alt="ResolbIT"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-white">ResolbIT</span>
          </div>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/app/dashboard">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaTachometerAlt className="mr-2" /> Dashboard
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/customers">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaUsers className="mr-2" /> Clientes
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/products">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaBoxes className="mr-2" /> Productos
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/sales">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaClipboardList className="mr-2" /> Ventas
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/inventory">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaWarehouse className="mr-2" /> Inventario
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/invoicing">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaFileInvoice className="mr-2" /> Facturación
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/orders">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaShoppingCart className="mr-2" /> Pedidos
              </div>
            </Link>
          </li>
          <li>
            <Link href="/app/settings">
              <div className="text-white flex items-center px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer">
                <FaCog className="mr-2" /> Configuraciones
              </div>
            </Link>
          </li>
          {status === "authenticated" && (
            <li>
              <button
                onClick={() => signOut()}
                className="text-white flex items-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition duration-300"
              >
                <FaSignOutAlt className="mr-2" /> Log Out
              </button>
            </li>
          )}
          {status === "unauthenticated" && (
            <>
              <li>
                <Link href="/auth/signin">
                  <div className="text-white flex items-center px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 cursor-pointer">
                    Iniciar Sesión
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/auth/signup">
                  <div className="text-white flex items-center px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition duration-300 cursor-pointer">
                    Registrarse
                  </div>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
