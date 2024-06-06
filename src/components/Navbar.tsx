const Navbar = () => {
  return (
    <nav className="navbar bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/">
          <img src="/logo.png" alt="ResolbIT" className="logo" />
        </a>
        <ul className="nav-links flex">
          <li>
            <a href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              Cotizar Software Personalizado
            </a>
          </li>
          <li>
            <a href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              E-commerce
            </a>
          </li>
          <li>
            <a href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              Cloud Services
            </a>
          </li>
          <li>
            <a href="/" className="px-4 py-2 hover:bg-gray-700 rounded">
              Blockchain
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
