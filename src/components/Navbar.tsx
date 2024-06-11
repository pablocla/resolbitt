import Link from "next/link";
<<<<<<< HEAD
=======
import Image from "next/image";
>>>>>>> 335cb947fcf6f33099042e37cb61fcfafd34b159

const Navbar = () => {
  return (
    <nav className="navbar bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
<<<<<<< HEAD
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
=======
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
        <ul className="nav-links flex">
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
>>>>>>> 335cb947fcf6f33099042e37cb61fcfafd34b159
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
