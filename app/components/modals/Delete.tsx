import React from 'react';
import Swal from 'sweetalert2';
import { FaTrashAlt } from 'react-icons/fa'; 

interface TrashRecordProps {
    id: string;
    name: string;
}

const DeleteModal: React.FC<TrashRecordProps> = ({ id, name }) => {
    const handleDelete = () => {
        Swal.fire({
            html: `Confirma a exclusão da senha do(a): <strong>${name}</strong>!`,
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
        <button onClick={handleDelete} title='Excluir' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaTrashAlt size={20} color="#2F80ED" />
        </button>
    );
};

export default DeleteModal;
