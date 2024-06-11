import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="navbar bg-gray-800 text-white p-4">
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
        <ul className="nav-links flex space-x-4">
          <li>
            <Link href="/" legacyBehavior passHref>
              <a className="px-4 py-2 hover:bg-gray-700 rounded">
                Cotizar Software Personalizado
              </a>
            </Link>
          </li>
          <li>
            <Link href="/ecommerce" legacyBehavior passHref>
              <a className="px-4 py-2 hover:bg-gray-700 rounded">E-commerce</a>
            </Link>
          </li>
          <li>
            <Link href="/cloud-services" legacyBehavior passHref>
              <a className="px-4 py-2 hover:bg-gray-700 rounded">
                Cloud Services
              </a>
            </Link>
          </li>
          <li>
            <Link href="/blockchain" legacyBehavior passHref>
              <a className="px-4 py-2 hover:bg-gray-700 rounded">Blockchain</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/signin" legacyBehavior passHref>
              <a className="px-4 py-2 hover:bg-gray-700 rounded">
                Iniciar Sesión
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
