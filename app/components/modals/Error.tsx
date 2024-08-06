import React from 'react';
import Swal from 'sweetalert2';

interface ErrorModalProps {
    error?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error }) => {
    if (error) {
        Swal.fire({
            icon: 'error',
            title: error,
            confirmButtonColor: '#1D4ED8', 
        });
    }

    return null;
};

export default ErrorModal;
