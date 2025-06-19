import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back one step in browser history
    };

    return (
        <div className="position-fixed top-0 end-0 p-3">
            <button
                onClick={handleBack}
                className="btn btn-sm btn-outline-info mb-2 d-flex align-items-center gap-2"
            >
                <span>&larr;</span> Back
            </button>
        </div>
    );
};

export default BackButton;
