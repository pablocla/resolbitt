import { signOut } from "next-auth/react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Menu</h2>
      </div>
      <ul className="mt-4">
        <li className="px-4 py-2 hover:bg-gray-700">
          <a href="#">Item 1</a>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700">
          <a href="#">Item 2</a>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700">
          <a href="#">Item 3</a>
        </li>
      </ul>
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 w-full text-left hover:bg-gray-700"
      >
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
