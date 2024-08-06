import { Link } from "@remix-run/react";

export function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Margen
        </div>
        <div className="space-x-4">
          <Link to="/logout" className="hover:bg-gray-700 px-3 py-2 rounded">Sair</Link>
        </div>
      </div>
    </nav>
  );
}
