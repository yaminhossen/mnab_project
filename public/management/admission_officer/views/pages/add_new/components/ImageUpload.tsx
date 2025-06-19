import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../common_types/object';

interface ImageUploadProps {
    defaultImage?: string;
    name: string; // Dynamic name prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ defaultImage, name }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle default image
    useEffect(() => {
        if (defaultImage) {
            setPreview(defaultImage);
        }
    }, [defaultImage]);

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                setPreview(defaultImage || null);
                return;
            }

            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                setPreview(defaultImage || null);
                return;
            }
            // Validate file type
            const allowedTypes = [
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/gif',
            ];
            if (!allowedTypes.includes(file.type)) {
                (window as anyObject).toaster(
                    'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.',
                    'warning',
                );
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setError(null);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(defaultImage || null);
            setError(null);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        // Reset input value
        const input = document.querySelector(
            `input[name="${name}"]`,
        ) as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    };

    return (
        <div className="form-group mb-3">
            {/* <label className="form-label">Image</label> */}
            <div className="form_elements mb-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="form-control"
                    placeholder="image"
                    name={name} // Dynamic name prop
                    onChange={handleImageChange}
                />
            </div>
            {error && <div className="text-danger mt-2">{error}</div>}
            {preview && (
                <div className="image-preview position-relative d-inline-block mt-2">
                    <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid"
                        style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            objectFit: 'contain',
                        }}
                    />
                    <button
                        onClick={handleRemove}
                        className="btn position-absolute top-0 translate-middle"
                        style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            color: '#dc3545',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: '1px solid #dc3545',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: '1',
                        }}
                        aria-label="Remove image"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
