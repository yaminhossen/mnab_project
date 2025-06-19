import React, { useImperativeHandle, forwardRef, useState } from 'react';

export interface InputImageProps {
    label: string;
    name: string;
    defalut_preview?: string;
}

export interface InputImageRef {
    reset: () => void;
}

const InputImage = forwardRef<InputImageRef, InputImageProps>(
    ({ label, name, defalut_preview = '' }, ref) => {
        const [preview, setPreview] = useState(defalut_preview);
        const [file, setFile] = useState<File | null>(null);

        useImperativeHandle(ref, () => ({
            reset: () => {
                setFile(null);
                setPreview('');
            },
        }));

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
            }
        };

        return (
            <div>
                {label && <label>{label}</label>}
                <input
                    type="file"
                    style={{ width: 212 }}
                    name={name}
                    onChange={handleChange}
                />
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: 100, marginTop: 5 }}
                    />
                )}
            </div>
        );
    },
);

export default InputImage;
