// src/components/reports.tsx
import React from 'react';

const Filter: React.FC = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Data Inicial</label>
          <input
            type="datetime-local"
            id="start-date"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Data Final</label>
          <input
            type="datetime-local"
            id="end-date"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="open-passwords"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="open-passwords" className="ml-2 text-sm font-medium text-gray-700">Exibir senhas abertas</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="closed-passwords"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="closed-passwords" className="ml-2 text-sm font-medium text-gray-700">Exibir senhas encerradas</label>
          </div>
        </div>
        <div className="col-span-1">
          <label htmlFor="clinic" className="block text-sm font-medium text-gray-700">Clínica</label>
          <select
            id="clinic"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Selecione uma clínica</option>
            {/* Adicione mais opções conforme necessário */}
            <option value="clinic1">Clínica 1</option>
            <option value="clinic2">Clínica 2</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          Limpar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg border border-blue-600 shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default Filter;
