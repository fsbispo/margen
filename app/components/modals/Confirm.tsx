import React from 'react';
import Swal from 'sweetalert2';
import { FaCheckCircle } from 'react-icons/fa'; 

interface ConfirmRecordProps {
    id: string;
    name: string;
}

const ConfirmModal: React.FC<ConfirmRecordProps> = ({ id, name }) => {
    const handleConfirm = () => {
        Swal.fire({
            html: `Confirma baixa do(a): <strong>${name}</strong>!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#28a745', 
            cancelButtonColor: '#dc3545', 
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Excluído!',
                    'Seu registro foi excluído.',
                    'success'
                );
            }
        });
    };

    return (
        <button onClick={handleConfirm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaCheckCircle size={20} color="#2F80ED" />
        </button>
    );
};

export default ConfirmModal;
