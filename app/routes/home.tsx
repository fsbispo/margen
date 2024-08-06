import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FiPlusCircle } from 'react-icons/fi';
import { Navbar } from '~/components/nav/Navbar';
import { Table } from '~/components/table';
import Filter from '~/components/filter';
import Footer from '~/components/footer';
import { ExamType } from '~/enumerators/ExamType';
import { RecordResponse } from '~/interfaces/IRecord';
import { Clinic } from '~/enumerators/Clinic';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { getSession } from '~/sessions';
import { verifyToken } from '~/utils/auth.server';

const MySwal = withReactContent(Swal);

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token || !await verifyToken(token)) {
    return redirect("/login"); 
  }

  return null;
};

export default function Home() {
  const [view, setView] = useState<'table' | 'reports'>('table');
  const [records, setRecords] = useState<RecordResponse[]>([]);
  const [clinic, setClinic] = useState<number>(0);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`/records?type=${clinic}`);
      const result = await response.json();
      
      if (response.ok) {
        setRecords(result);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      MySwal.fire({
        title: 'Erro!',
        text: error.message,
        icon: 'error',
      });
    }
  };

  useEffect(() => {

    fetchRecords();
  }, [clinic]); 

  const openCreateModal = async () => {
    const { value: formData } = await MySwal.fire({
      title: 'Registrar Nova Senha',
      html: `
<div class="space-y-4">
  <input id="swal-input1" class="swal2-input w-5/6" placeholder="Nome">
  <input id="swal-input2" class="swal2-input w-5/6" placeholder="Empresa">
  <select id="swal-input3" class="swal2-input w-5/6 border border-gray-300 rounded-md">
    <option value="-1" disabled selected>Selecione um tipo de exame</option>
    <option value="${ExamType.EXAME_CLINICO}">Exame clínico</option>
    <option value="${ExamType.EXAME_SIMPLES}">Exame simples</option>
    <option value="${ExamType.COMPLEMENTARES}">Exame complementar</option>
  </select>
  <select id="swal-input5" class="swal2-input w-5/6 border border-gray-300 rounded-md">
    <option value="-1" disabled selected>Selecione uma clínica</option>
    <option value="${Clinic.SJC}">São José dos Campos</option>
    <option value="${Clinic.JACAREI}">Jacareí</option>
  </select>
  <input id="swal-input6" type="datetime-local" step="2"class="swal2-input w-5/6">
</div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const company = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const type = (document.getElementById('swal-input3') as HTMLSelectElement).value;
        const clinic = parseInt((document.getElementById('swal-input5') as HTMLSelectElement).value, 10);
        const entryAt = (document.getElementById('swal-input6') as HTMLInputElement).value;

        if (!name) {
          Swal.showValidationMessage('Preencha o nome do paciente!');
          return false;
        }

        if (type === "-1") {
          Swal.showValidationMessage('Selecione um tipo de exame!');
          return false;
        }

        if (!entryAt) {
          Swal.showValidationMessage('Insira uma data de entrada!');
          return false;
        }

        return { name, company, type, clinic, entryAt };
      },
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1D4ED8',
      cancelButtonColor: '#6B7280',
      showCancelButton: true,
    });

    if (formData) {
      try {
        const response = await fetch('/record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          MySwal.fire({
            title: 'Sucesso!',
            text: 'Nova senha registrada com sucesso.',
            icon: 'success',
          });
          // Recarregar os registros após adicionar um novo
          const updatedRecordsResponse = await fetch(`/records?type=${clinic}`);
          const updatedRecords = await updatedRecordsResponse.json();
          if (updatedRecordsResponse.ok) {
            setRecords(updatedRecords);
          }
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        MySwal.fire({
          title: 'Erro!',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col justify-center w-full">
      <main className="flex-grow w-11/12 mx-auto">
        <div className="flex justify-center">
          <div className="flex items-center border-b border-gray-300 mb-4 mt-8 w-[100%]">
            <button
              onClick={() => setView('table')}
              className={`px-6 py-3 text-center border mr-1 border-gray-300 rounded-tl-lg rounded-tr-lg cursor-pointer 
                ${view === 'table' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} 
                transition duration-300`}
            >
              Senhas
            </button>
            <button
              onClick={() => setView('reports')}
              className={`px-6 py-3 text-center border mr-1 border-gray-300 rounded-tl-lg rounded-tr-lg cursor-pointer 
                ${view === 'reports' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} 
                transition duration-300`}
            >
              Relatório
            </button>
            <button
              onClick={openCreateModal}
              className='flex justify-center items-center rounded-tl-lg rounded-tr-lg px-3 py-3 cursor-pointer hover:bg-[#DDDDDD] transition duration-300'
            >
              <FiPlusCircle className="mr-1" />
              Nova Senha
            </button>
          </div>
        </div>
        <div>
          {view === 'table' && <Table data={records} fetchRecords={fetchRecords} />}
          {view === 'reports' && <Filter />}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
