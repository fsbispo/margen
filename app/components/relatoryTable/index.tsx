import { FaRegFileExcel } from 'react-icons/fa';
import { FiPrinter } from "react-icons/fi";
import * as XLSX from 'xlsx';
import { RecordResponse } from '~/interfaces/IRecord';
import logo from '~/assets/images/logotipo-margen-med.png'

interface RelatorioProps {
    data: RecordResponse[];
}

export const Relatorio: React.FC<RelatorioProps> = ({ data }) => {
    const handlePrint = () => {
        window.print();
    };

    const handleExportToExcel = () => {
        const ws = XLSX.utils.aoa_to_sheet([
            ["Nome", "Empresa", "Exame", "Clínica", "Entrada", "Saída", "Permanência", "Status", "Observação"],
            ...data.map(record => [
                record.name,
                record.company,
                record.type,
                record.clinic,
                record.entryAtString,
                record.confirmedAtString || '',
                record.permanence,
                record.status,
                record.observation
            ])
        ]);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Relatório");

        XLSX.writeFile(wb, "relatorio.xlsx");
    };

    return (
        <div className="p-4">
            <img
                src={logo}
                alt="Logotipo"
                className="mb-4 ml-4"
                style={{ width: '170px' }}
            />
            <div className="flex space-x-4 mb-4">
                <FaRegFileExcel
                    className="text-xl cursor-pointer"
                    onClick={handleExportToExcel}
                />
                <FiPrinter
                    className="text-xl cursor-pointer"
                    onClick={handlePrint}
                />
            </div>
            <div className="flex justify-between items-center mb-4">
                <span>DATA INICIAL - DATA FINAL</span>
                <span>DATA FINAL</span>
            </div>
            <div className="flex justify-center mb-4">
                <span className="font-bold">TOTAL - </span>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-1 py-1 text-xs">NOME</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">EMPRESA</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">EXAME</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">CLÍNICA</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">OBSERVAÇÃO</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">ENTRADA</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">SAÍDA</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">PERMANÊNCIA</th>
                        <th className="border border-gray-300 px-1 py-1 text-xs">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(record => (
                        <tr key={record.id.toString()}>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.name}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.company}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.type}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.clinic}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.observation}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.entryAtString}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.confirmedAtString || ''}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.permanence}</td>
                            <td className="border border-gray-300 px-1 py-1 text-xs text-center">{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Relatorio;
