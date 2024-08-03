import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "~/components/Navbar";
import { Table } from "~/components/table";
import { useState } from 'react';
import Filter  from "~/components/filter";
import Footer from "~/components/footer";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [view, setView] = useState<'table' | 'reports'>('table');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="flex items-center border-b border-gray-300 mb-4 mt-8">
          <button
            onClick={() => setView('table')}
            className={`px-6 py-3 text-center border-none rounded-l-lg cursor-pointer 
              ${view === 'table' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
              ${view === 'table' ? 'active:bg-gray-300' : 'hover:bg-gray-700'} 
              transition duration-300`}
          >
            Senhas
          </button>
          <div className="w-px h-10 bg-gray-300 mx-2"></div>
          <button
            onClick={() => setView('reports')}
            className={`px-6 py-3 text-center border-none rounded-r-lg cursor-pointer 
              ${view === 'reports' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
              ${view === 'reports' ? 'active:bg-gray-300' : 'hover:bg-gray-700'} 
              transition duration-300`}
          >
            Relatório
          </button>
        </div>
        <div>
          {view === 'table' && <Table />}
          {view === 'reports' && <Filter />}
        </div>
      </main>
      <Footer />
    </div>
  );
}