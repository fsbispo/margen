import React from 'react';
import Swal from 'sweetalert2';
import { FaTrash } from "react-icons/fa";

interface TrashRecordProps {
    id: string;
    name: string;
    fetchRecords: () => void; 
}

const DeleteModal: React.FC<TrashRecordProps> = ({ id, name, fetchRecords }) => {
    const handleDelete = async () => {
        Swal.fire({
            html: `Confirma a exclusão do registro de <strong>${name}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1D4ED8', // Cor do botão de buscar
            cancelButtonColor: '#D1D5DB', // Cor do botão de limpar
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                cancelButton: 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 focus:ring-gray-500',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/delete-record`, { 
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id }), 
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Erro desconhecido');
                    }

                    fetchRecords(); 
                    Swal.fire(
                        'Excluído com sucesso!',
                        '',
                        'success'
                    );
                } catch (error) {
                    Swal.fire(
                        'Falha ao excluir o registro.',
                        error instanceof Error ? error.message : 'Erro desconhecido',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <button onClick={handleDelete} title='Excluir' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaTrash size={17} color="#2F80ED" />
        </button>
    );
};

export default DeleteModal;
