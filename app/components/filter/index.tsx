import React, { useState } from 'react';
import { Clinic } from '~/enumerators/Clinic';
import { ClinicText } from '~/enumerators/Clinic';
import { Status } from '~/enumerators/Status';
import Swal from 'sweetalert2';
import { Table } from '../table';

const DateInput: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, value, onChange }) => (
  <div className="col-span-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="datetime-local"
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 cursor-pointer"
    />
  </div>
);

const Checkbox: React.FC<{ id: string, label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
    />
    <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
  </div>
);

const Filter: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clinic, setClinic] = useState('');
  const [status, setStatus] = useState<Status[]>([]);
  const [showOpenPasswords, setShowOpenPasswords] = useState(false);
  const [showClosedPasswords, setShowClosedPasswords] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [view, setView] = useState<'table' | 'list'>('table');
  const [query, setQuery] = useState<URLSearchParams>(new URLSearchParams());

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatus([]);
    setClinic('');
    setShowOpenPasswords(false);
    setShowClosedPasswords(false);
  };

  const handleSearch = async () => {
    const newStatus: Status[] = [];
    if (showOpenPasswords) newStatus.push(Status.PENDENTE);
    if (showClosedPasswords) newStatus.push(Status.CONCLUIDO);

    if (newStatus.length === 0) {
      Swal.fire({
        title: 'Selecione pelo menos um status para buscar!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
      });
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        title: 'A data final deve ser posterior à data inicial!',
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
      });
      return;
    }

    const newQuery = new URLSearchParams({
      startDate,
      endDate,
      clinic,
      status: newStatus.length > 0 ? newStatus.join(',') : '',
    });

    setQuery(newQuery);
    setStatus(newStatus);

    try {
      const response = await fetch(`/search-records?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data); 
        setView('table'); 
      } else {
        Swal.fire({
          title: 'Erro ao buscar registros!',
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Erro de rede!',
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
      });
    }
  };

  return (
    <>
    <div className="w-full mx-auto border border-gray-300 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DateInput
          id="start-date"
          label="Data Inicial"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <DateInput
          id="end-date"
          label="Data Final"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className="col-span-1">
          <Checkbox
            id="open-passwords"
            label="Exibir senhas abertas"
            checked={showOpenPasswords}
            onChange={(e) => setShowOpenPasswords(e.target.checked)}
          />
          <Checkbox
            id="closed-passwords"
            label="Exibir senhas encerradas"
            checked={showClosedPasswords}
            onChange={(e) => setShowClosedPasswords(e.target.checked)}
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="clinic" className="block text-sm font-medium text-gray-700">Clínica</label>
          <select
            id="clinic"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 cursor-pointer"
          >
            <option className="p-2" disabled value="">Selecione uma clínica</option>
            <option className="p-2" value={Clinic.GERAL}>{ClinicText[Clinic.GERAL]}</option>
            <option className="p-2" value={Clinic.JACAREI}>{ClinicText[Clinic.JACAREI]}</option>
            <option className="p-2" value={Clinic.SJC}>{ClinicText[Clinic.SJC]}</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 cursor-pointer"
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg border border-blue-600 shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 cursor-pointer"
        >
          Buscar
        </button>
      </div>
    </div>
    {records.length > 0 && view === 'table' && <Table data={records} relatory={true} fetchRecords={handleSearch} query={ query }/>}
    </>
  );
};

export default Filter;
