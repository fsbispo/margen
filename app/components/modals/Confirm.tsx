import React from 'react';
import Swal from 'sweetalert2';
import { FaCheckCircle } from 'react-icons/fa';

interface ConfirmRecordProps {
    id: string;
    name: string;
    fetchRecords: () => void; 
}

const ConfirmModal: React.FC<ConfirmRecordProps> = ({ id, name, fetchRecords }) => {
    const handleConfirm = () => {
        Swal.fire({
            html: `Confirma baixa do(a): <strong>${name}</strong>!`,
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
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/confirm-record`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetchRecords();
                        Swal.fire(
                            'Seu registro foi confirmado com sucesso.',
                            '',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            data.message || 'Ocorreu um erro ao confirmar o registro.',
                            '',
                            'error'
                        );
                    }
                })
                .catch(error => {
                    Swal.fire(
                        'Ocorreu um erro ao confirmar o registro.',
                        '',
                        'error'
                    );
                });
            }
        });
    };

    return (
        <button onClick={handleConfirm} title='Confirmar' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaCheckCircle size={17} color="#2F80ED" />
        </button>
    );
};

export default ConfirmModal;
