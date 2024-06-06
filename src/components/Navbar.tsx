// src/components/Navbar.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Image src="/logo.png" alt="ResolbIT Logo" width={150} height={50} />
      </div>
      <ul className="nav-links">
        <li>
          <Link href="/quote" legacyBehavior>
            <a>Cotizar Software Personalizado</a>
          </Link>
        </li>
        <li>
          <Link href="/ecommerce" legacyBehavior>
            <a>E-commerce</a>
          </Link>
        </li>
        <li>
          <Link href="/cloud-services" legacyBehavior>
            <a>Cloud Services</a>
          </Link>
        </li>
        <li>
          <Link href="/blockchain" legacyBehavior>
            <a>Blockchain</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
