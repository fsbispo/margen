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
            confirmButtonColor: '#007bff', 
        });
    }

    return null;
};

export default ErrorModal;
