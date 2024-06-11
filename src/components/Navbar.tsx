import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <img src="/logo.png" alt="ResolbIT" className="logo" />
        </Link>
        <ul className="nav-links flex space-x-4">
          <li>
            <Link href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              Cotizar Software Personalizado
            </Link>
          </li>
          <li>
            <Link href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              E-commerce
            </Link>
          </li>
          <li>
            <Link href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              Cloud Services
            </Link>
          </li>
          <li>
            <Link href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              Blockchain
            </Link>
          </li>
          {/*     <li>
            <Link href="/auth/signup" className="px-4 py-2 hover:bg-gray-700 rounded">
              Registro
            </Link>
          </li>*/}
          <li>
            <Link
              href="/auth/signin"
              className="px-4 py-2 hover:bg-gray-700 rounded"
            >
              Iniciar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
