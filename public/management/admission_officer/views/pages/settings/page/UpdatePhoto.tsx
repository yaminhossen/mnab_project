import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InputImage, { InputImageRef } from './InputImage';
import { Link } from 'react-router-dom';

const UpdatePhoto: React.FC = () => {
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState<{ image?: string }>({});
    const [data, setData] = useState<any>();
    const formRef = useRef<HTMLFormElement>(null);
    const inputImageRef = useRef<InputImageRef>(null); // ref for InputImage

    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(
    //             '/api/v1/user-staffs/staff-details',
    //         );
    //         setData(response.data.data);
    //     } catch (error) {
    //         setError(error);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    const fetchData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/user-staffs/basic-information',
            );
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
        const image = formData.get('image') as File;
        const newErrors: { image?: string } = {};

        if (!image || image.size === 0) {
            newErrors.image = 'Please select the image.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            await axios.post('/api/v1/user-staffs/profile-update', formData);
            (window as any).toaster('Updated successfully!');
            form.reset();
            inputImageRef.current?.reset(); // reset preview manually
            fetchData();
        } catch (error) {
            console.log('error', error);
            setError(error);
        }
    };

    return (
        <div className="admin_dashboard">
            <div className="dues_back_btn">
                <h3 className="table_heading"></h3>
                <button className="back_btn settings_bacsk">
                    <Link to="/settings">
                        <span className="material-symbols-outlined fill">
                            arrow_back
                        </span>
                        <div className="text">Back</div>
                    </Link>
                </button>
            </div>
            <div className="content_body">
                {/* <div className="settings_back">
                    <Link
                        className="btn btn-sm btn-outline-info mb-1"
                        to="/settings"
                    >
                        Back
                    </Link>
                </div> */}
                <form
                    onSubmit={handleSubmit}
                    className="form_600 mx-auto pt-3"
                    ref={formRef}
                >
                    <div className="form-group form-horizontal">
                        <label>Previous Photo</label>
                        <div className="form_elements">
                            <img src={data?.image} alt="" />
                        </div>
                    </div>

                    <div className="form-group form-horizontal">
                        <label>New Photo</label>
                        <div className="form_elements">
                            <InputImage
                                ref={inputImageRef}
                                label=""
                                name="image"
                                defalut_preview=""
                            />
                            {errors.image && (
                                <p style={{ color: 'red' }}>{errors.image}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-group student_submit form-horizontal">
                        <div className="form_elementss">
                            <button className="btn btn-sm btn-outline-info">
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePhoto;
