import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Renderiza nada en el servidor
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Menu</h2>
        </div>
        <ul className="mt-4">
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link href="/app/stock">Stock Management</Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link href="#">Item 1</Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link href="#">Item 2</Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link href="#">Item 3</Link>
          </li>
        </ul>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 w-full text-left hover:bg-gray-700"
        >
          Sign Out
        </button>
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </main>
    </div>
  );
}
